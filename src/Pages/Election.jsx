import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { 
  Vote, Users, Calendar, Search, Filter, BarChart3, PieChart, Activity, 
  Download, Eye, BarChart, LineChart, AreaChart, ScatterChart, 
  TrendingUp, Target, Award, AlertTriangle, CheckCircle, XCircle,
  MapPin, Clock, FileText, IndianRupee, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart as RechartsAreaChart, 
  Area, ComposedChart, ScatterChart as RechartsScatterChart, Scatter
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function ElectionsDashboard() {
  const [elections, setElections] = useState([]);
  const [votersData, setVotersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('dashboard');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedElectionType, setSelectedElectionType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Load elections data
      try {
        const response = await fetch("/gtfs/elections.json");
        const data = await response.json();
        setElections(data.elections || data);
      } catch (error) {
        console.error('Error loading elections:', error);
      }

      // Load voters data
      try {
        const response = await fetch("/gtfs/voters.csv");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setVotersData(result.data.filter(row => row['State Name']));
          },
          error: (error) => console.error('Error loading voters:', error)
        });
      } catch (error) {
        console.error('Error loading voters:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (elections.length > 0 && votersData.length > 0) {
      setLoading(false);
    }
  }, [elections, votersData]);

  // Utility functions
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getElectionTypeColor = (type) => {
    const colors = {
      'Vice-Presidential Election': '#10b981',
      'Rajya Sabha Elections': '#3b82f6',
      'State Assembly Election': '#f59e0b',
      'Municipal Election': '#8b5cf6',
      'Panchayat Election': '#ec4899'
    };
    return colors[type] || '#6b7280';
  };

  const getConstituencyColor = (type) => {
    const colors = {
      'GEN': '#10b981',
      'SC': '#3b82f6',
      'ST': '#f59e0b'
    };
    return colors[type] || '#6b7280';
  };

  // Data processing with useMemo for performance
  const processedElections = useMemo(() => {
    if (!elections.length) return [];
    
    return elections.map(election => ({
      ...election,
      date: new Date(election.date),
      year: new Date(election.date).getFullYear(),
      month: new Date(election.date).getMonth()
    }));
  }, [elections]);

  const processedVotersData = useMemo(() => {
    if (!votersData.length) return [];
    
    return votersData.map(row => ({
      state: row['State Name'],
      constituencyType: row['Constituency Type'],
      seats: parseInt(row['No Of Seats']) || 0,
      maleElectors: parseInt(row['Electors - Male']) || 0,
      femaleElectors: parseInt(row['Electors - Female']) || 0,
      thirdGenderElectors: parseInt(row['Electors - Third Gender']) || 0,
      totalElectors: parseInt(row['Electors - Total']) || 0,
      maleVoters: parseInt(row['Voters - Male']) || 0,
      femaleVoters: parseInt(row['Voters - Female']) || 0,
      thirdGenderVoters: parseInt(row['Voters - Third Gender']) || 0,
      totalVoters: parseInt(row['Voters - Total']) || 0,
      turnout: parseFloat(row['Voters - Poll %']) || 0,
      rejectedVotes: parseInt(row['Rejected Votes (Postal)']) || 0,
      evmRejected: parseInt(row['Evm Rejected Votes']) || 0,
      notaVotes: parseInt(row['NOTA Votes']) || 0,
      validVotes: parseInt(row['Valid Votes Polled']) || 0
    }));
  }, [votersData]);

  // Filtered data based on user selections
  const filteredElections = useMemo(() => {
    let filtered = processedElections;

    if (selectedElectionType !== 'all') {
      filtered = filtered.filter(election => election.type === selectedElectionType);
    }

    if (searchQuery) {
      filtered = filtered.filter(election => 
        election.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(election => 
        election.date >= dateRange.start && election.date <= dateRange.end
      );
    }

    return filtered;
  }, [processedElections, selectedElectionType, searchQuery, dateRange]);

  const filteredVotersData = useMemo(() => {
    let filtered = processedVotersData;

    if (selectedState !== 'all') {
      filtered = filtered.filter(row => row.state === selectedState);
    }

    return filtered;
  }, [processedVotersData, selectedState]);

  // KPI calculations
  const kpiMetrics = useMemo(() => {
    if (!processedVotersData.length || !processedElections.length) {
      return {
        totalVoters: 0,
        avgTurnout: 0,
        upcomingElections: 0,
        statesCovered: 0,
        totalSeats: 0,
        genderGap: 0
      };
    }

    const totalVoters = processedVotersData.reduce((sum, row) => sum + row.totalElectors, 0);
    const avgTurnout = processedVotersData.reduce((sum, row) => sum + row.turnout, 0) / processedVotersData.length;
    
    const today = new Date();
    const upcomingElections = processedElections.filter(election => election.date > today).length;
    
    const statesCovered = new Set(processedVotersData.map(row => row.state)).size;
    const totalSeats = processedVotersData.reduce((sum, row) => sum + row.seats, 0);
    
    const maleVoters = processedVotersData.reduce((sum, row) => sum + row.maleVoters, 0);
    const femaleVoters = processedVotersData.reduce((sum, row) => sum + row.femaleVoters, 0);
    const genderGap = ((maleVoters - femaleVoters) / (maleVoters + femaleVoters)) * 100;

    return {
      totalVoters,
      avgTurnout,
      upcomingElections,
      statesCovered,
      totalSeats,
      genderGap
    };
  }, [processedVotersData, processedElections]);

  // Chart data preparation
  const voterTurnoutData = useMemo(() => {
    if (!filteredVotersData.length) return [];
    
    return filteredVotersData
      .filter(row => row.constituencyType === 'Total')
      .sort((a, b) => b.turnout - a.turnout)
      .slice(0, 15)
      .map(row => ({
        state: row.state,
        turnout: row.turnout,
        totalVoters: row.totalVoters,
        seats: row.seats
      }));
  }, [filteredVotersData]);

  const electionTimelineData = useMemo(() => {
    if (!filteredElections.length) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeline = {};
    
    filteredElections.forEach(election => {
      const month = months[election.month];
      timeline[month] = (timeline[month] || 0) + 1;
    });
    
    return months.map(month => ({
      month,
      count: timeline[month] || 0
    }));
  }, [filteredElections]);

  const constituencyDistributionData = useMemo(() => {
    if (!filteredVotersData.length) return [];
    
    const distribution = {};
    filteredVotersData.forEach(row => {
      const type = row.constituencyType;
      if (type !== 'Total') {
        distribution[type] = (distribution[type] || 0) + row.seats;
      }
    });
    
    return Object.entries(distribution).map(([type, seats]) => ({
      type,
      seats,
      color: getConstituencyColor(type)
    }));
  }, [filteredVotersData]);

  const genderParticipationData = useMemo(() => {
    if (!filteredVotersData.length) return [];
    
    return filteredVotersData
      .filter(row => row.constituencyType === 'Total')
      .slice(0, 10)
      .map(row => ({
        state: row.state,
        male: row.maleVoters,
        female: row.femaleVoters,
        thirdGender: row.thirdGenderVoters,
        total: row.totalVoters
      }));
  }, [filteredVotersData]);

  const electionTypeData = useMemo(() => {
    if (!filteredElections.length) return [];
    
    const typeCount = {};
    filteredElections.forEach(election => {
      typeCount[election.type] = (typeCount[election.type] || 0) + 1;
    });
    
    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      color: getElectionTypeColor(type)
    }));
  }, [filteredElections]);

  // Enhanced KPI Card Component
  const KPICard = ({ title, value, trend, icon, color = 'green', subtitle, unit = '' }) => (
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
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
            <span>{trend >= 0 ? '+' : ''}{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === 'number' ? formatNumber(value) : value}{unit}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 dark:text-green-400 text-lg">Loading Electoral Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-green-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3">
            <Vote className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Elections Dashboard
            </h1>
          </div>
          <p className="text-center text-green-600/70 dark:text-green-400/70 mt-2 font-medium">
            Advanced Electoral Analytics & Interactive Visualizations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* View Mode Selector */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard View</h2>
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { key: 'dashboard', label: 'Dashboard', icon: Activity },
                  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { key: 'insights', label: 'Insights', icon: PieChart },
                  { key: 'comparison', label: 'Comparison', icon: BarChart }
                ].map((mode) => {
                  const IconComponent = mode.icon;
                  return (
                    <button
                      key={mode.key}
                      onClick={() => setViewMode(mode.key)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === mode.key
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 inline mr-2" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const csvContent = Papa.unparse(filteredVotersData);
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'electoral-data.csv';
                  a.click();
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <KPICard
            title="Total Voters"
            value={kpiMetrics.totalVoters}
            icon={<Users className="w-6 h-6 text-white" />}
            color="green"
            subtitle="Registered voters"
          />
          <KPICard
            title="Avg Turnout"
            value={kpiMetrics.avgTurnout.toFixed(1)}
            unit="%"
            icon={<Target className="w-6 h-6 text-white" />}
            color="emerald"
            subtitle="Voter participation"
          />
          <KPICard
            title="Upcoming Elections"
            value={kpiMetrics.upcomingElections}
            icon={<Calendar className="w-6 h-6 text-white" />}
            color="blue"
            subtitle="Scheduled events"
          />
          <KPICard
            title="States Covered"
            value={kpiMetrics.statesCovered}
            icon={<MapPin className="w-6 h-6 text-white" />}
            color="purple"
            subtitle="Geographic coverage"
          />
          <KPICard
            title="Total Seats"
            value={kpiMetrics.totalSeats}
            icon={<Award className="w-6 h-6 text-white" />}
            color="orange"
            subtitle="Constituency seats"
          />
          <KPICard
            title="Gender Gap"
            value={Math.abs(kpiMetrics.genderGap).toFixed(1)}
            unit="%"
            icon={<Users className="w-6 h-6 text-white" />}
            color="red"
            subtitle={kpiMetrics.genderGap >= 0 ? "Male advantage" : "Female advantage"}
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">Search Elections</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search elections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">Election Type</label>
              <select
                value={selectedElectionType}
                onChange={(e) => setSelectedElectionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All Types</option>
                <option value="Vice-Presidential Election">Vice-Presidential</option>
                <option value="Rajya Sabha Elections">Rajya Sabha</option>
                <option value="State Assembly Election">State Assembly</option>
                <option value="Municipal Election">Municipal</option>
                <option value="Panchayat Election">Panchayat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="all">All States</option>
                {Array.from(new Set(processedVotersData.map(row => row.state))).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-700 dark:text-green-300 mb-2">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start || ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                />
                <input
                  type="date"
                  value={dateRange.end || ''}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                />
              </div>
            </div>
          </div>
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
              {/* Voter Turnout Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 15 States by Voter Turnout</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={voterTurnoutData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="state" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => [name === 'turnout' ? `${value}%` : formatNumber(value), name === 'turnout' ? 'Turnout' : 'Voters']}
                      />
                      <Legend />
                      <Bar dataKey="turnout" fill="#10b981" name="Turnout %" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Election Timeline */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Election Distribution by Month</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={electionTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [value, 'Elections']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        name="Election Count"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Additional Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Constituency Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Constituency Type Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={constituencyDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, seats }) => `${type}: ${seats}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="seats"
                      >
                        {constituencyDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [value, 'Seats']}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Gender Participation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gender-wise Voter Participation (Top 10 States)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={genderParticipationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="state" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [formatNumber(value), 'Voters']}
                      />
                      <Legend />
                      <Bar dataKey="male" stackId="a" fill="#3b82f6" name="Male" />
                      <Bar dataKey="female" stackId="a" fill="#ec4899" name="Female" />
                      <Bar dataKey="thirdGender" stackId="a" fill="#f59e0b" name="Third Gender" />
                    </RechartsBarChart>
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
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Advanced Analytics Dashboard</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Election Type Distribution */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Election Type Distribution</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={electionTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ type, count }) => `${type}: ${count}`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {electionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [value, 'Elections']}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Scatter Plot: Turnout vs Seats */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Voter Turnout vs Constituency Seats</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsScatterChart data={voterTurnoutData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="seats" stroke="#6b7280" />
                        <YAxis dataKey="turnout" stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          formatter={(value, name) => [name === 'turnout' ? `${value}%` : value, name === 'turnout' ? 'Turnout' : 'Seats']}
                        />
                        <Scatter dataKey="turnout" fill="#10b981" />
                      </RechartsScatterChart>
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
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Electoral Data Insights & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">Key Findings</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Highest Turnout:</strong> {voterTurnoutData[0]?.state || 'N/A'} leads with {voterTurnoutData[0]?.turnout?.toFixed(1) || 'N/A'}% participation
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Total Coverage:</strong> {kpiMetrics.statesCovered} states/UTs with comprehensive electoral data
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          <strong>Upcoming Events:</strong> {kpiMetrics.upcomingElections} elections scheduled in next 12 months
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Voter Awareness:</strong> Focus on states with below-average turnout rates
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Gender Equality:</strong> Address gender gap in voter participation
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Digital Infrastructure:</strong> Enhance voting accessibility and transparency
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Regional Performance Comparison</h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* Multi-Metric Comparison Chart */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">State Performance Overview</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={voterTurnoutData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="state" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                          formatter={(value, name) => [name === 'turnout' ? `${value}%` : formatNumber(value), name === 'turnout' ? 'Turnout %' : 'Total Voters']}
                        />
                        <Legend />
                        <Bar dataKey="totalVoters" fill="#3b82f6" name="Total Voters" />
                        <Line type="monotone" dataKey="turnout" stroke="#10b981" strokeWidth={3} name="Turnout %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Data Tables */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Upcoming Elections</h2>
              </div>
              <div className="text-white text-sm">
                Showing {filteredElections.length} of {processedElections.length} elections
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-100 dark:border-gray-600">
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Region</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Election Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Event</th>
                    <th className="text-left py-4 px-4 font-semibold text-green-800 dark:text-green-200">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredElections.length > 0 ? (
                    filteredElections.map((e, idx) => (
                      <tr key={idx} className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-green-50 dark:border-gray-700">
                        <td className="py-4 px-4 text-green-900 dark:text-gray-100 font-medium">
                          <span 
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: getElectionTypeColor(e.type) + '20',
                              color: getElectionTypeColor(e.type)
                            }}
                          >
                            {e.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">{e.region}</td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">{e.date.toLocaleDateString()}</td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300">{e.event}</td>
                        <td className="py-4 px-4 text-green-700 dark:text-gray-300 text-sm">{e.notes}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-green-500 dark:text-green-400 font-medium">
                        No matching elections found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredVotersData.length > 0 && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-3xl border border-green-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">State-wise Voter Data</h2>
                </div>
                <div className="text-white text-sm">
                  Showing {filteredVotersData.length} of {processedVotersData.length} records
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-emerald-100 dark:border-gray-600">
                      <th className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-200">State</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-200">Constituency Type</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-200">Seats</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-200">Total Electors</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-200">Total Voters</th>
                      <th className="text-left py-4 px-4 font-semibold text-emerald-800 dark:text-emerald-200">Turnout %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVotersData
                      .filter(row => row.constituencyType === 'Total')
                      .map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-b border-emerald-50 dark:border-gray-700">
                          <td className="py-4 px-4 text-emerald-700 dark:text-gray-300 font-medium">{row.state}</td>
                          <td className="py-4 px-4">
                            <span 
                              className="px-2 py-1 text-xs font-medium rounded-full"
                              style={{ 
                                backgroundColor: getConstituencyColor(row.constituencyType) + '20',
                                color: getConstituencyColor(row.constituencyType)
                              }}
                            >
                              {row.constituencyType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-emerald-700 dark:text-gray-300">{row.seats}</td>
                          <td className="py-4 px-4 text-emerald-700 dark:text-gray-300">{formatNumber(row.totalElectors)}</td>
                          <td className="py-4 px-4 text-emerald-700 dark:text-gray-300">{formatNumber(row.totalVoters)}</td>
                          <td className="py-4 px-4 text-emerald-700 dark:text-gray-300 font-semibold">{row.turnout.toFixed(1)}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
    