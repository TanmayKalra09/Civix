import React, { useState, useEffect } from "react";

export default function NearbyServices() {
  const [coords, setCoords] = useState(null);
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("idle");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          console.error(err);
          setStatus("error");
        }
      );
    }
  }, []);

  async function fetchNearby() {
    if (!coords) return;
    setStatus("loading");

    const overpassUrls = [
      "https://overpass-api.de/api/interpreter",
      "https://lz4.overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.openstreetmap.ru/api/interpreter",
      "https://overpass.nchc.org.tw/api/interpreter",
    ];

    let queryAmenities = "";
    if (filter === "all") {
      queryAmenities = `
        node["amenity"~"hospital|police|fire_station"](around:10000,${coords.lat},${coords.lon});
        way["amenity"~"hospital|police|fire_station"](around:10000,${coords.lat},${coords.lon});
        relation["amenity"~"hospital|police|fire_station"](around:10000,${coords.lat},${coords.lon});
      `;
    } else {
      queryAmenities = `
        node["amenity"="${filter}"](around:10000,${coords.lat},${coords.lon});
        way["amenity"="${filter}"](around:10000,${coords.lat},${coords.lon});
        relation["amenity"="${filter}"](around:10000,${coords.lat},${coords.lon});
      `;
    }

    const query = `
      [out:json];
      (
        ${queryAmenities}
      );
      out center tags;
    `;

    let found = false;
    for (let url of overpassUrls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          body: new URLSearchParams({ data: query }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        if (data.elements?.length > 0) {
          setPlaces(data.elements);
          setStatus("success");
          found = true;
          break;
        }
      } catch (e) {
        console.error(`Error with Overpass mirror ${url}:`, e);
      }
    }
    if (!found) {
      setPlaces([]);
      setStatus("success"); // no results but not error
    }
  }

  function openDirections(lat, lon) {
    if (!coords) return;
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${coords.lat},${coords.lon};${lat},${lon}`;
    window.open(url, "_blank");
  }

  const getServiceIcon = (amenity) => {
    switch (amenity) {
      case "hospital":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case "police":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5l7-2 7 2v6a7 7 0 11-14 0V5z" />
          </svg>
        );
      case "fire_station":
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2s4 4 4 8a4 4 0 11-8 0c0-4 4-8 4-8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v8" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
    }
  };

  const getServiceColor = (amenity) => {
    switch (amenity) {
      case "hospital":
        return "bg-red-50 border-red-200";
      case "police":
        return "bg-blue-50 border-blue-200";
      case "fire_station":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                Emergency Services Locator
              </h1>
              <p className="text-gray-600 dark:text-slate-300 mt-1">
                Find essential services within 10-kilometer radius of your location
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Service Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-colors"
              >
                <option value="all">All Emergency Services</option>
                <option value="hospital">Medical Facilities</option>
                <option value="police">Law Enforcement</option>
                <option value="fire_station">Fire & Rescue Services</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchNearby}
                disabled={status === "loading" || !coords}
                className="w-full px-6 py-3 bg-emerald-600 dark:bg-emerald-500 text-white font-medium rounded-md shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {status === "loading" ? "Locating Services..." : "Search Services"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {places.length > 0 && (
          <div className="space-y-4">
            {places.map((p) => (
              <div
                key={p.id}
                className={`rounded-lg border ${getServiceColor(p.tags?.amenity)} p-6`}
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    {getServiceIcon(p.tags?.amenity)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {p.tags?.name || "Unnamed Service"}
                    </h3>
                    {p.tags?.["addr:street"] && (
                      <p className="text-sm text-gray-600">{p.tags["addr:street"]}</p>
                    )}
                    {p.tags?.phone && (
                      <p className="text-sm text-gray-600 font-mono">{p.tags.phone}</p>
                    )}
                    <button
                      onClick={() =>
                        openDirections(p.lat || p.center?.lat, p.lon || p.center?.lon)
                      }
                      className="mt-3 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {status === "success" && places.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">No services found nearby.</p>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-800 dark:text-red-300">
            Failed to retrieve data. Please check connection and try again.
          </div>
        )}
      </div>
    </div>
  );
}
