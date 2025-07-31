import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiSettings,
  FiUser,
  FiLock,
  FiBell,
  FiCreditCard,
  FiSliders,
  FiDatabase
} from 'react-icons/fi';
import Layout from '../layout/Layout';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: '',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
    },
    security: {
      twoFactorAuth: false,
      passwordExpiry: 30,
      loginAttempts: 5,
    },
    notifications: {
      stockAlerts: false,
      emailReports: false,
      pushNotifications: false,
    },
    payment: {
      paymentMethod: 'razorpay',
      taxRate: 18,
      invoicePrefix: 'INV-',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data) {
          setSettings(prev => ({
            general: { ...prev.general, ...response.data.general },
            security: { ...prev.security, ...response.data.security },
            notifications: { ...prev.notifications, ...response.data.notifications },
            payment: { ...prev.payment, ...response.data.payment },
          }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to fetch settings. Please try again later.");
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      await axios.put('/api/settings', settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <FiSettings className="text-2xl mr-2 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              <button onClick={() => setActiveTab('general')} className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'general' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FiSliders className="mr-3" /> General Settings
              </button>
              <button onClick={() => setActiveTab('security')} className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FiLock className="mr-3" /> Security
              </button>
              <button onClick={() => setActiveTab('notifications')} className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FiBell className="mr-3" /> Notifications
              </button>
              <button onClick={() => setActiveTab('payment')} className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'payment' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FiCreditCard className="mr-3" /> Payment
              </button>
              <button onClick={() => setActiveTab('users')} className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FiUser className="mr-3" /> User Management
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiSliders className="mr-2" /> General Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" value={settings.general?.companyName || ''} onChange={(e) => handleInputChange('general', 'companyName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select value={settings.general?.timezone || 'Asia/Kolkata'} onChange={(e) => handleInputChange('general', 'timezone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">Eastern Time (EST)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select value={settings.general?.currency || 'INR'} onChange={(e) => handleInputChange('general', 'currency', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                    <select value={settings.general?.dateFormat || 'DD/MM/YYYY'} onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                <button onClick={saveSettings} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save General Settings</button>
              </div>
            )}

            {/* Other Tabs (Security, Notifications, Payment) - remain unchanged */}
            {/* Paste from your original code or I can also update if needed */}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
