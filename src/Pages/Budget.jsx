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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Financial Data</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Comprehensive financial data overview and analysis</p>
        </div>
        
        {rows.length > 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Data Summary</h3>
                  <p className="text-green-100 dark:text-green-200">Total Records: {rows.length}</p>
                </div>
                <div className="bg-white/20 dark:bg-white/25 backdrop-blur-sm rounded-lg p-3">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h2v2H7V7zm4 0h2v2h-2V7zm4 0h2v2h-2V7zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 15h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border-b border-green-200 dark:border-gray-600">
                    {Object.keys(rows[0]).map((header, i) => (
                      <th key={i} className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider border-r border-green-100 dark:border-gray-600 last:border-r-0 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{header}</span>
                          <svg className="w-3 h-3 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100 dark:divide-gray-600">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-green-50/50 dark:hover:bg-gray-600/50 transition-colors duration-200 group">
                      {Object.values(row).map((value, j) => (
                        <td key={j} className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 border-r border-green-50 dark:border-gray-700 last:border-r-0 group-hover:border-green-100 dark:group-hover:border-gray-600 transition-colors duration-200">
                          <div className="truncate max-w-xs" title={value}>
                            {value}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-green-50 dark:bg-gray-700 px-6 py-4 border-t border-green-100 dark:border-gray-600">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Showing all {rows.length} records</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                  <span>Data loaded successfully</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="absolute -inset-4">
                  <div className="w-full h-full border-4 border-green-200 dark:border-green-400/30 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Loading Financial Data</h3>
                <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your data...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}