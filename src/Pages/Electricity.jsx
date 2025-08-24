import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Zap, Droplets, Clock, AlertTriangle, CheckCircle, XCircle, Calendar, MapPin, Bell, TrendingUp, TrendingDown, Activity, BarChart3, PieChart, Map } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, ScatterChart, Scatter
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const UtilitiesDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUtility, setSelectedUtility] = useState('both');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedMetrics, setSelectedMetrics] = useState(['uptime', 'outages']);
  const [viewMode, setViewMode] = useState('dashboard');
  const [liveUpdates, setLiveUpdates] = useState(true);

  const areas = [
    { id: 'sector-1', name: 'Sector 1', zone: 'North' },
    { id: 'sector-2', name: 'Sector 2', zone: 'South' },
    { id: 'sector-3', name: 'Sector 3', zone: 'East' },
    { id: 'sector-4', name: 'Sector 4', zone: 'West' },
    { id: 'dlf-1', name: 'DLF Phase 1', zone: 'Central' },
    { id: 'dlf-2', name: 'DLF Phase 2', zone: 'Central' }
  ];

  const currentStatus = {
    electricity: {
      status: 'active',
      uptime: '99.2%',
      lastOutage: '2 days ago',
      affectedAreas: 0,
      consumption: 245.6,
      trend: +2.1
    },
    water: {
      status: 'maintenance',
      uptime: '96.8%',
      lastOutage: '6 hours ago',
      affectedAreas: 2,
      consumption: 89.3,
      trend: -0.5
    }
  };

  // Enhanced mock data for visualizations
  const consumptionData = useMemo(() => {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        electricity: Math.random() * 100 + 200,
        water: Math.random() * 30 + 70,
        timestamp: time.getTime()
      });
    }
    return data;
  }, [currentTime]);

  const outageAnalytics = useMemo(() => {
    return areas.map(area => ({
      area: area.name,
      electricityOutages: Math.floor(Math.random() * 5),
      waterOutages: Math.floor(Math.random() * 3),
      totalOutages: Math.floor(Math.random() * 8),
      avgDuration: Math.floor(Math.random() * 120) + 30,
      uptime: 95 + Math.random() * 5
    }));
  }, []);

  const outageReasons = useMemo(() => {
    return [
      { reason: 'Equipment Failure', count: 12, percentage: 35 },
      { reason: 'Scheduled Maintenance', count: 8, percentage: 24 },
      { reason: 'Weather Related', count: 6, percentage: 18 },
      { reason: 'Grid Issues', count: 4, percentage: 12 },
      { reason: 'Human Error', count: 3, percentage: 9 },
      { reason: 'Other', count: 1, percentage: 2 }
    ];
  }, []);

  const scheduledOutages = [
    {
      id: 1,
      type: 'electricity',
      area: 'Sector 1',
      startTime: new Date(2025, 7, 23, 2, 0),
      endTime: new Date(2025, 7, 23, 6, 0),
      reason: 'Routine maintenance of transformer',
      status: 'scheduled',
      priority: 'medium'
    },
    {
      id: 2,
      type: 'water',
      area: 'DLF Phase 2',
      startTime: new Date(2025, 7, 22, 23, 0),
      endTime: new Date(2025, 7, 23, 3, 0),
      reason: 'Pipeline repair work',
      status: 'ongoing',
      priority: 'high'
    },
    {
      id: 3,
      type: 'electricity',
      area: 'Sector 3',
      startTime: new Date(2025, 7, 24, 10, 0),
      endTime: new Date(2025, 7, 24, 14, 0),
      reason: 'Grid upgrade work',
      status: 'scheduled',
      priority: 'low'
    },
    {
      id: 4,
      type: 'water',
      area: 'Sector 4',
      startTime: new Date(2025, 7, 25, 1, 0),
      endTime: new Date(2025, 7, 25, 5, 0),
      reason: 'Water tank cleaning',
      status: 'scheduled',
      priority: 'medium'
    }
  ];

  const recentOutages = [
    {
      id: 1,
      type: 'electricity',
      area: 'Sector 2',
      startTime: new Date(2025, 7, 20, 14, 30),
      endTime: new Date(2025, 7, 20, 16, 15),
      reason: 'Equipment failure',
      duration: '1h 45m'
    },
    {
      id: 2,
      type: 'water',
      area: 'DLF Phase 1',
      startTime: new Date(2025, 7, 19, 8, 0),
      endTime: new Date(2025, 7, 19, 12, 0),
      reason: 'Scheduled maintenance',
      duration: '4h 0m'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Simulate real-time data updates
    if (liveUpdates) {
      const dataTimer = setInterval(() => {
        // Simulate live consumption data updates
        setCurrentTime(new Date());
      }, 5000); // Update every 5 seconds
      
      return () => {
        clearInterval(timer);
        clearInterval(dataTimer);
      };
    }
    
    return () => clearInterval(timer);
  }, [liveUpdates]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'outage': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4" />;
      case 'outage': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500 dark:bg-red-600';
      case 'medium': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'low': return 'bg-green-500 dark:bg-green-600';
      default: return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOngoing = (outage) => {
    return currentTime >= outage.startTime && currentTime <= outage.endTime;
  };

  const filteredOutages = scheduledOutages.filter(outage => {
    if (selectedUtility !== 'both' && outage.type !== selectedUtility) return false;
    if (selectedArea !== 'all' && !outage.area.toLowerCase().includes(selectedArea)) return false;
    return true;
  });

  // Enhanced KPI Card Component
  const KPICard = ({ title, value, trend, icon, color = 'primary', subtitle, unit = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r from-${color}-400 to-${color}-600 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}{unit}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-green-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <h1 className="text-2xl font-bold text-green-900 dark:text-green-100">Civix Utilities</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-green-700 dark:text-green-300">
              <Clock className="w-4 h-4" />
              <span>{formatTime(currentTime)} • {formatDate(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Selector */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard View</h2>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {['dashboard', 'analytics', 'insights'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === mode
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {mode === 'dashboard' && <Activity className="w-4 h-4 inline mr-2" />}
                      {mode === 'analytics' && <BarChart3 className="w-4 h-4 inline mr-2" />}
                      {mode === 'insights' && <PieChart className="w-4 h-4 inline mr-2" />}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="liveUpdates"
                    checked={liveUpdates}
                    onChange={(e) => setLiveUpdates(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="liveUpdates" className="text-sm text-gray-700 dark:text-gray-300">
                    Live Updates
                  </label>
                </div>
                
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Electricity Uptime"
            value={parseFloat(currentStatus.electricity.uptime)}
            trend={currentStatus.electricity.trend}
            icon={<Zap className="w-6 h-6 text-white" />}
            color="green"
            unit="%"
            subtitle="30-day average"
          />
          <KPICard
            title="Water Uptime"
            value={parseFloat(currentStatus.water.uptime)}
            trend={currentStatus.water.trend}
            icon={<Droplets className="w-6 h-6 text-white" />}
            color="blue"
            unit="%"
            subtitle="30-day average"
          />
          <KPICard
            title="Active Outages"
            value={filteredOutages.filter(o => isOngoing(o)).length}
            trend={-15.2}
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
            color="orange"
            subtitle="Currently affecting users"
          />
          <KPICard
            title="Avg Response Time"
            value={45}
            trend={+8.7}
            icon={<Clock className="w-6 h-6 text-white" />}
            color="purple"
            unit=" min"
            subtitle="Time to resolve issues"
          />
        </div>

        {/* Conditional Chart Rendering Based on View Mode */}
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Chart Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Real-time Consumption Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Consumption (24h)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={consumptionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" />
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
                        dataKey="electricity" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        name="Electricity (kW)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="water" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        name="Water (L/min)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Outage Analytics Chart */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Outage Frequency by Area</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={outageAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="area" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="electricityOutages" fill="#10b981" name="Electricity" />
                      <Bar dataKey="waterOutages" fill="#3b82f6" name="Water" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Additional Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Outage Reasons Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Outage Reasons Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={outageReasons}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {outageReasons.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Uptime Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uptime Trends by Area</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={outageAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="area" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
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
                        dataKey="uptime" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                        name="Uptime %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          )}

          {viewMode === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Advanced Analytics Dashboard</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Scatter Plot: Outage Duration vs Frequency */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Outage Duration vs Frequency</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <ScatterChart data={outageAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="totalOutages" stroke="#6b7280" />
                        <YAxis dataKey="avgDuration" stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Scatter dataKey="avgDuration" fill="#10b981" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Composed Chart: Multiple Metrics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Performance Overview</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <ComposedChart data={outageAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="area" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="totalOutages" fill="#3b82f6" name="Total Outages" />
                        <Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={3} name="Uptime %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Predictive Insights & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">Maintenance Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Sector 2:</strong> Schedule transformer maintenance within 2 weeks
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>DLF Phase 1:</strong> Water pipeline inspection recommended
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">Performance Forecast</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Next Month:</strong> Expected uptime improvement of 1.2%
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          <strong>Peak Hours:</strong> Consumption expected to increase by 12%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Zap className="w-6 h-6 text-green-700 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">Electricity</h2>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus.electricity.status)}`}>
                {getStatusIcon(currentStatus.electricity.status)}
                <span className="capitalize">{currentStatus.electricity.status}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Uptime (30 days)</span>
                <span className="font-medium text-green-900 dark:text-green-100">{currentStatus.electricity.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Last outage</span>
                <span className="font-medium text-green-900 dark:text-green-100">{currentStatus.electricity.lastOutage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Affected areas</span>
                <span className="font-medium text-green-900 dark:text-green-100">{currentStatus.electricity.affectedAreas}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Droplets className="w-6 h-6 text-green-700 dark:text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">Water Supply</h2>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus.water.status)}`}>
                {getStatusIcon(currentStatus.water.status)}
                <span className="capitalize">{currentStatus.water.status}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Uptime (30 days)</span>
                <span className="font-medium text-green-900 dark:text-green-100">{currentStatus.water.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Last outage</span>
                <span className="font-medium text-green-900 dark:text-green-100">{currentStatus.water.lastOutage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600 dark:text-green-400">Affected areas</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">{currentStatus.water.affectedAreas}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Utility Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Utility Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Positive Trends
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Electricity uptime improved by 2.1% this month</li>
                <li>• Average outage duration reduced by 15.2%</li>
                <li>• Preventive maintenance effectiveness: 94.3%</li>
                <li>• Customer satisfaction: +8.7% improvement</li>
              </ul>
            </div>
            
            {/* Areas of Concern */}
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Areas of Concern
              </h4>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Sector 2: 3 outages this week (above average)</li>
                <li>• Water supply: 2.3% uptime decline</li>
                <li>• Peak hour consumption: +18.7% increase</li>
                <li>• Response time: +8.7% increase</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Filter Outages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">Utility Type</label>
              <select 
                value={selectedUtility} 
                onChange={(e) => setSelectedUtility(e.target.value)}
                className="w-full p-2 border border-green-200 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="both">Both Utilities</option>
                <option value="electricity">Electricity Only</option>
                <option value="water">Water Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">Area</label>
              <select 
                value={selectedArea} 
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-2 border border-green-200 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Areas</option>
                {areas.map(area => (
                  <option key={area.id} value={area.name.toLowerCase()}>{area.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Scheduled Outages</h3>
            <Bell className="w-5 h-5 text-green-400 dark:text-green-500" />
          </div>
          <div className="space-y-4">
            {filteredOutages.map((outage) => (
              <div key={outage.id} className={`border rounded-lg p-4 ${isOngoing(outage) ? 'border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20' : 'border-green-200 dark:border-gray-600 dark:bg-gray-700/50'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      {outage.type === 'electricity' ? 
                        <Zap className="w-5 h-5 text-green-700 dark:text-green-400" /> :
                        <Droplets className="w-5 h-5 text-green-700 dark:text-green-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-green-900 dark:text-green-100 capitalize">{outage.type}</h4>
                        {isOngoing(outage) && (
                          <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30 rounded-full">
                            ONGOING
                          </span>
                        )}
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(outage.priority)}`}></div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-green-600 dark:text-green-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{outage.area}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(outage.startTime)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(outage.startTime)} - {formatTime(outage.endTime)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">{outage.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-6">Recent Outages</h3>
          <div className="space-y-4">
            {recentOutages.map((outage) => (
              <div key={outage.id} className="border border-green-200 dark:border-gray-600 rounded-lg p-4 dark:bg-gray-700/50">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    {outage.type === 'electricity' ? 
                      <Zap className="w-5 h-5 text-green-700 dark:text-green-400" /> :
                      <Droplets className="w-5 h-5 text-green-700 dark:text-green-400" />
                    }
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 dark:text-green-100 capitalize mb-1">{outage.type}</h4>
                    <div className="flex items-center space-x-4 text-sm text-green-600 dark:text-green-400 mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{outage.area}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(outage.startTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(outage.startTime)} - {formatTime(outage.endTime)}</span>
                      </div>
                      <span className="font-medium text-green-900 dark:text-green-100">Duration: {outage.duration}</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">{outage.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesDashboard;