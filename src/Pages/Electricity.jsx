import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Droplets, Clock, AlertTriangle, CheckCircle, XCircle, Calendar, MapPin, Bell, TrendingUp, TrendingDown, Activity, BarChart3, PieChart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const UtilitiesDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUtility, setSelectedUtility] = useState('both');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
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
    electricity: { status: 'active', uptime: '99.2%', lastOutage: '2 days ago', affectedAreas: 0, trend: +2.1 },
    water: { status: 'maintenance', uptime: '96.8%', lastOutage: '6 hours ago', affectedAreas: 2, trend: -0.5 }
  };

  const consumptionData = useMemo(() => {
    const now = new Date();
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        electricity: Math.random() * 100 + 200,
        water: Math.random() * 30 + 70,
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
      uptime: 95 + Math.random() * 5
    }));
  }, []);

  const outageReasons = [
    { reason: 'Equipment Failure', count: 12, percentage: 35 },
    { reason: 'Scheduled Maintenance', count: 8, percentage: 24 },
    { reason: 'Weather Related', count: 6, percentage: 18 },
    { reason: 'Grid Issues', count: 4, percentage: 12 },
    { reason: 'Human Error', count: 3, percentage: 9 },
    { reason: 'Other', count: 1, percentage: 2 }
  ];

  const scheduledOutages = [
    {
      id: 1, type: 'electricity', area: 'Sector 1',
      startTime: new Date(2025, 7, 23, 2, 0), endTime: new Date(2025, 7, 23, 6, 0),
      reason: 'Routine maintenance of transformer', status: 'scheduled', priority: 'medium'
    },
    {
      id: 2, type: 'water', area: 'DLF Phase 2',
      startTime: new Date(2025, 7, 22, 23, 0), endTime: new Date(2025, 7, 23, 3, 0),
      reason: 'Pipeline repair work', status: 'ongoing', priority: 'high'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    if (liveUpdates) {
      const dataTimer = setInterval(() => setCurrentTime(new Date()), 5000);
      return () => { clearInterval(timer); clearInterval(dataTimer); };
    }
    return () => clearInterval(timer);
  }, [liveUpdates]);

  const getStatusColor = (status) => ({
    active: 'text-green-600 bg-green-100',
    maintenance: 'text-yellow-600 bg-yellow-100',
    outage: 'text-red-600 bg-red-100'
  }[status] || 'text-gray-600 bg-gray-100');

  const getStatusIcon = (status) => ({
    active: <CheckCircle className="w-4 h-4" />,
    maintenance: <AlertTriangle className="w-4 h-4" />,
    outage: <XCircle className="w-4 h-4" />
  }[status] || <Clock className="w-4 h-4" />);

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isOngoing = (outage) => currentTime >= outage.startTime && currentTime <= outage.endTime;

  const filteredOutages = scheduledOutages.filter(outage => {
    if (selectedUtility !== 'both' && outage.type !== selectedUtility) return false;
    if (selectedArea !== 'all' && !outage.area.toLowerCase().includes(selectedArea)) return false;
    return true;
  });

  const KPICard = ({ title, value, trend, icon, unit = '' }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}{unit}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Civix Utilities</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(currentTime)} • {formatDate(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900">Dashboard View</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['dashboard', 'analytics', 'insights'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                    {mode === 'dashboard' && <Activity className="w-4 h-4 inline mr-2" />}
                    {mode === 'analytics' && <BarChart3 className="w-4 h-4 inline mr-2" />}
                    {mode === 'insights' && <PieChart className="w-4 h-4 inline mr-2" />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={liveUpdates} onChange={(e) => setLiveUpdates(e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="text-sm text-gray-700">Live Updates</span>
              </label>
              <select value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm">
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="Electricity Uptime" value={parseFloat(currentStatus.electricity.uptime)} trend={currentStatus.electricity.trend} icon={<Zap className="w-6 h-6 text-white" />} unit="%" />
          <KPICard title="Water Uptime" value={parseFloat(currentStatus.water.uptime)} trend={currentStatus.water.trend} icon={<Droplets className="w-6 h-6 text-white" />} unit="%" />
          <KPICard title="Active Outages" value={filteredOutages.filter(o => isOngoing(o)).length} trend={-15.2} icon={<AlertTriangle className="w-6 h-6 text-white" />} />
          <KPICard title="Avg Response Time" value={45} trend={+8.7} icon={<Clock className="w-6 h-6 text-white" />} unit=" min" />
        </div>

        {/* Charts */}
        {viewMode === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Consumption (24h)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="electricity" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} name="Electricity (kW)" />
                  <Line type="monotone" dataKey="water" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} name="Water (L/min)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Outage Frequency by Area</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={outageAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="area" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="electricityOutages" fill="#10b981" name="Electricity" />
                  <Bar dataKey="waterOutages" fill="#3b82f6" name="Water" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Outage Reasons Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie data={outageReasons} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="percentage" label={({ reason, percentage }) => `${reason}: ${percentage}%`}>
                    {outageReasons.map((entry, index) => <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} />)}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uptime Trends by Area</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={outageAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="area" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Uptime %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'insights' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Predictive Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-600 mb-4">Maintenance Recommendations</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800"><strong>Sector 2:</strong> Schedule transformer maintenance within 2 weeks</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800"><strong>DLF Phase 1:</strong> Water pipeline inspection recommended</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-4">Performance Forecast</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800"><strong>Next Month:</strong> Expected uptime improvement of 1.2%</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800"><strong>Peak Hours:</strong> Consumption expected to increase by 12%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-6 h-6 text-green-700" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Electricity</h2>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus.electricity.status)}`}>
                {getStatusIcon(currentStatus.electricity.status)}
                <span className="capitalize">{currentStatus.electricity.status}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime (30 days)</span>
                <span className="font-medium text-gray-900">{currentStatus.electricity.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last outage</span>
                <span className="font-medium text-gray-900">{currentStatus.electricity.lastOutage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Affected areas</span>
                <span className="font-medium text-gray-900">{currentStatus.electricity.affectedAreas}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Droplets className="w-6 h-6 text-green-700" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Water Supply</h2>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus.water.status)}`}>
                {getStatusIcon(currentStatus.water.status)}
                <span className="capitalize">{currentStatus.water.status}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime (30 days)</span>
                <span className="font-medium text-gray-900">{currentStatus.water.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last outage</span>
                <span className="font-medium text-gray-900">{currentStatus.water.lastOutage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Affected areas</span>
                <span className="font-medium text-orange-600">{currentStatus.water.affectedAreas}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Outages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Utility Type</label>
              <select value={selectedUtility} onChange={(e) => setSelectedUtility(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900">
                <option value="both">Both Utilities</option>
                <option value="electricity">Electricity Only</option>
                <option value="water">Water Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 bg-white text-gray-900">
                <option value="all">All Areas</option>
                {areas.map(area => <option key={area.id} value={area.name.toLowerCase()}>{area.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Scheduled Outages */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Scheduled Outages</h3>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {filteredOutages.map((outage) => (
              <div key={outage.id} className={`border rounded-lg p-4 ${isOngoing(outage) ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {outage.type === 'electricity' ? <Zap className="w-5 h-5 text-gray-700" /> : <Droplets className="w-5 h-5 text-gray-700" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 capitalize">{outage.type}</h4>
                      {isOngoing(outage) && <span className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">ONGOING</span>}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
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
                    <p className="text-sm text-gray-700">{outage.reason}</p>
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