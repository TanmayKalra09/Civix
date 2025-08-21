import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Search, Users, Droplets } from "lucide-react";

export default function CsvDashboard() {
  const [populationData, setPopulationData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Papa.parse("gtfs/population.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setPopulationData(result.data);
      },
    });

    Papa.parse("gtfs/water.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setWaterData(result.data);
      },
    });
  }, []);

  const filteredPopulation = populationData.filter((row) =>
    row["India/State/Union Territory"]
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredWater = waterData.filter((row) =>
    row["District"]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-green-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent text-center">
            Civic Statistics Dashboard
          </h1>
          <p className="text-center text-green-600/70 dark:text-green-400/70 mt-2 font-medium">
            Comprehensive Population & Water Resources Analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by State/UT or District..."
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
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total States/UTs</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">{filteredPopulation.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                <Droplets className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Districts (South India)</p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{filteredWater.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Population Table */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 px-6 py-5">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Population Data (2011)</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-100 dark:border-gray-600">
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">State/UT</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Population</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Growth Rate</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Density</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPopulation.length > 0 ? (
                    filteredPopulation.map((row, idx) => (
                      <tr key={idx} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-green-50 dark:border-gray-700">
                        <td className="py-4 px-4 text-green-900 dark:text-gray-100 font-medium">
                          {row["India/State/Union Territory"]}
                        </td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">{row["Population 2011"]}</td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">
                          {row["Decadal Population Growth Rate 2001-2011"]}
                        </td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">
                          {row["Population Density (per sq.km) - 2011"]}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-green-500 dark:text-green-400 font-medium">
                        No matching results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 px-6 py-5">
            <div className="flex items-center space-x-3">
              <Droplets className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Water Resources Data</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-emerald-100 dark:border-gray-600">
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-32">District</th>
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-24">Canals No.</th>
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-32">Canals Length (Km.)</th>
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-24">Tube Wells</th>
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-24">Open Wells</th>
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-32">Domestic Wells</th>
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-24">Reservoirs</th>
                    <th className="text-left py-4 px-3 font-semibold text-emerald-800 dark:text-emerald-200 min-w-20">Tanks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWater.length > 0 ? (
                    filteredWater.map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-emerald-50 dark:border-gray-700">
                        <td className="py-4 px-3 text-emerald-900 dark:text-gray-100 font-medium">{row["District"]}</td>
                        <td className="py-4 px-3 text-emerald-700 dark:text-gray-300">{row["Canals no."]}</td>
                        <td className="py-4 px-3 text-emerald-700 dark:text-gray-300">{row["Canals Length (Km.)"]}</td>
                        <td className="py-4 px-3 text-emerald-700 dark:text-gray-300">
                          {row["Tube Wells & Other Wells"]}
                        </td>
                        <td className="py-4 px-3 text-emerald-700 dark:text-gray-300">{row["Open Wells"]}</td>
                        <td className="py-4 px-3 text-emerald-700 dark:text-gray-300">
                          {row["Wells used for Domestic Purpose only"]}
                        </td>
                        <td className="py-4 px-3 text-emerald-700 dark:text-gray-300">{row["Reservoirs"]}</td>
                        <td className="py-4 px-3 text-emerald-700 dark:text-gray-300">{row["Tanks"]}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-emerald-500 dark:text-emerald-400 font-medium">
                        No matching results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}