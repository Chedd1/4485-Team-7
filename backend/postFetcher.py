from atproto import Client
import time
import pandas as pd
import re
from datetime import datetime, timedelta
import spacy
from geopy.geocoders import Nominatim
from sqlmodel import Session, select
from database import dbPost, engine

# Load spaCy model for Named Entity Recognition (NER)
nlp = spacy.load("en_core_web_trf")
geolocator = Nominatim(user_agent="disaster_dashboard")

# Log in to Bluesky
client = Client()
profile = client.login('projectdisaster.bsky.social', 'BskyDisasterAnalysis')

# Data storage
data_storage = {
    "author": [],
    "text": [],
    "original_text": [], 
    "keyword": [],
    "url": [],
    "createdAt": [],
    "location": [],
    "latitude": [],
    "longitude": [],
}

data = data_storage.copy()

# Disaster-related keywords
keywords = ["avalanche", "blizzard", "drought", "duststorm", "earthquake", "eruption", "flood", "flooding", 
            "hailstorm", "hurricane", "landslide", "tornado", "wildfire"]

# Function to preprocess text
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

# Function to convert URI to link
def convert_uri_to_link(uri):
    parts = uri.split('/')
    did = parts[2]
    rkey = parts[4]
    return f"https://bsky.app/profile/{did}/post/{rkey}"

# Function to extract location from text
def extract_locations(text):
    doc = nlp(text)
    locations = [ent.text for ent in doc.ents if ent.label_ in ['GPE', 'LOC', 'FAC']]
    return locations

# Function to get coordinates from a location name
def get_coordinates(location_name):
    try:
        location = geolocator.geocode(location_name, country_codes="US", timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"Error geocoding {location_name}: {e}")
    return None, None

# Function to fetch posts
def fetch_posts():
    for keyword in keywords:
        since_time = (datetime.now() - timedelta(minutes=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
        until_time = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        params = {
            "q": keyword,
            "limit": 100,
            "sort": 'top',
            "since": since_time,
            "until": until_time,
            "lang": "en",
            "cursor": ''
        }

        response = client.app.bsky.feed.search_posts(params)
        print(f"Posts fetched for keyword '{keyword}': {len(response.posts)}")

        for post in response.posts:
            author = post.author.handle
            processed_text = preprocess_text(post.record.text)
            link = convert_uri_to_link(post.uri)
            createdAt = post.record.created_at

            # Extract locations
            locations = extract_locations(processed_text)
            lat, lon = None, None

            if locations:
                # Get the first valid geolocation
                for loc in locations:
                    lat, lon = get_coordinates(loc)
                    if lat and lon:
                        break  # Stop at the first successful geolocation

            # Store data
            data["author"].append(author)
            data["text"].append(processed_text)
            data["original_text"].append(post.record.text)  # Store original text
            data["keyword"].append(keyword)
            data["createdAt"].append(createdAt)
            data["url"].append(link)
            data["location"].append(locations[0] if locations else None)
            data["latitude"].append(lat)
            data["longitude"].append(lon)

        with Session(engine) as session:
            for i in range(len(data["author"])):
                # Check if post with this URL already exists
                existing_post = session.exec(select(dbPost).where(dbPost.url == data["url"][i])).first()
                
                # Only add the post if it doesn't already exist
                if not existing_post:
                    post = dbPost(
                        author=data["author"][i],
                        text=data["text"][i],
                        original_text=data["original_text"][i],
                        keyword=data["keyword"][i],
                        url=data["url"][i],
                        createdAt=data["createdAt"][i],
                        location=data["location"][i],
                        latitude=data["latitude"][i],
                        longitude=data["longitude"][i],
                    )
                    session.add(post)
            session.commit()

        for key in data:
            data[key] = []
    
    print("Tweet fetching completed. Returning to main thread.")

# Start fetching posts
if __name__ == "__main__":
    fetch_posts()