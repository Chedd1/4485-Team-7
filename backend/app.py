import uvicorn
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlmodel import Session, select
from database import dbPost, get_session, engine
import asyncio
from datetime import datetime
import time
import threading
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import postFetcher first
from postFetcher import fetch_posts

# Try to import validate, but handle potential errors
try:
    from validate import main as score_posts
    logger.info("Successfully imported validate module")
except Exception as e:
    logger.error(f"Error importing validate module: {e}")
    # Define a dummy function in case the import fails
    def score_posts():
        logger.error("Cannot score posts: validate module failed to load")
        return

app = FastAPI()

# Configure CORS
origins = ["http://localhost:5173"]  # Your frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to track the background tasks
fetch_thread = None
score_thread = None
is_fetching_complete = False

def run_fetch_posts():
    """
    Run the fetch_posts function in a separate thread continuously
    """
    global is_fetching_complete
    while True:
        try:
            logger.info("Starting tweet fetching process...")
            fetch_posts()
            logger.info("Tweet fetching completed. Waiting before next fetch...")
            is_fetching_complete = True  # Set to True to allow scoring to start
            time.sleep(120)  # Wait 2 minutes before next fetch
        except Exception as e:
            logger.error(f"Error in tweet fetching: {e}")
            time.sleep(120)  # Wait 2 minutes before retrying

def run_score_posts():
    """
    Run the score_posts function in a separate thread
    """
    global is_fetching_complete
    
    # Wait until fetching is complete
    while not is_fetching_complete:
        logger.info("Waiting for tweet fetching to complete before starting scoring...")
        time.sleep(10)  # Check every 10 seconds
    
    logger.info("Tweet fetching complete. Starting scoring process...")
    
    while True:
        try:
            # Check if there are any unscored posts
            with Session(engine) as session:
                unscored_posts = session.exec(select(dbPost).where(dbPost.score == None)).all()
                unscored_count = len(unscored_posts)
                logger.info(f"Current unscored posts count: {unscored_count}")
                if unscored_count > 0:
                    logger.info(f"Found {unscored_count} unscored posts. Running scoring...")
                    try:
                        # Add more detailed logging
                        logger.info("Starting score_posts function...")
                        score_posts()
                        logger.info("Scoring completed successfully")
                    except Exception as e:
                        logger.error(f"Error during scoring: {str(e)}")
                        logger.error(f"Error type: {type(e).__name__}")
                        logger.error(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")
                        # Add a longer delay on error to prevent rapid retries
                        time.sleep(300)  # Wait 5 minutes before retrying
                        continue
                else:
                    logger.info("No unscored posts found. Waiting...")
            
            time.sleep(60)  # Wait for 1 minute before next scoring
        except Exception as e:
            logger.error(f"Critical error in scoring task: {str(e)}")
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")
            time.sleep(300)  # Wait 5 minutes before retrying

@app.on_event("startup")
async def startup_event():
    """
    Start the background tasks when the FastAPI application starts
    """
    global fetch_thread, score_thread
    
    # Start tweet fetching in a separate thread
    fetch_thread = threading.Thread(target=run_fetch_posts, daemon=True)
    fetch_thread.start()
    
    # Start tweet scoring in a separate thread
    score_thread = threading.Thread(target=run_score_posts, daemon=True)
    score_thread.start()
    
    logger.info("Background tasks started: fetch_thread and score_thread")

# GET all tweets
@app.get("/tweets", response_model=List[dbPost])
def get_all_tweets(session: Session = Depends(get_session)):
    statement = select(dbPost).order_by(dbPost.createdAt.desc())
    tweets = session.exec(statement).all()
    return tweets

# GET tweets by keyword
@app.get("/tweets/keyword/{keyword}", response_model=List[dbPost])
def get_tweets_by_keyword(keyword: str, session: Session = Depends(get_session)):
    statement = select(dbPost).where(dbPost.keyword == keyword)
    tweets = session.exec(statement).all()
    return tweets

# GET tweet locations for heatmap
@app.get("/tweets/locations")
def get_tweet_locations(session: Session = Depends(get_session)):
    statement = select(dbPost).where(dbPost.latitude.is_not(None), dbPost.longitude.is_not(None))
    tweets = session.exec(statement).all()
    return tweets

# GET sentiment scores for all tweets
@app.get("/tweets/sentiment")
def get_sentiment_scores(session: Session = Depends(get_session)):
    statement = select(dbPost).where(dbPost.sentiment_score.is_not(None))
    tweets = session.exec(statement).all()
    return tweets

# POST a new tweet
@app.post("/tweets", response_model=dbPost)
def add_tweet(tweet: dbPost, session: Session = Depends(get_session)):
    session.add(tweet)
    session.commit()
    session.refresh(tweet)
    return tweet

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 