import { useState } from "react";

//this can be somehow connected to the backend to loop tweets?
const tweets = [
  {
    id: 1,
    user: "Quintin Reyes",
    handle: "@qreyes",
    text: "What the figma!",
    time: "1:33PM - Oct 22 2025",
    stats: { likes: "5,579", retweets: "1,240", comments: "3,887" },
  },
  {
    id: 2,
    user: "Simon Fairhurst",
    handle: "@simonfairhurst",
    text: "Figma, Webflow, or Framer. Which one will take the lead in 2023 and be the go-to for digital design?",
    time: "1:27PM - Oct 4 2022",
    stats: { likes: "5,579", retweets: "1,240", comments: "3,887" },
  },
  // Adding more dummy tweets to demonstrate scrolling
  {
    id: 3,
    user: "JT",
    handle: "@JT",
    text: "Working on some stuff",
    time: "2:45PM - Oct 15 2022",
    stats: { likes: "3,221", retweets: "890", comments: "1,233" },
  },
  {
    id: 4,
    user: "Natural News",
    handle: "@nnews",
    text: "Breaking News: Earthquake",
    time: "11:05AM - Oct 19 2022",
    stats: { likes: "7,112", retweets: "2,998", comments: "5,344" },
  },
  {
    id: 5,
    user: "Web Developer",
    handle: "@webdev",
    text: "Anyone else finding the new CSS Grid specs amazing for responsive layouts?",
    time: "9:22AM - Oct 21 2022",
    stats: { likes: "2,887", retweets: "856", comments: "1,002" },
  },
  {
    id: 6,
    user: "Avani",
    handle: "@avaniii",
    text: "Crazy News out there!",
    time: "3:48PM - Oct 18 2022",
    stats: { likes: "4,221", retweets: "1,112", comments: "2,331" },
  },
];

export default function Home() {
  const [trendingTweets, setTrendingTweets] = useState(tweets);
  const [recentTweets, setRecentTweets] = useState([...tweets].reverse());
  const [activeTab, setActiveTab] = useState("trending");


  return (
    <div style={{ backgroundColor: "#312f74", minHeight: "100vh", padding: "16px", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <select style={{ padding: "8px", borderRadius: "4px" }}>
            <option>Filter</option>
            <option>Tornado</option>
            <option>Tsunami</option>
            <option>Flood</option>
            <option>Earthquake</option>
            <option>Hurricane</option>
          </select>
          <select style={{ padding: "8px", borderRadius: "4px" }}>
            <option>United States</option>
            <option>Mexico</option>
            <option>Canada</option>
          </select>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", height: "calc(100vh - 80px)" }}>
        {/* Trending Section with Scroll */}
        <div style={{ 
          overflowY: "auto", 
          maxHeight: "100%",
          paddingRight: "8px",
          /* Custom scrollbar styles */
          scrollbarWidth: "thin",
          scrollbarColor: "#ffffff50 transparent"
        }}>
          <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Trending Now</h2>
          {trendingTweets.map((tweet) => (
            <div 
              key={tweet.id} 
              style={{ 
                padding: "16px", 
                marginBottom: "16px", 
                backgroundColor: "white", 
                color: "black", 
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <p style={{ fontWeight: "bold" }}>{tweet.user} <span style={{ color: "gray" }}>{tweet.handle}</span></p>
              <p style={{ margin: "8px 0" }}>{tweet.text}</p>
              <p style={{ color: "gray", fontSize: "14px" }}>{tweet.time}</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", color: "gray", fontSize: "14px" }}>
                <span>💬 {tweet.stats.comments}</span>
                <span>🔁 {tweet.stats.retweets}</span>
                <span>❤️ {tweet.stats.likes}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Recents Section with Scroll */}
        <div style={{ 
          overflowY: "auto", 
          maxHeight: "100%",
          paddingRight: "8px",
          /* Custom scrollbar styles */
          scrollbarWidth: "thin",
          scrollbarColor: "#ffffff50 transparent"
        }}>
          <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Recent Updates</h2>
          {recentTweets.map((tweet) => (
            <div 
              key={tweet.id} 
              style={{ 
                padding: "16px", 
                marginBottom: "16px", 
                backgroundColor: "white", 
                color: "black", 
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              <p style={{ fontWeight: "bold" }}>{tweet.user} <span style={{ color: "gray" }}>{tweet.handle}</span></p>
              <p style={{ margin: "8px 0" }}>{tweet.text}</p>
              <p style={{ color: "gray", fontSize: "14px" }}>{tweet.time}</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", color: "gray", fontSize: "14px" }}>
                <span>💬 {tweet.stats.comments}</span>
                <span>🔁 {tweet.stats.retweets}</span>
                <span>❤️ {tweet.stats.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}