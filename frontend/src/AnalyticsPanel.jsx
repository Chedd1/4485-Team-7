import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Import the disaster keyword mapping and colors
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
    "Wildfire": ["wildfire", "fire"]
};

const disasterColors = {
    Avalanche: { background: "#FAF9F6", text: "#000", border: "#476684" },
    Blizzard: { background: "#6EB0EF", text: "#000", border: "#87CEEB" },
    Drought: { background: "#AD9270", text: "#000", border: "#855C50" },
    Duststorm: { background: "#FDD674", text: "#000", border: "#C1972D" },
    Earthquake: { background: "#D6B5A6", text: "#000", border: "#AB846F" },
    "Volcanic Eruption": { background: "#ED5555", text: "#000", border: "#FCB930" },
    Flood: { background: "#1BDDD6", text: "#000", border: "#000088" },
    Hailstorm: { background: "#D0D1E1", text: "#000", border: "#B4B3AE" },
    Hurricane: { background: "#A4948E", text: "#000", border: "#907C75" },
    Landslide: { background: "#A05C53", text: "#000", border: "#8B4513" },
    Tornado: { background: "#899A9F", text: "#000", border: "#7D7D7D" },
    Wildfire: { background: "#FA5D0A", text: "#000", border: "#FF4500" }
};

const AnalyticsPanel = ({ disasterData }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Disaster Reports by Type (Last 24 Hours)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Reports'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time (Hours)'
                }
            }
        }
    };

    // Update chart data when disasterData prop changes
    useEffect(() => {
        if (disasterData) {
            const processedData = processDisasterData(disasterData);
            setChartData(processedData);
        }
    }, [disasterData]);

    const processDisasterData = (data) => {
        // Get current time and time 24 hours ago
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

        // Create time slots for the last 24 hours (hourly intervals)
        const timeSlots = [];
        for (let i = 0; i < 24; i++) {
            const time = new Date(twentyFourHoursAgo.getTime() + (i * 60 * 60 * 1000));
            timeSlots.push(time);
        }

        // Initialize datasets for each disaster type
        const datasets = Object.keys(disasterKeywordMap).map(disasterType => {
            return {
                label: disasterType,
                data: new Array(24).fill(0),
                borderColor: disasterColors[disasterType].border,
                backgroundColor: disasterColors[disasterType].background,
                tension: 0.1,
                fill: false
            };
        });

        // Process each tweet
        data.forEach(tweet => {
            const tweetTime = new Date(tweet.createdAt);
            if (tweetTime >= twentyFourHoursAgo && tweetTime <= now) {
                const timeSlotIndex = Math.floor((tweetTime - twentyFourHoursAgo) / (60 * 60 * 1000));
                if (timeSlotIndex >= 0 && timeSlotIndex < 24) {
                    const disasterType = getDisasterType(tweet.text);
                    const datasetIndex = datasets.findIndex(ds => ds.label === disasterType);
                    if (datasetIndex !== -1) {
                        datasets[datasetIndex].data[timeSlotIndex]++;
                    }
                }
            }
        });

        // Format time labels
        const labels = timeSlots.map(time => {
            return time.toLocaleString([], { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                hour12: true 
            });
        });

        return {
            labels,
            datasets: datasets.filter(dataset => dataset.data.some(count => count > 0))
        };
    };

    const getDisasterType = (text) => {
        if (!text) return "Disaster";
        
        const lowerText = text.toLowerCase();
        
        for (const [disasterType, keywords] of Object.entries(disasterKeywordMap)) {
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    return disasterType;
                }
            }
        }
        
        return "Disaster";
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            margin: '20px 0'
        }}>
            <div style={{ height: '300px' }}>
                <Line options={options} data={chartData} />
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>Disaster Report Analytics</h3>
                <p>This trendline shows the number of disaster reports by type over the last 24 hours.</p>
            </div>
        </div>
    );
};

export default AnalyticsPanel; 