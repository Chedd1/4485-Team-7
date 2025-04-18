import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TweetHeatMap from "./TweetHeatMap.jsx";
import About from "./About.jsx";
import { tweetService } from "./services/api.js"; //  make sure this path is correct
 
function App() {
    const [tweetLocations, setTweetLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
 
    useEffect(() => {
        async function fetchLocations() {
            setLoading(true);
            try {
                // Get locations (already filtered to score 1 in the backend)
                const data = await tweetService.getTweetLocations();
                
                // Ensure data is in the format [{ lat, lng }]
                const locations = data
                    .filter(loc => {
                        // Only include locations with valid coordinates
                        return loc.latitude && loc.longitude;
                    })
                    .map(loc => ({
                        lat: loc.latitude || loc.lat,
                        lng: loc.longitude || loc.lng
                    }));
                
                setTweetLocations(locations);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("Failed to fetch tweet locations:", error);
            } finally {
                setLoading(false);
            }
        }
 
        fetchLocations();
        
        // Set up automatic refresh every 5 minutes
        const refreshInterval = setInterval(fetchLocations, 5 * 60 * 1000);
        
        // Clean up interval on unmount
        return () => clearInterval(refreshInterval);
    }, []);
 
    const refreshData = async () => {
        try {
            setLoading(true);
            const data = await tweetService.getTweetLocations();
            const locations = data
                .filter(loc => loc.latitude && loc.longitude)
                .map(loc => ({
                    lat: loc.latitude || loc.lat,
                    lng: loc.longitude || loc.lng
                }));
            setTweetLocations(locations);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to refresh location data:", error);
        } finally {
            setLoading(false);
        }
    };
 
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
                                <h1 style={{ textAlign: "center" }}>TWEET MAP</h1>
                                <div style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "center", 
                                    padding: "0 16px",
                                    marginBottom: "16px" 
                                }}>
                                    <div style={{ fontSize: "14px", color: "#666" }}>
                                        Last updated: {lastUpdated.toLocaleString()}
                                    </div>
                                    <button 
                                        onClick={refreshData}
                                        style={{
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Refresh Data
                                    </button>
                                </div>
                                {loading ? (
                                    <p style={{ textAlign: "center" }}>Loading map data...</p>
                                ) : (
                                    <TweetHeatMap tweetLocations={tweetLocations} />
                                )}
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