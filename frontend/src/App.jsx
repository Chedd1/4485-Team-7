import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TweetHeatMap from "./TweetHeatMap.jsx";
import About from "./About.jsx";
import { tweetService } from "./services/api.js"; //  make sure this path is correct
 
function App() {
    const [tweetLocations, setTweetLocations] = useState([]);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        async function fetchLocations() {
            try {
                const data = await tweetService.getTweetLocations();
                // Ensure data is in the format [{ lat, lng }]
                const locations = data.map(loc => ({
                    lat: loc.latitude || loc.lat,
                    lng: loc.longitude || loc.lng
                }));
                setTweetLocations(locations);
            } catch (error) {
                console.error("Failed to fetch tweet locations:", error);
            } finally {
                setLoading(false);
            }
        }
 
        fetchLocations();
    }, []);
 
    const lastUpdated = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
 
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
                                                    {loading ? (
                            <p style={{ textAlign: "center" }}>Loading map data...</p>
                                                    ) : (
                            <TweetHeatMap tweetLocations={tweetLocations} />
                                                    )}
                            </div>
                            }/>
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </Router>
    );
}
 
export default App;