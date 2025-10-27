// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { ArrowLeft, Activity, Clock, MapPin, TrendingUp } from 'lucide-react';
import { getSafepoints, getRecentIncidents, getIncidentStats, subscribeToIncidents } from '../config/supabase';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const branchIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="#2563eb" stroke="white" stroke-width="2"/>
      <text x="16" y="21" font-size="16" font-weight="bold" fill="white" text-anchor="middle">B</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const atmIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="#10b981" stroke="white" stroke-width="2"/>
      <text x="16" y="21" font-size="16" font-weight="bold" fill="white" text-anchor="middle">A</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const merchantIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="#8b5cf6" stroke="white" stroke-width="2"/>
      <text x="16" y="21" font-size="16" font-weight="bold" fill="white" text-anchor="middle">M</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function AdminDashboard({ onBack }) {
  const [safepoints, setSafepoints] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    avgResponseTime: 0,
    activeCount: 0
  });
  const [selectedCity, setSelectedCity] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Subscribe to real-time incident updates
    const subscription = subscribeToIncidents(() => {
      loadDashboardData();
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const [safepointsData, incidentsData, statsData] = await Promise.all([
        getSafepoints(),
        getRecentIncidents(10),
        getIncidentStats()
      ]);
      
      setSafepoints(safepointsData);
      setIncidents(incidentsData);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'branch':
        return branchIcon;
      case 'atm':
        return atmIcon;
      case 'merchant':
        return merchantIcon;
      default:
        return branchIcon;
    }
  };

  const filteredSafepoints = selectedCity === 'all' 
    ? safepoints 
    : safepoints.filter(sp => sp.city === selectedCity);

  // Calculate center of map based on filtered safepoints
  const mapCenter = filteredSafepoints.length > 0
    ? [
        filteredSafepoints.reduce((sum, sp) => sum + sp.latitude, 0) / filteredSafepoints.length,
        filteredSafepoints.reduce((sum, sp) => sum + sp.longitude, 0) / filteredSafepoints.length
      ]
    : [-26.1076, 28.0567]; // Default to Sandton

  const cities = [...new Set(safepoints.map(sp => sp.city))];
  
  // Calculate coverage (people within 1km of a SafePoint)
  const totalSafepoints = filteredSafepoints.length;
  const estimatedCoverage = totalSafepoints * 10000; // Rough estimate: 10k people per SafePoint

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">SafePoint Admin Dashboard</h1>
            <p className="text-sm text-purple-100">Real-time Network Monitoring</p>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Live</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6 mt-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active SafePoints</h3>
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalSafepoints}</p>
            <p className="text-xs text-gray-500 mt-1">Across {cities.length} cities</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Incidents Today</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.todayCount}</p>
            <p className="text-xs text-green-600 mt-1">
              {stats.activeCount} currently active
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgResponseTime}s</p>
            <p className="text-xs text-gray-500 mt-1">Target: &lt;120s</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Coverage</h3>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{(estimatedCoverage / 1000).toFixed(0)}k</p>
            <p className="text-xs text-gray-500 mt-1">People within 1km</p>
          </div>
        </div>

        {/* Map and Incidents Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">SafePoint Network Map</h3>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="h-96">
              <MapContainer
                center={mapCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {filteredSafepoints.map((sp) => (
                  <Marker
                    key={sp.id}
                    position={[sp.latitude, sp.longitude]}
                    icon={getIconForType(sp.type)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{sp.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{sp.type}</p>
                        <p className="text-xs mt-1">{sp.address}</p>
                        <p className="text-xs text-gray-500 mt-1">{sp.hours}</p>
                      </div>
                    </Popup>
                    <Circle
                      center={[sp.latitude, sp.longitude]}
                      radius={1000}
                      pathOptions={{ 
                        fillColor: sp.type === 'branch' ? 'blue' : sp.type === 'atm' ? 'green' : 'purple',
                        fillOpacity: 0.1,
                        color: sp.type === 'branch' ? 'blue' : sp.type === 'atm' ? 'green' : 'purple',
                        weight: 1,
                        opacity: 0.3
                      }}
                    />
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Branch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">ATM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-gray-600">Merchant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Live Incident Feed</h3>
              <p className="text-xs text-gray-500 mt-1">Real-time updates</p>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {incidents.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent incidents</p>
                </div>
              ) : (
                incidents.map((incident) => (
                  <div key={incident.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">
                          {incident.safepoints?.name || 'Unknown Location'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {incident.safepoints?.type} • {incident.safepoints?.city}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          incident.status === 'active'
                            ? 'bg-red-100 text-red-700'
                            : incident.status === 'closed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {incident.actions_taken && incident.actions_taken.length > 0 && (
                      <div className="space-y-1 mb-2">
                        {incident.actions_taken.map((action, idx) => (
                          <p key={idx} className="text-xs text-gray-600">
                            ✓ {action.action}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(incident.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {incident.response_time_seconds && (
                        <span className="text-green-600 font-medium">
                          ⚡ {incident.response_time_seconds}s
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SafePoint Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-900 mb-4">Network Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Branches</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  B
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {safepoints.filter(sp => sp.type === 'branch').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">FNB Branches</p>
            </div>

            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">ATMs</span>
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {safepoints.filter(sp => sp.type === 'atm').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">24/7 Access Points</p>
            </div>

            <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Merchants</span>
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  M
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {safepoints.filter(sp => sp.type === 'merchant').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Partner Stores</p>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="font-bold text-xl mb-4">Impact Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Network Reach</p>
              <p className="text-3xl font-bold">{totalSafepoints} locations</p>
              <p className="text-sm text-blue-100 mt-1">
                Covering {cities.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Response Efficiency</p>
              <p className="text-3xl font-bold">{stats.avgResponseTime}s avg</p>
              <p className="text-sm text-blue-100 mt-1">
                {stats.avgResponseTime < 120 ? '✓ Within target' : '⚠ Above target'}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Daily Activity</p>
              <p className="text-3xl font-bold">{stats.todayCount} requests</p>
              <p className="text-sm text-blue-100 mt-1">
                {stats.activeCount} awaiting completion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}