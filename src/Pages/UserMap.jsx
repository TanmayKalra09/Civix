import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Globe, MapPin, ArrowLeft } from "lucide-react"; // Icons for modes
import { useNavigate } from "react-router-dom";
import './UserMap.css';

// Custom marker icon (green pin)
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Fly to selected location
function FlyToLocation({ position }) {
  const map = useMap();
  if (position) map.flyTo(position, 14, { duration: 1.5 });
  return null;
}

export default function UserMap() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [mapView, setMapView] = useState("street");

  const userIssues = [
    { title: "Pothole near Main Street", description: "Big pothole near bus stop. Needs urgent repair.", status: "Pending", category: "Roads", date: "2025-08-01", lat: 13.0827, lng: 80.2707 },
    { title: "Streetlight not working", description: "Dark street needs repair of light. Safety issue.", status: "Resolved", category: "Lighting", date: "2025-07-20", lat: 19.076, lng: 72.8777 },
    { title: "Overflowing garbage bin", description: "Garbage collection delayed for 3 days.", status: "Under Review", category: "Waste", date: "2025-08-15", lat: 28.7041, lng: 77.1025 },
    { title: "Broken water pipe", description: "Water flooding street due to burst pipe.", status: "In Progress", category: "Water", date: "2025-08-10", lat: 12.9716, lng: 77.5946 },
    { title: "Damaged pedestrian crossing", description: "Zebra crossing faded near school.", status: "Pending", category: "Roads", date: "2025-08-05", lat: 22.5726, lng: 88.3639 },
    { title: "Illegal dumping of waste", description: "Garbage dumped in open land, foul smell.", status: "Pending", category: "Waste", date: "2025-08-17", lat: 17.385, lng: 78.4867 },
    { title: "Traffic signal malfunction", description: "Signal stuck on red causing jams.", status: "In Progress", category: "Roads", date: "2025-08-12", lat: 23.0225, lng: 72.5714 },
    { title: "Public park lights off", description: "No lighting in park, unsafe at evening.", status: "Resolved", category: "Lighting", date: "2025-07-30", lat: 26.9124, lng: 75.7873 },
    { title: "Open manhole", description: "Uncovered manhole near marketplace.", status: "Pending", category: "Safety", date: "2025-08-18", lat: 11.0168, lng: 76.9558 },
    { title: "Sewage overflow", description: "Sewage water overflowing after rain.", status: "Under Review", category: "Water", date: "2025-08-16", lat: 15.2993, lng: 74.124 },
  ];

  const filteredIssues = userIssues.filter(
    (issue) =>
      (statusFilter === "All" || issue.status === statusFilter) &&
      (categoryFilter === "All" || issue.category === categoryFilter)
  );

  const statusClasses = {
    Pending: "text-yellow-800 border-yellow-400 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-700",
    "In Progress": "text-blue-800 border-blue-400 bg-blue-100 dark:text-blue-200 dark:bg-blue-700",
    Resolved: "text-green-800 border-green-400 bg-green-100 dark:text-green-200 dark:bg-green-700",
    "Under Review": "text-purple-800 border-purple-400 bg-purple-100 dark:text-purple-200 dark:bg-purple-700",
  };

  const categoryClasses = {
    Roads: "text-orange-800 border-orange-400 bg-orange-100 dark:text-orange-200 dark:bg-orange-700",
    Waste: "text-red-800 border-red-400 bg-red-100 dark:text-red-200 dark:bg-red-700",
    Lighting: "text-blue-800 border-blue-400 bg-blue-100 dark:text-blue-200 dark:bg-blue-700",
    Water: "text-teal-800 border-teal-400 bg-teal-100 dark:text-teal-200 dark:bg-teal-700",
    Safety: "text-purple-800 border-purple-400 bg-purple-100 dark:text-purple-200 dark:bg-purple-700",
  };

  return (
    <div className="p-6 space-y-6 font-inter">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user/dashboard")}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md shadow-md hover:bg-white/90 dark:hover:bg-black/20 transition text-green-700 dark:text-green-400 border border-green-500"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-400">📍Civic Issues Map</h1>
        <p className="text-green-600 dark:text-green-300 text-lg max-w-2xl mx-auto">
          Explore all the issues reported. Click on a pin to see details, filter by status or category, and switch map views.
        </p>
      </div>

      {/* Controls: Filters left, Map view toggle right */}
      <div className="flex justify-between items-center flex-wrap mb-4 gap-4">
        {/* Filters */}
        <div className="flex gap-4 flex-wrap backdrop-blur-md bg-white/40 dark:bg-gray-800/40 p-2 rounded-2xl shadow-md">
          <select
            className="border border-green-500 rounded-lg px-4 py-2 text-black dark:text-white focus:ring-2 focus:ring-green-500 transition bg-white/70 dark:bg-gray-700/70"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Under Review">Under Review</option>
          </select>

          <select
            className="border border-green-500 rounded-lg px-4 text-black py-2 focus:ring-2 focus:ring-green-500 transition bg-white/70 dark:bg-gray-700/70 dark:text-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Roads">Roads</option>
            <option value="Waste">Waste</option>
            <option value="Lighting">Lighting</option>
            <option value="Water">Water</option>
            <option value="Safety">Safety</option>
          </select>
        </div>

        {/* Map View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMapView("street")}
            className={`p-3 rounded-full shadow-md transition ${
              mapView === "street" ? "bg-green-600 text-white" : "bg-white/70 dark:bg-gray-800/70 text-green-600 border border-green-500"
            }`}
            title="Street View"
          >
            <MapPin size={22} />
          </button>

          <button
            onClick={() => setMapView("satellite")}
            className={`p-3 rounded-full shadow-md transition ${
              mapView === "satellite" ? "bg-green-600 text-white" : "bg-white/70 dark:bg-gray-800/70 text-green-600 border border-green-500"
            }`}
            title="Satellite View"
          >
            <Globe size={22} />
          </button>
        </div>
      </div>

      <div className="w-full h-[600px] rounded-3xl shadow-xl overflow-hidden border border-green-500">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url={
              mapView === "satellite"
                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={
              mapView === "satellite"
                ? '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                : '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            }
          />

          {filteredIssues.map((issue, idx) => (
            <Marker
              key={idx}
              position={[issue.lat, issue.lng]}
              icon={customIcon}
              eventHandlers={{ click: () => setSelectedIssue(issue) }}
            >
              <Popup className="custom-popup">
                <div className="p-5 rounded-3xl shadow-lg border border-green-300 bg-white/80 dark:border-green-600 dark:bg-gray-900/80 w-72 backdrop-blur-md">
                  <h3 className="font-bold text-green-700 dark:text-green-300 text-xl mb-3">{issue.title}</h3>
                  <p className="text-base text-gray-700 dark:text-gray-200 mb-4">{issue.description}</p>

                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-medium border ${statusClasses[issue.status]}`}>
                      <MapPin size={14} /> {issue.status}
                    </span>
                    <span className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-medium border ${categoryClasses[issue.category]}`}>
                      <Globe size={14} /> {issue.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-300 text-right">Date: {issue.date}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedIssue && <FlyToLocation position={[selectedIssue.lat, selectedIssue.lng]} />}
        </MapContainer>
      </div>
    </div>
  );
}
