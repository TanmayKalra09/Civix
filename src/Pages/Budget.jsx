import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function CsvPage() {
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    fetch("/gtfs/RS_Session_267_AU_3420_A_0.csv")
      .then((response) => response.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        setRows(parsed.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JhcGgiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwMCAwIEwgMCAwIDAgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMzQsIDE5NywgOTQsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFwaCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Financial Data Analytics
          </h1>
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto w-48 mb-6"></div>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Comprehensive financial data overview and real-time analysis dashboard
          </p>
        </div>
        
        {rows.length > 0 ? (
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-green-100/50 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
              
              <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 px-8 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r opacity-10">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                </div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 15h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">Data Overview</h2>
                      <p className="text-white/90 font-medium text-lg">Financial Records Analysis</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl px-6 py-3 backdrop-blur-sm">
                    <div className="text-white text-center">
                      <div className="text-3xl font-bold">{rows.length.toLocaleString()}</div>
                      <div className="text-white/80 text-sm font-medium">Total Records</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-green-100">
                        {Object.keys(rows[0]).map((header, i) => (
                          <th key={i} className="text-left py-4 px-6 font-bold text-gray-700 tracking-wide uppercase text-xs bg-gradient-to-r from-green-50 to-emerald-50 first:rounded-l-xl last:rounded-r-xl border-r border-green-100 last:border-r-0 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span>{header.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-green-50">
                      {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-200 group/row">
                          {Object.values(row).map((value, j) => (
                            <td key={j} className="py-5 px-6 text-gray-700 group-hover/row:text-gray-900 transition-colors duration-200 font-medium border-r border-green-50 last:border-r-0 group-hover/row:border-green-100">
                              <div className="flex items-center space-x-2">
                                {j === 0 && <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"></div>}
                                <div className="truncate max-w-xs" title={value}>
                                  {value}
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl px-6 py-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-700 font-semibold">
                        Showing all {rows.length.toLocaleString()} records
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Data loaded successfully</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur opacity-20 transition duration-500"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-green-100/50 shadow-2xl overflow-hidden">
              <div className="p-16 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-3xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                    Loading Financial Data
                  </h3>
                  <p className="text-xl text-gray-600 font-medium mb-6">Please wait while we fetch your data...</p>
                  <div className="flex space-x-1 justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}