import React, { useEffect, useState, useMemo, useCallback } from "react";
import Papa from "papaparse";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Budget Dashboard Component
export default function BudgetDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMetrics, setSelectedMetrics] = useState(['be', 're', 'actual']);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'charts', 'insights'

  // Load and parse CSV data
  useEffect(() => {
    fetch("/gtfs/RS_Session_267_AU_3420_A_0.csv")
      .then((response) => response.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        setRows(parsed.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading budget data:', error);
        setLoading(false);
      });
  }, []);

  // Process and transform data for visualizations
  const processedData = useMemo(() => {
    if (!rows.length) return [];
    
    return rows.map(row => ({
      financialYear: row['Financial Year'],
      budgetEstimates: parseFloat(row['Budget Estimates (BE)']) || 0,
      revisedEstimates: parseFloat(row['Revised Estimates (RE)']) || 0,
      actualCollection: parseFloat(row['Actual Collection']) || 0,
      beAchievement: parseFloat(row['% of BE Achieved']) || 0,
      reAchievement: parseFloat(row['% of RE Achieved']) || 0,
      variance: parseFloat(row['Actual Collection']) - parseFloat(row['Budget Estimates (BE)']) || 0,
      variancePercentage: ((parseFloat(row['Actual Collection']) - parseFloat(row['Budget Estimates (BE)'])) / parseFloat(row['Budget Estimates (BE)']) * 100) || 0
    }));
  }, [rows]);

  // Calculate KPI metrics
  const kpiMetrics = useMemo(() => {
    if (!processedData.length) return {};
    
    const currentYear = processedData[processedData.length - 1];
    const totalRevenue = processedData.reduce((sum, item) => sum + item.actualCollection, 0);
    const avgAchievement = processedData.reduce((sum, item) => sum + item.beAchievement, 0) / processedData.length;
    const growthRate = processedData.length > 1 ? 
      ((currentYear.actualCollection - processedData[processedData.length - 2].actualCollection) / processedData[processedData.length - 2].actualCollection * 100) : 0;
    
    return {
      totalRevenue,
      currentAchievement: currentYear.beAchievement,
      avgAchievement,
      growthRate,
      budgetVariance: currentYear.variancePercentage
    };
  }, [processedData]);

  // Filter data based on selected year
  const filteredData = useMemo(() => {
    if (selectedYear === 'all') return processedData;
    return processedData.filter(item => item.financialYear === selectedYear);
  }, [processedData, selectedYear]);

  // Chart colors
  const chartColors = {
    primary: '#10b981',
    secondary: '#3b82f6',
    accent: '#f59e0b',
    success: '#22c55e',
    warning: '#f97316',
    danger: '#ef4444'
  };

  // KPI Card Component
  const KPICard = ({ title, value, trend, icon, color = 'primary' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded-full ${
          trend >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </motion.div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 flex flex-col items-center space-y-6">
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
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Loading Financial Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we prepare your analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Financial Analytics Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Advanced financial data visualization and insights</p>
            </div>
          </div>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl p-1 border border-gray-200 dark:border-gray-600 shadow-lg">
            {['dashboard', 'charts', 'insights'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Financial Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all duration-300"
                >
                  <option value="all">All Years</option>
                  {processedData.map(item => (
                    <option key={item.financialYear} value={item.financialYear}>
                      {item.financialYear}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metrics</label>
                <div className="flex gap-2">
                  {[
                    { key: 'be', label: 'Budget Estimates' },
                    { key: 're', label: 'Revised Estimates' },
                    { key: 'actual', label: 'Actual Collection' }
                  ].map(metric => (
                    <button
                      key={metric.key}
                      onClick={() => {
                        if (selectedMetrics.includes(metric.key)) {
                          setSelectedMetrics(selectedMetrics.filter(m => m !== metric.key));
                        } else {
                          setSelectedMetrics([...selectedMetrics, metric.key]);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                        selectedMetrics.includes(metric.key)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {metric.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Total Revenue"
                  value={`₹${(kpiMetrics.totalRevenue / 100000).toFixed(1)}L`}
                  trend={kpiMetrics.growthRate}
                  icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>}
                  color="primary"
                />
                
                <KPICard
                  title="Current Achievement"
                  value={`${kpiMetrics.currentAchievement.toFixed(1)}%`}
                  trend={kpiMetrics.currentAchievement - 100}
                  icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>}
                  color="success"
                />
                
                <KPICard
                  title="Budget Variance"
                  value={`${kpiMetrics.budgetVariance.toFixed(1)}%`}
                  trend={kpiMetrics.budgetVariance}
                  icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>}
                  color={kpiMetrics.budgetVariance >= 0 ? 'success' : 'danger'}
                />
                
                <KPICard
                  title="Avg Achievement"
                  value={`${kpiMetrics.avgAchievement.toFixed(1)}%`}
                  trend={kpiMetrics.avgAchievement - 100}
                  icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>}
                  color="accent"
                />
              </div>

              {/* Main Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="financialYear" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="budgetEstimates" 
                        stroke={chartColors.primary} 
                        strokeWidth={3}
                        name="Budget Estimates"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actualCollection" 
                        stroke={chartColors.secondary} 
                        strokeWidth={3}
                        name="Actual Collection"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Budget Achievement Chart */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Achievement</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="financialYear" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="beAchievement" fill={chartColors.success} name="BE Achievement %" />
                      <Bar dataKey="reAchievement" fill={chartColors.accent} name="RE Achievement %" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Additional Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Variance Analysis */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Variance</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="financialYear" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="variancePercentage" 
                        fill={(entry) => entry.variancePercentage >= 0 ? chartColors.success : chartColors.danger}
                        name="Variance %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Achievement Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievement Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={processedData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="beAchievement"
                        nameKey="financialYear"
                        label={({ financialYear, beAchievement }) => `${financialYear}: ${beAchievement.toFixed(1)}%`}
                      >
                        {processedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={[chartColors.primary, chartColors.secondary, chartColors.accent, chartColors.success, chartColors.warning][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Performance Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Best Year</span>
                      <span className="text-sm font-semibold text-green-600">
                        {processedData.reduce((best, current) => 
                          current.beAchievement > best.beAchievement ? current : best
                        ).financialYear}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Worst Year</span>
                      <span className="text-sm font-semibold text-red-600">
                        {processedData.reduce((worst, current) => 
                          current.beAchievement < worst.beAchievement ? current : worst
                        ).financialYear}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg Growth</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {kpiMetrics.growthRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Charts View */}
        {viewMode === 'charts' && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Advanced Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Composed Chart - All Metrics */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comprehensive Financial Overview</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="financialYear" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="budgetEstimates" 
                        fill={chartColors.primary + '20'} 
                        stroke={chartColors.primary}
                        name="Budget Estimates"
                      />
                      <Bar dataKey="actualCollection" fill={chartColors.secondary} name="Actual Collection" />
                      <Line 
                        type="monotone" 
                        dataKey="beAchievement" 
                        stroke={chartColors.accent} 
                        strokeWidth={3}
                        name="BE Achievement %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Achievement Comparison */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievement Comparison</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="financialYear" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="beAchievement" fill={chartColors.primary} name="BE Achievement" />
                      <Bar dataKey="reAchievement" fill={chartColors.secondary} name="RE Achievement" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Insights View */}
        {viewMode === 'insights' && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Financial Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Financial Insights & Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Positive Trends */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600 text-lg">Positive Trends 📈</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Revenue Growth:</strong> +{kpiMetrics.growthRate.toFixed(1)}% over the period</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Budget Accuracy:</strong> {kpiMetrics.avgAchievement.toFixed(1)}% average achievement</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Consistent Performance:</strong> Most years exceed budget estimates</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Areas of Concern */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-orange-600 text-lg">Areas of Concern ⚠️</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>2020-21 Performance:</strong> {processedData.find(d => d.financialYear === '2020-21')?.beAchievement.toFixed(1)}% achievement rate</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Budget Variance:</strong> {kpiMetrics.budgetVariance.toFixed(1)}% average variance</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span><strong>Estimate Accuracy:</strong> Need for better budget planning</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Strategic Recommendations 💡</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Budget Planning</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Improve budget estimation accuracy based on historical performance patterns</p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Performance Monitoring</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">Implement quarterly reviews to track progress against budget estimates</p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Risk Management</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Develop contingency plans for years with lower achievement rates</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Data Table (Collapsible) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Raw Data Table</h3>
                  <p className="text-green-100 dark:text-green-200">Detailed financial records for analysis</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border-b border-green-200 dark:border-gray-600">
                    {Object.keys(rows[0] || {}).map((header, i) => (
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}