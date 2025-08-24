import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

const Profile = () => {
  const [userData, setUserData] = useState({
    email: "",
    lastLogin: "",
    role: "Admin"
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    if (!email) {
      navigate('/');
      return;
    }

    // Simulate fetching user data (in real app, this would come from API)
    setUserData({
      email: email,
      lastLogin: new Date().toLocaleString(),
      role: "Admin"
    });
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-xl font-semibold text-blue-600">
            Loading Profile...
          </span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                👤 Admin Profile
              </h1>
              <p className="text-gray-600">
                Manage your account information and settings
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Profile Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email Address
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-800 font-medium">{userData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Role
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-800 font-medium">{userData.role}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Last Login
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-800 font-medium">{userData.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Account Actions
                </h2>
                
                <div className="space-y-4">
                  <button
                    onClick={() => alert('Password reset functionality will be implemented soon!')}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition"
                  >
                    🔒 Reset Password
                  </button>

                  <button
                    onClick={() => alert('Profile update functionality will be implemented soon!')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    ✏️ Update Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    🚪 Logout
                  </button>
                </div>

                {/* Statistics */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Account Status</h3>
                  <div className="text-sm text-blue-600">
                    <p>✅ Account Active</p>
                    <p>✅ Email Verified</p>
                    <p>✅ Admin Privileges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold text-gray-800">Dashboard Access</div>
                <div className="text-sm text-gray-600">Full Access</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-center">
                <div className="text-2xl mb-2">🔐</div>
                <div className="font-semibold text-gray-800">Security Level</div>
                <div className="text-sm text-gray-600">High</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-center">
                <div className="text-2xl mb-2">⏰</div>
                <div className="font-semibold text-gray-800">Session</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
