import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Search, MapPin, Navigation } from "lucide-react";

export default function PublicTransportInfo() {
  const [stops, setStops] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchStops() {
      try {
        const res = await fetch("/gtfs/stops.txt");
        const text = await res.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            console.log("Parsed Stops:", result.data);
            setStops(result.data);
          },
        });
      } catch (error) {
        console.error("Error loading stops:", error);
      }
    }
    fetchStops();
  }, []);

  const filteredStops = stops.filter(
    (stop) =>
      stop.stop_name?.toLowerCase().includes(search.toLowerCase()) ||
      stop.stop_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Navigation className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Delhi Transit</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Find bus stops across Delhi with ease</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by stop name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="mt-3 flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{filteredStops.length} stops found</span>
            </div>
          </div>

          <div className="p-6">
            {filteredStops.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {filteredStops.slice(0, 20).map((stop, idx) => (
                  <div 
                    key={idx} 
                    className="group bg-gradient-to-r from-white to-green-50/30 dark:from-gray-700 dark:to-gray-700/80 border border-green-100 dark:border-gray-600 rounded-2xl p-5 hover:shadow-lg hover:border-green-200 dark:hover:border-gray-500 transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                          {stop.stop_name}
                        </h3>
                      </div>
                      <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                        {stop.stop_code}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                          <span className="font-medium">Stop ID:</span>
                          <span className="font-mono bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">{stop.stop_id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                          <span className="font-medium">Zone:</span>
                          <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">{stop.zone_id}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-green-500 dark:text-green-400" />
                        <span className="font-medium">Location:</span>
                        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                          {parseFloat(stop.stop_lat).toFixed(4)}, {parseFloat(stop.stop_lon).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No stops found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by Delhi Transport Corporation • Real-time transit information</p>
        </div>
      </div>
    </div>
  );
}