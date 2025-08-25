import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {

  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Filter,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";

const CommunityVotingPage = () => {
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [sortBy, setSortBy] = useState("Most Votes");
  const [isDark, setIsDark] = useState(false);
  const [votedIssues, setVotedIssues] = useState({});
  const [confetti, setConfetti] = useState(null);


  // ---- Voting Data ----
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Pothole on Main Street",
      area: "Noida",
      daysOpen: 3,
      votes: 15,
      accidentsReported: 2,
      status: "Open",
      priority: "high",
    },
    {
      id: 2,
      title: "Broken Street Light",
      area: "East Delhi",
      daysOpen: 5,
      votes: 8,
      accidentsReported: 1,
      status: "Open",
      priority: "medium",
    },
    {
      id: 3,
      title: "Garbage Not Collected",
      area: "South Delhi",
      daysOpen: 7,
      votes: 22,
      accidentsReported: 0,
      status: "Open",
      priority: "low",
    },
    {
      id: 4,
      title: "Water Leakage Issue",
      area: "West Delhi",
      daysOpen: 2,
      votes: 32,
      accidentsReported: 0,
      status: "In Progress",
      priority: "high",
    },
  ]);

  const areas = [
    "All Areas",
    "Noida",
    "East Delhi",
    "West Delhi",
    "North Delhi",
    "South Delhi",
    "Ghaziabad",
  ];
  const sortOptions = [
    "Most Votes",
    "Most Recent",
    "Longest Open",
    "Most Accidents",
  ];

  // ---- Voting Logic ----
  const filteredIssues = issues
    .filter(
      (issue) => selectedArea === "All Areas" || issue.area === selectedArea
    )
    .sort((a, b) => {
      if (sortBy === "Most Votes") return b.votes - a.votes;
      if (sortBy === "Most Recent") return b.daysOpen - a.daysOpen;
      if (sortBy === "Longest Open") return a.daysOpen - b.daysOpen;
      if (sortBy === "Most Accidents")
        return b.accidentsReported - a.accidentsReported;
      return 0;
    });

  const handleVote = (id) => {
    const hasVoted = votedIssues[id];
    setIssues(
      issues.map((issue) =>
        issue.id === id
          ? { ...issue, votes: hasVoted ? issue.votes - 1 : issue.votes + 1 }
          : issue
      )
    );

    setVotedIssues((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (!hasVoted) {
      setConfetti(id);
      setTimeout(() => setConfetti(null), 1200);
    }

  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "In Progress":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "Resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatColors = (color) => {
    const map = {
      purple:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    };
    return map[color] || "bg-gray-100 dark:bg-gray-800 text-gray-600";
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-300">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center relative">
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Community Voting
          </motion.h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Help shape your city by supporting the issues that matter most.
          </p>

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="absolute right-4 top-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {[
              {
                label: "Total Issues",
                value: issues.length,
                icon: AlertTriangle,
                color: "purple",
              },
              {
                label: "Total Votes",
                value: issues.reduce((s, i) => s + i.votes, 0),
                icon: TrendingUp,
                color: "blue",
              },
              {
                label: "Active Areas",
                value: areas.length - 1,
                icon: MapPin,
                color: "pink",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl ${getStatColors(stat.color)}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[{ label: "Area", value: selectedArea, set: setSelectedArea, options: areas },
                { label: "Sort By", value: sortBy, set: setSortBy, options: sortOptions }]
                .map(({ label, value, set, options }) => (
                  <div key={label} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                      >
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Issues */}
          <AnimatePresence>
            {filteredIssues.map((issue, i) => (
              <motion.div
                key={issue.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 mb-6 overflow-hidden relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3, scale: 1.01 }}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {issue.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin size={14} /> {issue.area}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            issue.priority
                          )}`}
                        >
                          {issue.priority} priority
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[{ label: "Days Open", value: issue.daysOpen, icon: Clock },
                      { label: "Accidents", value: issue.accidentsReported, icon: AlertTriangle },
                      { label: "Votes", value: issue.votes, icon: TrendingUp }].map((m, idx) => (
                      <div
                        key={idx}
                        className="text-center p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"
                      >
                        <m.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {m.value}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Support Bar */}
                  <div className="space-y-3 relative">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Community Support
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.min(issue.votes * 5, 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(issue.votes * 5, 100)}%` }}
                        transition={{ duration: 1 }}
                        key={`bar-${issue.id}-${issue.votes}`}
                      />
                    </div>
                    <motion.button
                      onClick={() => handleVote(issue.id)}
                      className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition ${
                        votedIssues[issue.id]
                          ? "bg-gray-500 hover:bg-gray-600 text-white"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {votedIssues[issue.id] ? (
                        <CheckCircle size={16} />
                      ) : (
                        <TrendingUp size={16} />
                      )}
                      {votedIssues[issue.id]
                        ? `Voted (${issue.votes})`
                        : `Vote (${issue.votes})`}
                    </motion.button>

                    {/* 🎉 Confetti burst */}
                    {confetti === issue.id && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[...Array(6)].map((_, idx) => (
                          <motion.div
                            key={idx}
                            className="absolute text-2xl"
                            initial={{ opacity: 1, scale: 0 }}
                            animate={{
                              opacity: 0,
                              scale: 1.5,
                              x: (Math.random() - 0.5) * 120,
                              y: (Math.random() - 0.5) * 120,
                            }}
                            transition={{ duration: 1 }}
                          >
                            🎉
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredIssues.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-gray-400 animate-bounce" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No issues found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Try adjusting your filters to see more issues.
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CommunityVotingPage;

