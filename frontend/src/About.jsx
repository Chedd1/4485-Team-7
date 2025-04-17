import { useState, useEffect } from "react";
import { tweetService } from './services/api'; // <-- fixed path
 
const disasterColors = {
    Hurricane: { background: "#FFE5B4", text: "#000", border: "#FF6B35" },
    Flood: { background: "#E0F8FF", text: "#000", border: "#0077BE" },
    Earthquake: { background: "#F0F0F0", text: "#000", border: "#808080" },
    Tornado: { background: "#F0E6FF", text: "#000", border: "#6A5ACD" },
    Tsunami: { background: "#E6F3E6", text: "#000", border: "#2E8B57" },
    Wildfire: { background: "#FFFFFF", text: "#000", border: "#2E8B57" }
};
 
function parseTweetDate(timeStr) {
    const [timePart, datePart] = timeStr.split(" - ");
    return new Date(`${datePart} ${timePart}`);
}
 
export default function Home() {
    const [activeTab, setActiveTab] = useState("All");
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
 
    // 🛰️ Fetch tweets on mount
    useEffect(() => {
        async function fetchTweets() {
            setLoading(true);
            try {
                // Get tweets from the last 24 hours
                const data = await tweetService.getRecentTweets();
 
                // Only keep needed fields
                const parsed = data.map(tweet => ({
                    id: tweet.id || tweet.text, // fallback key
                    text: tweet.original_text,
                    keyword: tweet.keyword
                }));
 
                setTweets(parsed);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("Failed to fetch tweets:", error);
            } finally {
                setLoading(false);
            }
        }
 
        fetchTweets();
    }, []);
 
    const filteredTweets = (activeTab === "All"
        ? tweets
        : tweets.filter(tweet => tweet.keyword.toLowerCase() === activeTab.toLowerCase())
    ).slice();
    
    // Function to refresh the data
    const refreshData = async () => {
        try {
            setLoading(true);
            const data = await tweetService.getRecentTweets();
            const parsed = data.map(tweet => ({
                id: tweet.id || tweet.text,
                text: tweet.original_text,
                keyword: tweet.keyword
            }));
            setTweets(parsed);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Failed to refresh tweets:", error);
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div style={{ backgroundColor: "#312f74", minHeight: "100vh", padding: "16px", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "24px" }}>
                    {["All", "Hurricane", "Flood", "Earthquake", "Tornado", "Tsunami", "Wildfire"].map(tab => (
                        <h1
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                borderBottom: activeTab === tab ? "3px solid white" : "none",
                                paddingBottom: "4px",
                                opacity: activeTab === tab ? 1 : 0.6
                            }}
                        >
                            {tab}
                        </h1>
                    ))}
                </div>
                
                <select style={{ padding: "8px", borderRadius: "4px" }}>
                    <option>United States</option>
                    <option>Gulf Coast</option>
                    <option>Pacific Coast</option>
                    <option>Midwest</option>
                    <option>East Coast</option>
                </select>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "14px", color: "#ccc" }}>
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
                
            <div style={{
                height: "calc(100vh - 140px)",
                overflowY: "auto",
                paddingRight: "8px",
                scrollbarWidth: "thin",
                scrollbarColor: "#ffffff50 transparent"
            }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "32px" }}>
                        <p>Loading disaster data...</p>
                    </div>
                ) : filteredTweets.length > 0 ? (
                    filteredTweets.map(tweet => {
                        const colorScheme = disasterColors[tweet.keyword] || disasterColors.Hurricane;
                    
                        return (
                            <div
                                key={tweet.id}
                                style={{
                                    padding: "16px",
                                    marginBottom: "16px",
                                    backgroundColor: colorScheme.background,
                                    color: colorScheme.text,
                                    borderRadius: "8px",
                                    border: `2px solid ${colorScheme.border}`,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                                }}
                            >
                                <p style={{ margin: "8px 0" }}>{tweet.text}</p>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ 
                        textAlign: "center", 
                        padding: "64px 32px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        marginTop: "32px"
                    }}>
                        <h2 style={{ marginBottom: "16px" }}>No Active Disasters</h2>
                        <p>
                            There are no reported disasters in the last 24 hours for{" "}
                            {activeTab === "All" ? "any category" : `the ${activeTab} category`}.
                        </p>
                        <p style={{ marginTop: "16px", fontSize: "14px", color: "#ccc" }}>
                            Please check back later or refresh the data to see the latest updates.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}