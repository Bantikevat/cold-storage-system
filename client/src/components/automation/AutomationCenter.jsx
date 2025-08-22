
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "../layout/Layout";
import Swal from 'sweetalert2';

const AutomationCenter = () => {
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'Auto Stock Update',
      description: 'Automatically update stock levels when purchases are added',
      isActive: true,
      type: 'stock'
    },
    {
      id: 2,
      name: 'Low Stock Alerts',
      description: 'Send alerts when stock levels are below threshold',
      isActive: false,
      type: 'alert'
    },
    {
      id: 3,
      name: 'Daily Sales Report',
      description: 'Generate and send daily sales reports automatically',
      isActive: true,
      type: 'report'
    },
    {
      id: 4,
      name: 'Auto Invoice Generation',
      description: 'Automatically generate invoices for completed sales',
      isActive: true,
      type: 'invoice'
    },
    {
      id: 5,
      name: 'Farmer Payment Reminders',
      description: 'Send payment reminders to farmers automatically',
      isActive: false,
      type: 'payment'
    }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    database: 'connected',
    server: 'running',
    automation: 'active',
    lastBackup: new Date().toISOString()
  });

  const toggleAutomation = (id) => {
    setAutomations(automations.map(automation => 
      automation.id === id 
        ? { ...automation, isActive: !automation.isActive }
        : automation
    ));

    Swal.fire({
      icon: 'success',
      title: 'Automation Updated!',
      text: 'Automation setting has been changed successfully.',
      confirmButtonColor: '#0369a1'
    });
  };

  const runAutomation = async (automation) => {
    Swal.fire({
      title: 'Running Automation...',
      text: `Executing ${automation.name}`,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    // Simulate automation execution
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Automation Completed!',
        text: `${automation.name} executed successfully.`,
        confirmButtonColor: '#0369a1'
      });
    }, 2000);
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stock': return '📦';
      case 'alert': return '⚠️';
      case 'report': return '📊';
      case 'invoice': return '🧾';
      case 'payment': return '💰';
      default: return '⚙️';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              🤖 Automation Center
            </h1>
            <p className="text-gray-600">Complete system automation and monitoring</p>
          </div>

          {/* System Health Dashboard */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 System Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Database</p>
                    <p className="text-lg font-bold text-green-800">Connected</p>
                  </div>
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-green-600">🗄️</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Server</p>
                    <p className="text-lg font-bold text-blue-800">Running</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🖥️</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Automation</p>
                    <p className="text-lg font-bold text-purple-800">Active</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">🤖</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Last Backup</p>
                    <p className="text-lg font-bold text-orange-800">Today</p>
                  </div>
                  <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">💾</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Automation Rules */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Automation Rules</h2>
            <div className="space-y-4">
              {automations.map((automation) => (
                <div key={automation.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{getTypeIcon(automation.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{automation.name}</h3>
                        <p className="text-gray-600">{automation.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(automation.isActive)}`}>
                        {automation.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => toggleAutomation(automation.id)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          automation.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          automation.isActive ? 'transform translate-x-7' : 'transform translate-x-1'
                        }`}></div>
                      </button>
                      {automation.isActive && (
                        <button
                          onClick={() => runAutomation(automation)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Run Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => Swal.fire({
                icon: 'success',
                title: 'Backup Created!',
                text: 'System backup completed successfully.',
                confirmButtonColor: '#0369a1'
              })}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">💾</div>
                <div className="font-semibold text-lg">Create Backup</div>
                <div className="text-sm opacity-90">Backup all system data</div>
              </div>
            </button>

            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => Swal.fire({
                icon: 'info',
                title: 'System Optimized!',
                text: 'System performance optimized successfully.',
                confirmButtonColor: '#0369a1'
              })}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">🚀</div>
                <div className="font-semibold text-lg">Optimize System</div>
                <div className="text-sm opacity-90">Improve performance</div>
              </div>
            </button>

            <button
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => Swal.fire({
                icon: 'success',
                title: 'Reports Generated!',
                text: 'All system reports generated successfully.',
                confirmButtonColor: '#0369a1'
              })}
            >
              <div className="text-center">
                <div className="text-3xl mb-3">📊</div>
                <div className="font-semibold text-lg">Generate Reports</div>
                <div className="text-sm opacity-90">Create all reports</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AutomationCenter;
