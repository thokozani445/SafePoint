// src/components/LandingPage.jsx
import { Shield, MessageCircle, Users, MapPin } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-10 h-10 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">SafePoint</h1>
              <p className="text-xs text-blue-200">Powered by FNB</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white font-semibold">FNB Hackathon 2025</p>
            <p className="text-xs text-blue-200">MVP Demonstration</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Turning Trust Into Safety
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            A community safety network that transforms FNB branches, ATMs, and partner merchants 
            into discreet safe points where anyone at risk can quietly ask for help.
          </p>
          <div className="flex items-center justify-center space-x-6 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold">35+</div>
              <div className="text-sm text-blue-200">SafePoints</div>
            </div>
            <div className="w-px h-12 bg-blue-400"></div>
            <div className="text-center">
              <div className="text-4xl font-bold">&lt;60s</div>
              <div className="text-sm text-blue-200">Response Time</div>
            </div>
            <div className="w-px h-12 bg-blue-400"></div>
            <div className="text-center">
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-sm text-blue-200">Support Available</div>
            </div>
          </div>
        </div>

        {/* Demo Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {/* Staff App Card */}
          <button
            onClick={() => onNavigate('staff')}
            className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-left group"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Staff App</h3>
            <p className="text-gray-600 mb-4">
              Simple, guided interface for SafePoint staff to assist survivors and connect them to help.
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
              Launch Demo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* WhatsApp Bot Card */}
          <button
            onClick={() => onNavigate('whatsapp')}
            className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-left group"
          >
            <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Bot</h3>
            <p className="text-gray-600 mb-4">
              Survivors can find nearest SafePoints and request help discreetly via WhatsApp.
            </p>
            <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
              Launch Demo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Admin Dashboard Card */}
          <button
            onClick={() => onNavigate('admin')}
            className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 text-left group"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Real-time monitoring, incident tracking, and network coverage visualization.
            </p>
            <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
              Launch Demo
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Key Features */}
        <div className="mt-16 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">1</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Discreet Entry</h4>
              <p className="text-blue-200 text-sm">
                Use code phrase or app to signal need for help
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">2</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Safe Space</h4>
              <p className="text-blue-200 text-sm">
                Trained staff move person to private area
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">3</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Connect Help</h4>
              <p className="text-blue-200 text-sm">
                Link to helplines, NGOs, police, or shelter
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-900">4</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Safe Transfer</h4>
              <p className="text-blue-200 text-sm">
                Provide transport to next safe location
              </p>
            </div>
          </div>
        </div>

        {/* Impact Statement */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 text-lg italic max-w-3xl mx-auto">
            "Every FNB logo becomes a symbol of safety. Every branch, every ATM, every partner store — 
            a place where someone can turn for help when they need it most."
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-20 backdrop-blur-sm py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm">
            SafePoint MVP — Built for FNB Hackathon 2024
          </p>
          <p className="text-blue-300 text-xs mt-2">
            Integrates with GBV Command Centre • TEARS Foundation • Lifeline • SAPS
          </p>
        </div>
      </footer>
    </div>
  );
}