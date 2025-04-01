import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import re
from nltk.tokenize import word_tokenize

# Load trained model and tokenizer
model_path = "./trained_model_bert3_tokenizer"
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

# Function to clean text (should match preprocessing from training)
def clean_text(text):
    text = re.sub(r"http\S+|www\S+|https\S+", '', text, flags=re.MULTILINE)  # Remove URLs
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    text = re.sub(r"[^a-zA-Z0-9\s']", "", text)  # Keep alphanumeric and apostrophes
    words = word_tokenize(text)
    return " ".join(words)

# Load the validation file
input_file = "posts.csv"
df = pd.read_csv(input_file, encoding='utf-8', encoding_errors='ignore')

# Ensure it has the necessary columns
if 'text' not in df.columns or 'keyword' not in df.columns:
    raise ValueError("CSV file must contain 'text' and 'keyword' columns.")

# Preprocess text
df['text'] = df['text'].astype(str).fillna("").apply(clean_text)
df['keyword'] = df['keyword'].astype(str).fillna("").apply(clean_text)
df['text'] = df['text']

# Tokenize text
encodings = tokenizer(df['text'].tolist(), padding="max_length", truncation=True, max_length=256, return_tensors="pt")
encodings = {key: val.to(device) for key, val in encodings.items()}

# Predict labels
with torch.no_grad():
    outputs = model(**encodings)
    predictions = torch.argmax(outputs.logits, axis=1).cpu().numpy()

# Add predictions to the DataFrame
df['validation'] = predictions

# Save to CSV
output_file = "results3.csv"
df.to_csv(output_file, index=False, encoding='utf-8')

print(f"Predictions saved to {output_file}")