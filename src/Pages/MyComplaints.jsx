import React, { useState } from "react";

const complaintsData = [
  {
    id: 1,
    complaint: "Street lights not working properly in my area.",
    status: "Pending",
    upvotes: 12,
    date: "2025-06-25",
  },
  {
    id: 2,
    complaint: "Garbage collection is irregular and causing bad smell.",
    status: "In Progress",
    upvotes: 35,
    date: "2025-06-20",
  },
  {
    id: 3,
    complaint: "Water supply is inconsistent for last 2 weeks.",
    status: "Resolved",
    upvotes: 28,
    date: "2025-06-15",
  },
];

const MyComplaints = () => {
  const [filter, setFilter] = useState("All");

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-700 border border-amber-200/50 shadow-amber-100/50";
      case "in progress":
        return "bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-700 border border-blue-200/50 shadow-blue-100/50";
      case "resolved":
        return "bg-gradient-to-r from-emerald-400/20 to-green-400/20 text-emerald-700 border border-emerald-200/50 shadow-emerald-100/50";
      default:
        return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 text-gray-700 border border-gray-200/50 shadow-gray-100/50";
    }
  };

  // Apply filter
  const filteredComplaints =
    filter === "All"
      ? complaintsData
      : complaintsData.filter((c) => c.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.05)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.04)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Back button */}
        <button
          className="fixed top-6 left-6 z-30 group flex items-center gap-2.5 px-4 py-2.5 text-emerald-700 hover:text-emerald-800 transition-all duration-300 hover:bg-white/70 rounded-xl backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          onClick={() => window.history.back()}
          type="button"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>

        <div className="max-w-5xl mx-auto pt-16">
          {/* Modern heading with glass morphism */}
          <div className="mb-12 text-center relative">
            <div className="inline-block p-8 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-700 bg-clip-text text-transparent mb-3">
                My Complaints
              </h1>
              <p className="text-emerald-600/80 text-xl font-medium">
                Track your submitted complaints and their progress
              </p>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
            </div>
          </div>

          {/* Modern filter dropdown */}
          <div className="flex justify-end mb-8">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 text-emerald-700 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all duration-300 cursor-pointer font-medium"
              >
                <option value="All">All Complaints</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Modern complaints list */}
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-8">
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl flex items-center justify-center shadow-2xl">
                  <svg
                    className="w-14 h-14 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-3">
                No complaints found
              </h3>
              <p className="text-emerald-600/70 text-lg">
                Try selecting a different filter to view your complaints.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredComplaints.map(({ id, complaint, status, upvotes, date }) => (
                <div
                  key={id}
                  className="group relative bg-white/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/30 hover:border-emerald-200/50 hover:-translate-y-1"
                >
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/5 to-green-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                      <div className="flex items-center gap-3 text-emerald-600">
                        <div className="p-2 rounded-xl bg-emerald-100/50">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="font-semibold text-lg">{formatDate(date)}</span>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="text-gray-700 text-xl leading-relaxed mb-6 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                      {complaint}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-emerald-100/50 gap-4">
                      <div className="flex items-center gap-3 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 cursor-pointer group/upvote">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50/50 group-hover/upvote:bg-emerald-100/50 transition-colors duration-300">
                          <svg
                            className="w-6 h-6 group-hover/upvote:scale-110 transition-transform duration-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-bold text-xl">{upvotes}</span>
                          <span className="text-sm font-medium text-emerald-500">
                            upvotes
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="text-sm">Complaint #{id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;