import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Building2, TrendingUp, FileText, IndianRupee } from "lucide-react";

export default function GovernmentDataTables() {
  const [schemes, setSchemes] = useState([]);
  const [planExpenditure, setPlanExpenditure] = useState([]);

  useEffect(() => {
    Papa.parse("/gtfs/schemes.csv", {
      download: true,
      header: true,
      complete: (result) => {
        setSchemes(result.data);
      },
    });

    Papa.parse("/gtfs/planExpenditure.csv", {
      download: true,
      header: true,
      complete: (result) => {
        setPlanExpenditure(result.data);
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-800">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Government Data Portal
            </h1>
          </div>
          <p className="text-center text-green-600/70 dark:text-green-400/70 mt-2 font-medium">
            Comprehensive Government Schemes & Financial Analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Government Schemes</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-300">{schemes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 dark:border-gray-700 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Plan Expenditure Records</p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{planExpenditure.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 px-6 py-5">
            <div className="flex items-center space-x-3">
              <IndianRupee className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Government Schemes - Funds Allocated</h2>
            </div>
          </div>
          <div className="p-6">
            {schemes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-green-100 dark:border-gray-600">
                      {Object.keys(schemes[0]).map((key, idx) => (
                        <th key={idx} className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-300 min-w-32">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-green-50 dark:border-gray-700"
                      >
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-4 px-4 text-green-700 dark:text-green-200">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-green-300 dark:text-green-500 mx-auto mb-3" />
                  <p className="text-green-500 dark:text-green-400 font-medium">Loading schemes data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 px-6 py-5">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Plan Expenditure</h2>
            </div>
          </div>
          <div className="p-6">
            {planExpenditure.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-emerald-100 dark:border-gray-600">
                      {Object.keys(planExpenditure[0]).map((key, idx) => (
                        <th key={idx} className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-300 min-w-32">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {planExpenditure.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-emerald-50 dark:border-gray-700"
                      >
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-4 px-4 text-emerald-700 dark:text-emerald-200">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-emerald-300 dark:text-emerald-500 mx-auto mb-3" />
                  <p className="text-emerald-500 dark:text-emerald-400 font-medium">Loading expenditure data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}