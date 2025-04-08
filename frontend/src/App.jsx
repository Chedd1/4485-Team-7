import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TweetHeatMap from "./TweetHeatMap.jsx";
import About from "./About.jsx"; 

const tweetLocations = [
    { lat: 40.7128, lng: -74.0060 }, // New York
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 41.8781, lng: -87.6298 }, // Chicago
    { lat: 29.7604, lng: -95.3698 }, // Houston
    { lat: 33.4484, lng: -112.0740 }, // Phoenix
    { lat: 39.7392, lng: -104.9903 }, // Denver
    { lat: 32.7157, lng: -117.1611 }, // San Diego
    { lat: 47.6062, lng: -122.3321 }, // Seattle
    { lat: 38.9072, lng: -77.0369 }, // Washington DC
    { lat: 25.7617, lng: -80.1918 }, // Miami

    // Repeats for density
    { lat: 40.7128, lng: -74.0060 }, // New York again
    { lat: 40.7128, lng: -74.0060 }, // New York again
    { lat: 34.0522, lng: -118.2437 }, // LA again
    { lat: 41.8781, lng: -87.6298 }, // Chicago again
    { lat: 29.7604, lng: -95.3698 }, // Houston again
    { lat: 40.7128, lng: -74.0060 }, // New York again
    { lat: 40.7128, lng: -74.0060 }, // New York again
    { lat: 34.0522, lng: -118.2437 }, // LA again
    { lat: 41.8781, lng: -87.6298 }, // Chicago again
    { lat: 29.7604, lng: -95.3698 }, // Houston again
];

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Heatmap</Link>
                <Link to="/about">Tweets</Link>
            </nav>
            <div className="main-content">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>
                                <h1 style={{ textAlign: "center" }}> TWEET MAP</h1>
                                <TweetHeatMap tweetLocations={tweetLocations} />
                            </div>
                        }
                    />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
