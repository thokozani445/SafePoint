// src/components/StaffApp.jsx
import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Phone, Car, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getSafepoints, getCurrentCodePhrase, createIncident, addIncidentAction, closeIncident } from '../config/supabase';

export default function StaffApp({ onBack }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pin, setPin] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [codePhrase, setCodePhrase] = useState('');
  const [activeIncident, setActiveIncident] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [checklist, setChecklist] = useState({
    danger: false,
    safeArea: false,
    offered: false,
    asked: false
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [safepointsData, phrase] = await Promise.all([
        getSafepoints(),
        getCurrentCodePhrase()
      ]);
      setLocations(safepointsData);
      setCodePhrase(phrase);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = () => {
    if (pin === '1234' && selectedLocation) {
      setIsLoggedIn(true);
    } else {
      alert('Invalid PIN or no location selected. Use PIN: 1234');
    }
  };

  const startNewRequest = async () => {
    try {
      const incident = await createIncident({
        safepoint_id: selectedLocation,
        staff_pin: pin,
        notes: ''
      });
      setActiveIncident(incident);
      setStartTime(Date.now());
      setChecklist({ danger: false, safeArea: false, offered: false, asked: false });
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Error starting request. Please try again.');
    }
  };

  const handleChecklistChange = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleQuickAction = async (action) => {
    if (!activeIncident) return;

    try {
      await addIncidentAction(activeIncident.id, action);
      alert(`${action} completed successfully!`);
    } catch (error) {
      console.error('Error adding action:', error);
      alert('Error recording action. Please try again.');
    }
  };

  const completeRequest = async () => {
    if (!activeIncident || !startTime) return;

    const responseTime = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      await closeIncident(activeIncident.id, responseTime);
      alert(`Request completed! Response time: ${responseTime} seconds`);
      setActiveIncident(null);
      setStartTime(null);
      setChecklist({ danger: false, safeArea: false, offered: false, asked: false });
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Error completing request. Please try again.');
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 text-white flex items-center space-x-2 hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">SafePoint Staff</h2>
          <p className="text-gray-600 text-center mb-8">Secure Login</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                placeholder="••••"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">Demo PIN: 1234</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Location
              </label>
              <select
                value={selectedLocation || ''}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choose location...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.type})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleLogin}
              disabled={!pin || !selectedLocation}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  if (!activeIncident) {
    const currentLocation = locations.find(l => l.id === selectedLocation);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold">SafePoint Staff</h1>
              <p className="text-sm text-blue-100">{currentLocation?.name}</p>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="text-sm hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
          {/* Code Phrase Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-6 h-6 text-yellow-900" />
              <h3 className="text-lg font-bold text-yellow-900">Today's Code Phrase</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-900">"{codePhrase}"</p>
            <p className="text-sm text-yellow-800 mt-2">Listen for this phrase from customers</p>
          </div>

          {/* New Request Button */}
          <button
            onClick={startNewRequest}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-xl font-bold text-xl shadow-lg transform hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-center space-x-3">
              <AlertTriangle className="w-8 h-8" />
              <span>New SafePoint Request</span>
            </div>
          </button>

          {/* Quick Reference */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-gray-900 mb-4">Quick Reference</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">If immediate danger:</p>
                  <p className="text-gray-600">Call SAPS 10111 first. Keep yourself safe.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Move to safe area</p>
                  <p className="text-gray-600">Back office or quiet corner away from threat</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Offer water and phone</p>
                  <p className="text-gray-600">Use calm, reassuring language</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ask what help they need</p>
                  <p className="text-gray-600">Confirm consent before calling anyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Request Screen
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-bold">Active Request</h1>
                <p className="text-sm text-red-100">Follow SOP carefully</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-mono">
                {startTime ? `${Math.floor((Date.now() - startTime) / 1000)}s` : '0s'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
        {/* SOP Checklist */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
            Standard Operating Procedure
          </h3>
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.danger}
                onChange={() => handleChecklistChange('danger')}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Assess immediate danger</p>
                <p className="text-sm text-gray-600">If yes → Call SAPS 10111 immediately</p>
              </div>
            </label>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.safeArea}
                onChange={() => handleChecklistChange('safeArea')}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Move person to safe area</p>
                <p className="text-sm text-gray-600">Private space away from public view</p>
              </div>
            </label>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.offered}
                onChange={() => handleChecklistChange('offered')}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Offer water and phone</p>
                <p className="text-sm text-gray-600">Calm, reassuring language only</p>
              </div>
            </label>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.asked}
                onChange={() => handleChecklistChange('asked')}
                className="mt-1 w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Ask "What help do you need?"</p>
                <p className="text-sm text-gray-600">Confirm consent before calling anyone</p>
              </div>
            </label>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickAction('Connected to GBV Helpline')}
              className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Connect Helpline</span>
            </button>
            <button
              onClick={() => handleQuickAction('Transport voucher issued')}
              className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold transition-colors"
            >
              <Car className="w-5 h-5" />
              <span>Issue Voucher</span>
            </button>
            <button
              onClick={() => handleQuickAction('SAPS alerted')}
              className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg font-semibold transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Alert SAPS</span>
            </button>
            <button
              onClick={() => handleQuickAction('Trusted contact notified')}
              className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Contact Person</span>
            </button>
          </div>
        </div>

        {/* Complete Request */}
        <button
          onClick={completeRequest}
          disabled={!Object.values(checklist).every(v => v)}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Complete Request
        </button>

        {!Object.values(checklist).every(v => v) && (
          <p className="text-center text-sm text-gray-500">
            Complete all checklist items before finishing
          </p>
        )}
      </div>
    </div>
  );
}