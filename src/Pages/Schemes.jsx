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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <Building2 className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Government Data Portal
            </h1>
          </div>
          <p className="text-center text-green-600/70 mt-2 font-medium">
            Comprehensive Government Schemes & Financial Analytics
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Government Schemes</p>
                <p className="text-2xl font-bold text-green-800">{schemes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600">Plan Expenditure Records</p>
                <p className="text-2xl font-bold text-emerald-800">{planExpenditure.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5">
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
                    <tr className="border-b-2 border-green-100">
                      {Object.keys(schemes[0]).map((key, idx) => (
                        <th key={idx} className="text-left py-4 px-4 font-semibold text-green-800 min-w-32">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schemes.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-green-50/50 transition-colors duration-200 border-b border-green-50"
                      >
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-4 px-4 text-green-700">
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
                  <FileText className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <p className="text-green-500 font-medium">Loading schemes data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
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
                    <tr className="border-b-2 border-emerald-100">
                      {Object.keys(planExpenditure[0]).map((key, idx) => (
                        <th key={idx} className="text-left py-4 px-4 font-semibold text-emerald-800 min-w-32">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {planExpenditure.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-emerald-50/50 transition-colors duration-200 border-b border-emerald-50"
                      >
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-4 px-4 text-emerald-700">
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
                  <TrendingUp className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                  <p className="text-emerald-500 font-medium">Loading expenditure data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}