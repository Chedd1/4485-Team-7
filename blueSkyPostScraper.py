from atproto import Client
import time
import pandas as pd
import re
from datetime import datetime

# Log in to the server
client = Client()
profile = client.login('projectdisaster.bsky.social', 'BskyDisasterAnalysis')

# data storage
data_storage = {
    "author": [],
    "text": [],
    "keyword": [],
    "url": [],
}

data = data_storage.copy()

# List of keywords to search for
keywords = ["avalanche", "blizzard", "cyclone", "drought", "duststorm", "earthquake", "eruption", "flood", "flooding", "hailstorm", "heatwave", "hurricane", "landslide", "tornado", "tsunami", "typhoon", "volcano", "wildfire"]

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

# Iterate over each keyword and collect data
for keyword in keywords:
    params = {
        "q": keyword,
        "limit": 40,
        "sort": 'latest',
        "since": "2025-01-01T00:00:00Z",
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

# Save data to a CSV file
df = pd.DataFrame(data)
df.index.name = 'index'  # Set the name for the index column
df.to_csv('training.csv', index=True)
print("Data saved to collected_posts.csv")