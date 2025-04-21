import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Import the disaster keyword mapping
const disasterKeywordMap = {
    "All Disasters": [],
    "Avalanche": ["avalanche"],
    "Blizzard": ["blizzard"],
    "Drought": ["drought"],
    "Duststorm": ["duststorm"],
    "Earthquake": ["earthquake"],
    "Volcanic Eruption": ["eruption", "volcano"],
    "Flood": ["flood", "flooding"],
    "Hailstorm": ["hailstorm"],
    "Hurricane": ["hurricane"],
    "Landslide": ["landslide"],
    "Tornado": ["tornado"],
    "Wildfire": ["wildfire", "fire"]
};

// Function to determine disaster type from tweet text
const getDisasterType = (text) => {
    if (!text) return "Disaster";
    
    const lowerText = text.toLowerCase();
    
    for (const [disasterType, keywords] of Object.entries(disasterKeywordMap)) {
        if (disasterType === "All Disasters") continue;
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                return disasterType;
            }
        }
    }
    
    return "Disaster"; // Default if no specific disaster type is found
};

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TweetMarkerMap = ({ tweetLocations }) => {
    const hasLocations = tweetLocations && tweetLocations.length > 0;
    const [selectedTweet, setSelectedTweet] = useState(null);
    const [selectedDisaster, setSelectedDisaster] = useState("All Disasters");

    const handleMarkerClick = (tweet) => {
        setSelectedTweet(tweet);
    };

    const handleDisasterFilter = (event) => {
        setSelectedDisaster(event.target.value);
    };

    const filteredLocations = tweetLocations.filter(tweet => {
        if (selectedDisaster === "All Disasters") return true;
        return getDisasterType(tweet.text) === selectedDisaster;
    });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#f5f5f5",
                minHeight: "10vh",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "1000px",
                    marginBottom: "1rem",
                }}
            >
                <select
                    value={selectedDisaster}
                    onChange={handleDisasterFilter}
                    style={{
                        width: "100%",
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        backgroundColor: "white",
                        cursor: "pointer",
                    }}
                >
                    {Object.keys(disasterKeywordMap).map((disaster) => (
                        <option key={disaster} value={disaster}>
                            {disaster}
                        </option>
                    ))}
                </select>
            </div>
            <div
                style={{
                    width: "100%",
                    maxWidth: "1000px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                }}
            >
                {!hasLocations ? (
                    <div style={{ 
                        padding: "64px 32px", 
                        textAlign: "center",
                        height: "600px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <h2 style={{ marginBottom: "16px", color: "#333" }}>No Active Disaster Locations</h2>
                        <p style={{ color: "#666", maxWidth: "80%" }}>
                            There are no reported disasters with location data in the last 24 hours.
                            The map will update automatically when new data becomes available.
                        </p>
                        <p style={{ color: "#999", fontSize: "14px", marginTop: "16px" }}>
                            Last checked: {new Date().toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <MapContainer
                        center={[37.0902, -95.7129]} // Centered on US
                        zoom={4}
                        style={{
                            height: "600px",
                            width: "100%",
                        }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {filteredLocations.map((tweet, index) => (
                            <Marker
                                key={index}
                                position={[tweet.lat, tweet.lng]}
                                eventHandlers={{
                                    click: () => handleMarkerClick(tweet)
                                }}
                            >
                                <Popup>
                                    <div>
                                        <h3>{getDisasterType(tweet.text)} Alert</h3>
                                        <p>Latitude: {tweet.lat}</p>
                                        <p>Longitude: {tweet.lng}</p>
                                        {tweet.original_text ? (
                                            <p>Info: {tweet.original_text}</p>
                                        ) : (
                                            tweet.text && <p>Info: {tweet.text}</p>
                                        )}
                                        <button 
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${tweet.lat},${tweet.lng}`, '_blank')}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginTop: '8px'
                                            }}
                                        >
                                            View in Google Maps
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default TweetMarkerMap; 