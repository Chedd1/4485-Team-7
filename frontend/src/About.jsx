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
 
    // 🛰️ Fetch tweets on mount
    useEffect(() => {
        async function fetchTweets() {
            try {
                const data = await tweetService.getAllTweets();
 
                // Only keep needed fields
                const parsed = data.map(tweet => ({
                    id: tweet.id || tweet.text, // fallback key
                    text: tweet.original_text,
                    // time: tweet.time,
                    keyword: tweet.keyword
                }));
 
                setTweets(parsed);
            } catch (error) {
                console.error("Failed to fetch tweets:", error);
            }
        }
 
        fetchTweets();
    }, []);
 
    const filteredTweets = (activeTab === "All"
        ? tweets
        : tweets.filter(tweet => tweet.category === activeTab)
    ).slice();
 
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
                
            <div style={{
                height: "calc(100vh - 80px)",
                overflowY: "auto",
                paddingRight: "8px",
                scrollbarWidth: "thin",
                scrollbarColor: "#ffffff50 transparent"
            }}>
                {filteredTweets.map(tweet => {
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
                })}
            </div>
        </div>
    );
}