import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Search, Vote, Users, Calendar } from "lucide-react";

export default function ElectionDashboard() {
  const [elections, setElections] = useState([]);
  const [search, setSearch] = useState("");
  const [votersData, setVotersData] = useState([]);

  useEffect(() => {
    fetch("/gtfs/elections.json")
      .then((res) => res.json())
      .then((data) => setElections(data.elections || data))
      .catch((err) => console.error("Error loading elections JSON:", err));
  }, []);

  useEffect(() => {
    fetch("/gtfs/voters.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setVotersData(result.data);
          },
        });
      });
  }, []);

  const filteredElections = Array.isArray(elections)
    ? elections.filter(
        (election) =>
          (election.region &&
            election.region.toLowerCase().includes(search.toLowerCase())) ||
          (election.type &&
            election.type.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-green-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <Vote className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Election Dashboard
            </h1>
          </div>
          <p className="text-center text-green-600/70 dark:text-green-400/70 mt-2 font-medium">
            Comprehensive Electoral Information & Voter Analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-green-200 dark:border-gray-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:border-transparent transition-all duration-300 placeholder-green-500/60 dark:placeholder-green-400/60 text-green-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Upcoming Elections</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">{filteredElections.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Voter Records</p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{votersData.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 px-6 py-5">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Upcoming Elections</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-100 dark:border-gray-600">
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Region</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Election Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredElections.length > 0 ? (
                    filteredElections.map((e, idx) => (
                      <tr key={idx} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-green-50 dark:border-gray-700">
                        <td className="py-4 px-4 text-green-900 dark:text-gray-100 font-medium">{e.type}</td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">{e.region}</td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">{e.date}</td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">{e.event}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-green-500 dark:text-green-400 font-medium">
                        No matching elections found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {votersData.length > 0 && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 px-6 py-5">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">State-wise Voter Data</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-emerald-100 dark:border-gray-600">
                      {Object.keys(votersData[0]).map((header, idx) => (
                        <th key={idx} className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-200 min-w-32">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {votersData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-emerald-50 dark:border-gray-700">
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex} className="py-4 px-4 text-emerald-700 dark:text-gray-300">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}