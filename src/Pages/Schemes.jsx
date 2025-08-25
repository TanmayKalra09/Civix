import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Building2, TrendingUp, FileText, IndianRupee, Search } from "lucide-react";

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

  const StatCard = ({ icon: Icon, title, value, gradient }) => (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-green-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {value.toLocaleString()}
            </p>
          </div>
          <div className={`p-4 ${gradient} rounded-xl shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const DataTable = ({ data, title, icon: Icon, colorScheme }) => (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-green-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className={`${colorScheme} px-8 py-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm">
              <Search className="w-4 h-4 text-white/70" />
              <span className="text-white/90 text-sm font-medium">{data.length} records</span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          {data.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="min-w-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-green-100">
                      {Object.keys(data[0]).map((key, idx) => (
                        <th key={idx} className="text-left py-4 px-6 font-bold text-gray-700 tracking-wide uppercase text-xs bg-gradient-to-r from-green-50 to-emerald-50 first:rounded-l-xl last:rounded-r-xl">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-50">
                    {data.map((row, i) => (
                      <tr key={i} className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-200 group/row">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-5 px-6 text-gray-700 group-hover/row:text-gray-900 transition-colors duration-200 font-medium">
                            <div className="flex items-center space-x-2">
                              {j === 0 && <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"></div>}
                              <span>{val}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl">
                  <Icon className="w-12 h-12 text-green-600 animate-bounce" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-xl font-semibold text-gray-600 mb-2">Loading data...</p>
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JhcGgiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwMCAwIEwgMCAwIDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMzQsIDE5NywgOTQsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFwaCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative bg-white/95 backdrop-blur-xl border-b border-green-200/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Government Data Portal
                </h1>
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2 mx-auto w-32"></div>
              </div>
            </div>
            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Comprehensive analytics and insights for government schemes and financial expenditure
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <StatCard
            icon={FileText}
            title="Active Government Schemes"
            value={schemes.length}
            gradient="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={TrendingUp}
            title="Expenditure Records"
            value={planExpenditure.length}
            gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
        </div>

        <DataTable
          data={schemes}
          title="Government Schemes - Fund Allocation"
          icon={IndianRupee}
          colorScheme="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600"
        />

        <DataTable
          data={planExpenditure}
          title="Plan Expenditure Analytics"
          icon={TrendingUp}
          colorScheme="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600"
        />
      </div>
    </div>
  );
}