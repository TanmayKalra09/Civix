import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Search, Users, Droplets, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ FIXED import

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

  // ✅ Export as CSV
  const exportCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // ✅ Export as PDF (fixed)
  const exportPDF = (data, headers, filename, title) => {
    const doc = new jsPDF();
    doc.text(title, 14, 10);

    autoTable(doc, {
      head: [headers],
      body: data.map((row) => headers.map((h) => row[h] || "")),
      startY: 20,
    });

    doc.save(filename);
  };

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
        {/* Search */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">
                  Total States/UTs
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {filteredPopulation.length}
                </p>

              </div>
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                <Droplets className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>

                <p className="text-sm font-medium text-emerald-600">
                  Total Districts (South India)
                </p>
                <p className="text-2xl font-bold text-emerald-800">
                  {filteredWater.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Population Table */}
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 overflow-hidden">
          <div className="flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                Population Data (2011)
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  exportCSV(filteredPopulation, "population_data.csv")
                }
                className="flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button
                onClick={() =>
                  exportPDF(
                    filteredPopulation,
                    [
                      "India/State/Union Territory",
                      "Population 2011",
                      "Decadal Population Growth Rate 2001-2011",
                      "Population Density (per sq.km) - 2011",
                    ],
                    "population_data.pdf",
                    "Population Data (2011)"
                  )
                }
                className="flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-green-100">
                  <th className="text-left py-4 px-4 font-semibold text-green-800">
                    State/UT
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-green-800">
                    Population
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-green-800">
                    Growth Rate
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-green-800">
                    Density
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPopulation.length > 0 ? (
                  filteredPopulation.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-green-50/50 transition-colors duration-200 border-b border-green-50"
                    >
                      <td className="py-4 px-4 text-green-900 font-medium">
                        {row["India/State/Union Territory"]}
                      </td>
                      <td className="py-4 px-4 text-green-700">
                        {row["Population 2011"]}
                      </td>
                      <td className="py-4 px-4 text-green-700">
                        {row["Decadal Population Growth Rate 2001-2011"]}
                      </td>
                      <td className="py-4 px-4 text-green-700">
    
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-12 text-green-500 font-medium"
                    >
                      No matching results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Water Resources Table */}
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 overflow-hidden">
          <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
            <div className="flex items-center space-x-3">
              <Droplets className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                Water Resources Data
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportCSV(filteredWater, "water_data.csv")}
                className="flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button
                onClick={() =>
                  exportPDF(
                    filteredWater,
                    [
                      "District",
                      "Canals no.",
                      "Canals Length (Km.)",
                      "Tube Wells & Other Wells",
                      "Open Wells",
                      "Wells used for Domestic Purpose only",
                      "Reservoirs",
                      "Tanks",
                    ],
                    "water_data.pdf",
                    "Water Resources Data"
                  )
                }
                className="flex items-center gap-2 bg-white/20 text-white px-3 py-1 rounded-lg hover:bg-white/30"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-emerald-100">
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-32">
                    District
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-24">
                    Canals No.
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-32">
                    Canals Length (Km.)
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-24">
                    Tube Wells
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-24">
                    Open Wells
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-32">
                    Domestic Wells
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-24">
                    Reservoirs
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-emerald-800 min-w-20">
                    Tanks
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWater.length > 0 ? (
                  filteredWater.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-emerald-50/50 transition-colors duration-200 border-b border-emerald-50"
                    >
                      <td className="py-4 px-3 text-emerald-900 font-medium">
                        {row["District"]}
                      </td>
                      <td className="py-4 px-3 text-emerald-700">
                        {row["Canals no."]}
                      </td>
                      <td className="py-4 px-3 text-emerald-700">
                        {row["Canals Length (Km.)"]}
                      </td>
                      <td className="py-4 px-3 text-emerald-700">
                        {row["Tube Wells & Other Wells"]}
                      </td>
                      <td className="py-4 px-3 text-emerald-700">
                        {row["Open Wells"]}
                      </td>
                      <td className="py-4 px-3 text-emerald-700">
                        {row["Wells used for Domestic Purpose only"]}
                      </td>
                      <td className="py-4 px-3 text-emerald-700">
                        {row["Reservoirs"]}
                      </td>
                      <td className="py-4 px-3 text-emerald-700">
                        {row["Tanks"]}

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-emerald-500 font-medium"
                    >
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
  );
}
