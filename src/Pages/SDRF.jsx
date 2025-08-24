import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function CsvImportPage() {
  const [nfsaData, setNfsaData] = useState([]);
  const [sdrfData, setSdrfData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      Papa.parse("gtfs/RS_Session_258_AU_1935_2.csv", {
        download: true,
        header: true,
        complete: (result) => {
          setNfsaData(result.data);
          checkLoadingComplete();
        },
      });

      Papa.parse("gtfs/RS_Session_258_AU_1997_1.csv", {
        download: true,
        header: true,
        complete: (result) => {
          setSdrfData(result.data);
          checkLoadingComplete();
        },
      });
    };

    let loadedCount = 0;
    const checkLoadingComplete = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const DataTable = ({ data, title, subtitle, accentColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-green-100 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border-b border-green-100 dark:border-gray-600">
        <h2 className={`text-xl font-semibold ${accentColor} dark:text-green-400 mb-1`}>
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              {Object.keys(data[0]).map((header, i) => (
                <th 
                  key={i} 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
            {data.map((row, i) => (
              <tr 
                key={i} 
                className="hover:bg-green-50 dark:hover:bg-gray-600 transition-colors duration-150 ease-in-out"
              >
                {Object.values(row).map((val, j) => (
                  <td 
                    key={j} 
                    className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap"
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {data.length} records
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 dark:border-gray-600 border-t-green-600 dark:border-t-green-400 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your CSV files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="bg-white dark:bg-gray-800 border-b border-green-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">SDRF Allocation and NFSA Beneficiary</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Government data analysis and visualization platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {nfsaData.length > 0 && (
          <DataTable
            data={nfsaData}
            title="National Food Security Act Data"
            subtitle="Session 258 - August 1935 Records"
            accentColor="text-green-700"
          />
        )}

        {sdrfData.length > 0 && (
          <DataTable
            data={sdrfData}
            title="SDRF Allocation & Release Data"
            subtitle="Session 258 - August 1997 Records"
            accentColor="text-emerald-700"
          />
        )}

        {nfsaData.length === 0 && sdrfData.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Data Available</h3>
            <p className="text-gray-600 dark:text-gray-400">Unable to load CSV files. Please check the file paths and try again.</p>
          </div>
        )}
      </div>

      <footer className="bg-white dark:bg-gray-800 border-t border-green-100 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Powered by <span className="font-medium text-green-600 dark:text-green-400">Civix</span> - Government Data Platform
          </p>
        </div>
      </footer>
    </div>
  );
}