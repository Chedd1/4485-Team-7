import { useState } from "react";
import { Link } from "react-router-dom";

//randomly generated example tweets - will need to add coordinates for these for the map
const tweets = [
    {
        id: 1,
        user: "Sarah Martinez",
        handle: "@sarahsafe",
        text: "Hurricane winds getting intense in New Orleans. Power just went out. Stay safe everyone! 🌀",
        time: "2:45 PM - Sep 15 2024",
        category: "Hurricane",
        stats: { likes: "5,579", retweets: "1,240", comments: "3,887" }
    },
    {
        id: 2,
        user: "Michael Chen",
        handle: "@mikeemergency",
        text: "Flood waters rising fast in Houston. Heading to higher ground. Praying for everyone's safety. 🌊",
        time: "11:22 AM - May 20 2024",
        category: "Flood",
        stats: { likes: "4,332", retweets: "987", comments: "2,456" }
    },
    {
        id: 3,
        user: "Emily Rodriguez",
        handle: "@emilyrescue",
        text: "Massive earthquake just hit San Francisco. Buildings shaking. Everyone stay calm and seek shelter! 🏢",
        time: "7:15 AM - Aug 8 2024",
        category: "Earthquake",
        stats: { likes: "6,221", retweets: "2,110", comments: "4,543" }
    },
    {
        id: 4,
        user: "David Kim",
        handle: "@davidwatch",
        text: "Tornado warning in Oklahoma. Taking shelter now. Community, stay alert and follow emergency instructions! 🌪️",
        time: "3:33 PM - Jun 12 2024",
        category: "Tornado",
        stats: { likes: "3,876", retweets: "765", comments: "1,998" }
    },
    {
        id: 5,
        user: "Lisa Wong",
        handle: "@lisahelp",
        text: "Tsunami warning for coastal Hawaii. Evacuation centers opening. Stay informed and follow local authorities. 🚨",
        time: "9:50 AM - Oct 3 2024",
        category: "Tsunami",
        stats: { likes: "7,112", retweets: "2,998", comments: "5,344" }
    },
    {
        id: 6,
        user: "Alex Rivera",
        handle: "@alexsafe",
        text: "Hurricane aftermath in Puerto Rico. Community coming together to help each other. Stay strong! 🤝",
        time: "1:15 PM - Sep 18 2024",
        category: "Hurricane",
        stats: { likes: "4,221", retweets: "1,112", comments: "2,331" }
    }
];

// Color palette for different disaster categories - need to update the colors for better visuals
const disasterColors = {
    Hurricane: {
        background: "#FFE5B4",  // Light Peach
        text: "#000000",
        border: "#FF6B35"
    },
    Flood: {
        background: "#E0F8FF",  // Light Blue
        text: "#000000",
        border: "#0077BE"
    },
    Earthquake: {
        background: "#F0F0F0",  // Light Gray
        text: "#000000",
        border: "#808080"
    },
    Tornado: {
        background: "#F0E6FF",  // Lavender
        text: "#000000",
        border: "#6A5ACD"
    },
    Tsunami: {
        background: "#E6F3E6",  // Pale Green
        text: "#000000",
        border: "#2E8B57"
    },
    Wildfire: {
        background: "#FFFFFF",  // Pale Green
        text: "#000000",
        border: "#2E8B57"
    }
};

export default function Home() {
    const [activeTab, setActiveTab] = useState("All");

    // Filter tweets based on active tab
    const filteredTweets = activeTab === "All"
        ? tweets
        : tweets.filter(tweet => tweet.category === activeTab);

    return (
        <div style={{
            backgroundColor: "#312f74",
            minHeight: "100vh",
            padding: "16px",
            color: "white"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
            }}>
                <div style={{
                    display: "flex",
                    gap: "24px"
                }}>
                    {["All", "Hurricane", "Flood", "Earthquake", "Tornado", "Tsunami", "Wildfire"].map((tab) => (
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

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <select style={{
                        padding: "8px",
                        borderRadius: "4px"
                    }}>
                        <option>United States</option>
                        <option>Gulf Coast</option>
                        <option>Pacific Coast</option>
                        <option>Midwest</option>
                        <option>East Coast</option>
                    </select>
                </div>
            </div>

            <div style={{
                height: "calc(100vh - 80px)",
                overflowY: "auto",
                paddingRight: "8px",
                scrollbarWidth: "thin",
                scrollbarColor: "#ffffff50 transparent"
            }}>
                {filteredTweets.map((tweet) => {
                    const colorScheme = disasterColors[tweet.category] || disasterColors.Hurricane;

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
                            <p style={{ fontWeight: "bold" }}>
                                {tweet.user} <span style={{ color: colorScheme.text, opacity: 0.7 }}>{tweet.handle}</span>
                            </p>
                            <p style={{ margin: "8px 0" }}>{tweet.text}</p>
                            <p style={{ color: colorScheme.text, opacity: 0.7, fontSize: "14px" }}>{tweet.time}</p>
                            <div style={{
                                display: "flex",
                                gap: "8px",
                                marginTop: "8px",
                                color: colorScheme.text,
                                opacity: 0.7,
                                fontSize: "14px"
                            }}>
                                <span>💬 {tweet.stats.comments}</span>
                                <span>🔁 {tweet.stats.retweets}</span>
                                <span>❤️ {tweet.stats.likes}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}