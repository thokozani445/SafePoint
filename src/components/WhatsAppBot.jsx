// src/components/WhatsAppBot.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MapPin, Phone, Car, Shield } from 'lucide-react';
import { getNearestSafepoints } from '../config/supabase';

export default function WhatsAppBot({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! You've reached FNB SafePoint. Are you safe right now?",
      options: ['Yes', 'No'],
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [nearestLocations, setNearestLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate getting user location (for demo, use Sandton City coordinates)
  useEffect(() => {
    const demoLocation = { latitude: -26.1076, longitude: 28.0567 };
    setUserLocation(demoLocation);
    loadNearestSafepoints(demoLocation.latitude, demoLocation.longitude);
  }, []);

  const loadNearestSafepoints = async (lat, lng) => {
    try {
      const locations = await getNearestSafepoints(lat, lng, 3);
      setNearestLocations(locations);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const addMessage = (text, type = 'bot', options = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      text,
      options,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleOptionClick = (option) => {
    // Add user's choice
    addMessage(option, 'user');

    // Bot responses based on conversation flow
    setTimeout(() => {
      if (option === 'No') {
        addMessage(
          "I understand you need help. Here are the 3 nearest SafePoints to you:",
          'bot'
        );
        
        // Show locations
        setTimeout(() => {
          nearestLocations.forEach((loc, idx) => {
            addMessage(
              `${idx + 1}. ${loc.name}\n📍 ${loc.address}\n🚶 ${loc.distance.toFixed(1)}km away\n⏰ ${loc.hours}`,
              'bot'
            );
          });
          
          setTimeout(() => {
            addMessage(
              "What would you like to do?",
              'bot',
              ['Find Directions', 'Call Helpline', 'Request Transport', 'Send Alert to Contact']
            );
          }, 500);
        }, 500);
      } else if (option === 'Yes') {
        addMessage(
          "I'm glad you're safe. How can I help you today?",
          'bot',
          ['Find Nearest SafePoints', 'Learn About SafePoint', 'Emergency Contacts']
        );
      } else if (option === 'Find Directions') {
        addMessage(
          `Opening directions to ${nearestLocations[0]?.name}...\n\n📍 Google Maps link: https://maps.google.com/?q=${nearestLocations[0]?.latitude},${nearestLocations[0]?.longitude}`,
          'bot'
        );
        setTimeout(() => {
          addMessage("Is there anything else I can help with?", 'bot', ['Call Helpline', 'Request Transport', "I'm Safe Now"]);
        }, 1000);
      } else if (option === 'Call Helpline') {
        addMessage(
          "Connecting you to GBV Command Centre (24/7)...\n\n☎️ Call connecting now\n📞 Reference: SP" + Math.floor(Math.random() * 10000),
          'bot'
        );
        setTimeout(() => {
          addMessage(
            "✅ Connected to counselor. They will help you from here.\n\nYou can also:",
            'bot',
            ['Request Transport', 'Send Alert to Contact', 'End Chat']
          );
        }, 2000);
      } else if (option === 'Request Transport') {
        const voucherCode = Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000);
        addMessage(
          `🎫 Transport voucher issued!\n\nCode: ${voucherCode}\nAmount: R150 eWallet\nValid: 4 hours\n\nUse for Uber/Bolt to:\n• Police station\n• Hospital\n• Shelter\n• Trusted person's address`,
          'bot'
        );
        setTimeout(() => {
          addMessage("The voucher has been sent to your phone. Stay safe.", 'bot', ['Call Helpline', 'End Chat']);
        }, 1500);
      } else if (option === 'Send Alert to Contact') {
        addMessage(
          "📱 Who should I notify?\n\nPlease type their name and number, or say 'Mom', 'Dad', 'Friend', etc.",
          'bot'
        );
      } else if (option === 'Find Nearest SafePoints') {
        addMessage("Here are SafePoints near you:", 'bot');
        setTimeout(() => {
          nearestLocations.slice(0, 3).forEach((loc, idx) => {
            addMessage(
              `${idx + 1}. ${loc.name}\n📍 ${loc.distance.toFixed(1)}km away\n⏰ ${loc.hours}`,
              'bot'
            );
          });
          setTimeout(() => {
            addMessage("Would you like directions to any of these?", 'bot', ['Get Directions', 'Call Helpline', 'Back to Menu']);
          }, 500);
        }, 500);
      } else if (option === 'Learn About SafePoint') {
        addMessage(
          "SafePoint is a network of safe locations where you can:\n\n✓ Ask for help discreetly\n✓ Connect to counselors\n✓ Get transport to safety\n✓ Contact police if needed\n\nAll FNB branches, many ATMs, and partner stores are SafePoints.",
          'bot',
          ['Find Nearest SafePoints', 'Back to Menu']
        );
      } else if (option === 'Emergency Contacts') {
        addMessage(
          "📞 Emergency Contacts:\n\nGBV Command Centre: 0800 428 428\nSAPS: 10111\nLifeline: 0861 322 322\nTEARS Foundation: 010 590 5920\n\nThese are available 24/7.",
          'bot',
          ['Call Helpline', 'Find SafePoints', 'Back to Menu']
        );
      } else if (option === "I'm Safe Now" || option === 'End Chat') {
        addMessage(
          "I'm glad you're safe. Remember, SafePoint is here whenever you need help.\n\n💙 Stay safe.",
          'bot'
        );
      } else if (option === 'Back to Menu') {
        addMessage(
          "How can I help you?",
          'bot',
          ['Find Nearest SafePoints', 'Call Helpline', 'Request Transport', 'Emergency Contacts']
        );
      }
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage(inputValue, 'user');
    const userMsg = inputValue.toLowerCase();
    setInputValue('');

    // Bot responses to typed messages
    setTimeout(() => {
      if (userMsg.includes('help') || userMsg.includes('safe')) {
        addMessage("Are you safe right now?", 'bot', ['Yes', 'No']);
      } else if (userMsg.includes('mom') || userMsg.includes('dad') || userMsg.includes('friend')) {
        addMessage(
          `✅ Alert sent to ${inputValue}!\n\nThey will receive:\n• Your approximate location\n• Message: "I need help"\n• SafePoint contact info`,
          'bot',
          ['Call Helpline', 'Request Transport', 'End Chat']
        );
      } else {
        addMessage(
          "I can help you with:\n\n• Finding nearest SafePoints\n• Connecting to helpline\n• Requesting transport\n• Sending alerts",
          'bot',
          ['Find SafePoints', 'Call Helpline', 'Request Transport']
        );
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold">SafePoint Support</h1>
              <p className="text-xs text-green-100">24/7 Confidential Help</p>
            </div>
          </div>
          <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#e5ddd5] p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none shadow-md'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                
                {/* Option Buttons */}
                {msg.options && (
                  <div className="mt-3 space-y-2">
                    {msg.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors text-left"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs opacity-60 mt-1">
                  {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-gray-200 border-t border-gray-300">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 focus:border-green-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            🔒 End-to-end encrypted • Your privacy is protected
          </p>
        </div>
      </div>
    </div>
  );
}