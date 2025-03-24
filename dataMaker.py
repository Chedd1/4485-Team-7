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

# Log in to the server
client = Client()
profile = client.login('projectdisaster.bsky.social', 'BskyDisasterAnalysis')

# data storage
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

# List of keywords to search for
keywords = ["avalanche", "blizzard", "cyclone", "drought", "duststorm", "earthquake", "eruption", "flood", "flooding", 
            "hailstorm", "heatwave", "hurricane", "landslide", "tornado", "tsunami", "typhoon", "volcano", "wildfire"]

# Function to preprocess text
def preprocess_text(text):
    # Convert text to lowercase
    text = text.lower()
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    return text

# Function to convert uri to link
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

# Iterate over each keyword and collect data
for keyword in keywords:
    params = {
        "q": keyword,
        "limit": 100,
        "sort": 'latest',
        "since": "2023-01-01T00:00:00Z",
        "until": datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
        "lang": "en",
        "cursor": ''
    }

    response = client.app.bsky.feed.search_posts(params)
    print(f"Posts fetched for keyword '{keyword}': {len(response.posts)}")
    for post in response.posts:
        data["author"].append(post.author.handle)
        processed_text = preprocess_text(post.record.text)
        data["text"].append(processed_text)
        data["keyword"].append(keyword)
        link = convert_uri_to_link(post.uri)
        data["url"].append(link)
        # Extract locations
        locations = extract_locations(processed_text)
        lat, lon = None, None

        data["location"].append(locations[0] if locations else None)

        if locations:
        # Get the first valid geolocation
            for loc in locations:
                lat, lon = get_coordinates(loc)
                if lat and lon:
                    break  # Stop at the first successful geolocation
        
        data["latitude"].append(lat)
        data["longitude"].append(lon)

# Save data to a CSV file
df = pd.DataFrame(data)
df.index.name = 'index'  # Set the name for the index column
df.to_csv('training.csv', index=True)
print("Data saved to collected_posts.csv")