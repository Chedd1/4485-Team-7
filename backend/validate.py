import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import re
from nltk.tokenize import word_tokenize
import nltk
from sqlmodel import Session, select
from database import dbPost, engine
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load trained model and tokenizer
nltk.download('punkt_tab')

# Get the absolute path to the model directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
model_path = os.path.join(project_root, "trained_model_bert_uncased")

logger.info(f"Loading model from: {model_path}")

# Check if the model directory exists
if not os.path.exists(model_path):
    logger.error(f"Model directory not found at: {model_path}")
    raise FileNotFoundError(f"Model directory not found at: {model_path}")

try:
    tokenizer = BertTokenizer.from_pretrained(model_path, local_files_only=True)
    model = BertForSequenceClassification.from_pretrained(model_path, local_files_only=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    model.eval()
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

# Function to clean text (should match preprocessing from training)
def clean_text(text):
    text = re.sub(r"http\S+|www\S+|https\S+", '', text, flags=re.MULTILINE)  # Remove URLs
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    text = re.sub(r"[^a-zA-Z0-9\s']", "", text)  # Keep alphanumeric and apostrophes
    words = word_tokenize(text)
    return " ".join(words)

# Connect to the database and get unscored posts
def get_unscored_posts():
    with Session(engine) as session:
        # Query for posts where score is None
        statement = select(dbPost).where(dbPost.score == None)
        unscored_posts = session.exec(statement).all()
        return unscored_posts

# Update posts with scores in the database
def update_posts_with_scores(posts, scores):
    with Session(engine) as session:
        posts_to_delete = []
        for i, post in enumerate(posts):
            # Get the post from the database to ensure it's the latest version
            db_post = session.get(dbPost, post.id)
            if db_post:
                score = int(scores[i])
                if score == 0:
                    # Add to list of posts to delete
                    posts_to_delete.append(db_post)
                else:
                    # Update score for non-zero posts
                    db_post.score = score
        
        # Delete posts with score 0
        for post in posts_to_delete:
            session.delete(post)
            
        # Commit the changes
        session.commit()
        
        return len(posts_to_delete)  # Return the number of deleted posts

def main():
    # Get unscored posts from the database
    unscored_posts = get_unscored_posts()
    
    if not unscored_posts:
        logger.info("No unscored posts found in the database.")
        return
    
    logger.info(f"Found {len(unscored_posts)} unscored posts.")
    
    # Convert posts to DataFrame for processing
    posts_data = {
        'id': [post.id for post in unscored_posts],
        'text': [post.text for post in unscored_posts],
        'keyword': [post.keyword for post in unscored_posts]
    }
    df = pd.DataFrame(posts_data)
    
    # Preprocess text
    df['text'] = df['text'].astype(str).fillna("").apply(clean_text)
    df['keyword'] = df['keyword'].astype(str).fillna("").apply(clean_text)
    
    # Tokenize text
    encodings = tokenizer(df['text'].tolist(), padding="max_length", truncation=True, max_length=256, return_tensors="pt")
    encodings = {key: val.to(device) for key, val in encodings.items()}
    
    # Predict labels
    with torch.no_grad():
        outputs = model(**encodings)
        predictions = torch.argmax(outputs.logits, axis=1).cpu().numpy()
    
    # Update the database with scores
    deleted_count = update_posts_with_scores(unscored_posts, predictions)
    
    logger.info(f"Successfully processed {len(unscored_posts)} posts: {deleted_count} posts with score 0 were deleted, {len(unscored_posts) - deleted_count} posts were updated with non-zero scores.")

if __name__ == "__main__":
    main()