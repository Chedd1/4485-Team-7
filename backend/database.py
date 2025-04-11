import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlmodel import SQLModel, Session, create_engine, Field, select
from datetime import datetime, timezone

# Define the database object
class dbPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    author: str
    text: str
    original_text: str
    keyword: str
    createdAt: str
    url: str
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    score: Optional[int]


DATABASE_URL = "postgresql://neondb_owner:PASS@ep-dawn-rice-aafg5mw4-pooler.westus3.azure.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL, connect_args={})
SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# Function to delete posts with a score of 0
def delete_posts_with_zero_score():
    with Session(engine) as session:
        # Query for posts where score is 0
        statement = select(dbPost).where(dbPost.score == 0)
        zero_score_posts = session.exec(statement).all()
        
        # Delete each post with score 0
        for post in zero_score_posts:
            session.delete(post)
        
        # Commit the changes
        session.commit()
        
        return len(zero_score_posts)  # Return the number of deleted posts