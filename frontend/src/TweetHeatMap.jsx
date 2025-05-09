import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

const TweetHeatMap = ({ tweetLocations }) => {
    const hasLocations = tweetLocations && tweetLocations.length > 0;

    return (
        <div
            style={{
                display: "flex",
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
                        <HeatmapLayer
                            points={tweetLocations}
                            longitudeExtractor={(p) => p.lng}
                            latitudeExtractor={(p) => p.lat}
                            intensityExtractor={() => 1}
                            radius={20}
                            blur={15}
                            max={1.0}
                        />
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

export default TweetHeatMap;


