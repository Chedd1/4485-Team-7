import { useState, useEffect, useRef } from "react";
import { tweetService } from './services/api'; // <-- fixed path
 
const disasterColors = {
    Avalanche: { background: "#FFF", text: "#000", border: "#476684" },
    Blizzard: { background: "#6EB0EF", text: "#000", border: "#87CEEB" },
    Drought: { background: "#AD9270", text: "#000", border: "#855C50" },
    Duststorm: { background: "#FDD674", text: "#000", border: "#C1972D" },
    Earthquake: { background: "#D6B5A6", text: "#000", border: "#AB846F" },
    "Volcanic Eruption": { background: "#F32B0D", text: "#FFF", border: "#FCB930" },
    Flood: { background: "#0000FF  ", text: "#FFF", border: "#000088 " },
    Hailstorm: { background: "#D0D1E1", text: "#000", border: "#B4B3AE" },
    Hurricane: { background: "#A4948E", text: "#000", border: "#907C75" },
    Landslide: { background: "#A05C53", text: "#000", border: "#8B4513" },
    Tornado: { background: "#899A9F", text: "#000", border: "#7D7D7D" },
    Wildfire: { background: "#FA5D0A", text: "#000", border: "#FF4500" }
};

// Map disaster categories to their related keywords
const disasterKeywordMap = {
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
    "Wildfire": ["wildfire"]
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
    const tabContainerRef = useRef(null);

    // Calculate counts for each category
    const getCategoryCount = (category) => {
        if (category === "All") {
            return tweets.length;
        }
        return tweets.filter(tweet => {
            const keyword = tweet.keyword.toLowerCase();
            if (disasterKeywordMap[category] && disasterKeywordMap[category].includes(keyword)) {
                return true;
            }
            return keyword === category.toLowerCase();
        }).length;
    };

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
                    keyword: tweet.keyword,
                    sentiment_score: tweet.sentiment_score
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
        : tweets.filter(tweet => {
            const keyword = tweet.keyword.toLowerCase();
            if (disasterKeywordMap[activeTab] && disasterKeywordMap[activeTab].includes(keyword)) {
                return true;
            }
            return keyword === activeTab.toLowerCase();
        })
    ).slice();
    
    // Function to refresh the data
    const refreshData = async () => {
        try {
            setLoading(true);
            const data = await tweetService.getRecentTweets();
            const parsed = data.map(tweet => ({
                id: tweet.id || tweet.text,
                text: tweet.original_text,
                keyword: tweet.keyword,
                sentiment_score: tweet.sentiment_score
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
        <div style={{ backgroundColor: "#333", minHeight: "100vh", padding: "16px", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div 
                    ref={tabContainerRef}
                    style={{ 
                        display: "flex", 
                        gap: "24px",
                        overflowX: "auto",
                        paddingBottom: "8px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#ffffff50 transparent",
                        "&::-webkit-scrollbar": {
                            height: "4px"
                        },
                        "&::-webkit-scrollbar-track": {
                            background: "transparent"
                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#ffffff50",
                            borderRadius: "4px"
                        }
                    }}
                >
                    {["All", "Avalanche", "Blizzard", "Drought", "Duststorm", "Earthquake", "Volcanic Eruption", "Flood","Hailstorm", "Hurricane", "Landslide", "Tornado", "Wildfire"].map(tab => (
                        <h1
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                borderBottom: activeTab === tab ? "3px solid white" : "none",
                                paddingBottom: "4px",
                                opacity: activeTab === tab ? 1 : 0.6,
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {tab}
                            <span style={{
                                fontSize: "14px",
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                padding: "2px 6px",
                                borderRadius: "12px"
                            }}>
                                {getCategoryCount(tab)}
                            </span>
                        </h1>
                    ))}
                </div>
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
                        // Determine which disaster category the keyword belongs to
                        let categoryForKeyword = tweet.keyword;  // Default
                        const keyword = tweet.keyword.toLowerCase();
                        
                        // Find which category this keyword belongs to
                        for (const [category, keywords] of Object.entries(disasterKeywordMap)) {
                            if (keywords.includes(keyword)) {
                                categoryForKeyword = category;
                                break;
                            }
                        }
                        
                        const colorScheme = disasterColors[categoryForKeyword] || disasterColors.Hurricane;
                    
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
                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    marginTop: "8px",
                                    fontSize: "14px"
                                }}>
                                    <span style={{ 
                                        padding: "4px 8px", 
                                        borderRadius: "4px",
                                        backgroundColor: tweet.sentiment_score > 0 ? "#e6f7e6" : tweet.sentiment_score < 0 ? "#ffe6e6" : "#f5f5f5",
                                        color: tweet.sentiment_score > 0 ? "#2e7d32" : tweet.sentiment_score < 0 ? "#c62828" : "#616161"
                                    }}>
                                        Sentiment: {tweet.sentiment_score !== null ? tweet.sentiment_score.toFixed(2) : "N/A"}
                                    </span>
                                </div>
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