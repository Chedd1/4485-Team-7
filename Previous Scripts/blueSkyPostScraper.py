from atproto import Client
import time
import pandas as pd
import re
from datetime import datetime, timedelta
import spacy
from geopy.geocoders import Nominatim

# Load spaCy model for Named Entity Recognition (NER)
nlp = spacy.load("en_core_web_sm")
geolocator = Nominatim(user_agent="disaster_dashboard")

# Log in to Bluesky
client = Client()
profile = client.login('projectdisaster.bsky.social', 'BskyDisasterAnalysis')

# Data storage
data_storage = {
    "author": [],
    "text": [],
    "keyword": [],
    "url": [],
    "location": [],
    "latitude": [],
    "longitude": [],
}

data = data_storage.copy()

# Disaster-related keywords
keywords = ["avalanche", "blizzard", "cyclone", "drought", "duststorm", "earthquake", "eruption", "flood", "flooding", 
            "hailstorm", "heatwave", "hurricane", "landslide", "tornado", "tsunami", "typhoon", "volcano", "wildfire"]

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
    locations = [ent.text for ent in doc.ents if ent.label_ == "GPE"]
    return locations

# Function to get coordinates from a location name
def get_coordinates(location_name):
    try:
        location = geolocator.geocode(location_name, timeout=10)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"Error geocoding {location_name}: {e}")
    return None, None

# Function to fetch posts
def fetch_posts():
    while True:
        for keyword in keywords:
            since_time = (datetime.now() - timedelta(minutes=1)).strftime('%Y-%m-%dT%H:%M:%SZ')
            until_time = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
            params = {
                "q": keyword,
                "limit": 50,
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
                data["keyword"].append(keyword)
                data["url"].append(link)
                data["location"].append(locations[0] if locations else None)
                data["latitude"].append(lat)
                data["longitude"].append(lon)

            # Save data to CSV
            df = pd.DataFrame(data)
            df.index.name = 'index'  # Set index name
            df.to_csv('feeder.csv', index=True)
            print("Data saved to feeder.csv")

        time.sleep(60)  # Wait 1 minute before fetching new posts

# Start fetching posts
fetch_posts()
