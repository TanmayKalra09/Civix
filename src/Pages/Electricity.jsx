import React, { useState, useEffect } from 'react';
import { Zap, Droplets, Clock, AlertTriangle, CheckCircle, XCircle, Calendar, MapPin, Bell } from 'lucide-react';

const UtilitiesDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedUtility, setSelectedUtility] = useState('both');
  const [selectedArea, setSelectedArea] = useState('all');

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
      affectedAreas: 0
    },
    water: {
      status: 'maintenance',
      uptime: '96.8%',
      lastOutage: '6 hours ago',
      affectedAreas: 2
    }
  };

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
    return () => clearInterval(timer);
  }, []);

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