import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const TrainSchedule = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch("/gtfs/Train_details_22122017.csv");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().toLowerCase(),
          complete: (result) => {
            setData(result.data);
            setLoading(false);
            console.log("CSV data loaded:", result.data.length, "rows");
          },
          error: (err) => {
            console.error("CSV parse error:", err);
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchCSV();
  }, []);

  const filteredData = data.filter(
    (train) =>
      train["train name"]?.toLowerCase().includes(search.toLowerCase()) ||
      train["station name"]?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 dark:border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-emerald-700 dark:text-emerald-300 font-medium">Loading train data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-emerald-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Train Schedule</h1>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Civix</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-emerald-400 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search train or station..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-gray-600 rounded-2xl shadow-lg focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-200 placeholder-emerald-400 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-800 text-white">
                  {[
                    "Train No",
                    "Train Name",
                    "SEQ",
                    "Station Code",
                    "Station Name",
                    "Arrival Time",
                    "Departure Time",
                    "Distance",
                    "Source Station",
                    "Source Station Name",
                    "Destination Station",
                    "Destination Station Name",
                  ].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-sm font-semibold tracking-wider whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100 dark:divide-gray-700">
                {filteredData.map((row, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-emerald-700 dark:text-emerald-300 font-semibold">
                      {row["train no"]}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {row["train name"]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {row["seq"]}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">
                      {row["station code"]}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {row["station name"]}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-blue-600 dark:text-blue-400">
                      {row["arrival time"]}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-orange-600 dark:text-orange-400">
                      {row["departure time"]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {row["distance"]} km
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">
                      {row["source station"]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {row["source station name"]}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">
                      {row["destination station"]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {row["destination station name"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No trains found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainSchedule;