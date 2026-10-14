import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Settings, User, Lock, Bell, Shield, Sliders, CheckCircle, AlertCircle } from 'lucide-react';

export const StudentSettings = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    smsAlerts: false,
    twoFactorAuth: false,
    theme: 'light',
    weeklyDigest: true,
    jobAlerts: true,
    aiRecommendations: true,
  });

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await apiClient.get('/auth/settings');
      const userData = res.data?.data?.user;
      if (userData) {
        setName(userData.name || '');
        setEmail(userData.email || '');
        if (userData.preferences) {
          setPreferences((prev) => ({ ...prev, ...userData.preferences }));
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to load user settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await apiClient.put('/auth/settings', {
        name,
        preferences,
      });
      setSuccessMsg(res.data?.message || 'Settings saved successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMsg('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await apiClient.put('/auth/settings', {
        currentPassword,
        newPassword,
      });
      setSuccessMsg(res.data?.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Password update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-500" />
          <span>Student System Settings</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Customize notifications, security tokens, profile display settings, and system preferences.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-brand-500 font-semibold animate-pulse">
          Loading student settings...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-1 bg-white border border-brand-200/60 p-3 rounded-xl shadow-xs space-y-1">
            <button
              onClick={() => setActiveSubTab('account')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSubTab === 'account' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <Sliders className="h-4 w-4" />
              <span>Account Details</span>
            </button>
            <button
              onClick={() => setActiveSubTab('notifications')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSubTab === 'notifications' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveSubTab('security')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSubTab === 'security' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Security & Pass</span>
            </button>
            <button
              onClick={() => setActiveSubTab('privacy')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeSubTab === 'privacy' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Data & Privacy</span>
            </button>
          </div>

          <div className="md:col-span-3 space-y-6">
            {activeSubTab === 'account' && (
              <Card className="border border-brand-200/60 shadow-xs bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-brand-900">Account Profile & Name</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-brand-50/50 rounded-lg border border-brand-100">
                      <label className="text-brand-450 block font-medium text-[11px]">Display Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full text-xs font-bold text-brand-900 border border-brand-200 rounded-lg p-2 bg-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="p-3 bg-brand-50/50 rounded-lg border border-brand-100">
                      <span className="text-brand-450 block font-medium text-[11px]">Email Address</span>
                      <span className="font-bold text-brand-900 block mt-2 text-xs">{email}</span>
                    </div>
                    <div className="p-3 bg-brand-50/50 rounded-lg border border-brand-100">
                      <span className="text-brand-450 block font-medium text-[11px]">System Role</span>
                      <span className="font-bold text-indigo-650 block mt-2 text-xs">{user?.role}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 font-bold cursor-pointer disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save Profile Name'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSubTab === 'notifications' && (
              <Card className="border border-brand-200/60 shadow-xs bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-brand-900">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-brand-900 block">Email Alerts</span>
                        <span className="text-[10px] text-brand-400 block mt-0.5">
                          Receive email digests for placement announcements and schedule changes.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailAlerts}
                        onChange={() => handlePreferenceToggle('emailAlerts')}
                        className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-100 pt-3.5">
                      <div>
                        <span className="font-semibold text-brand-900 block">AI Recommendation Alerts</span>
                        <span className="text-[10px] text-brand-400 block mt-0.5">
                          Get notified when autonomous agent algorithms find recommended jobs matching your profile.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.aiRecommendations}
                        onChange={() => handlePreferenceToggle('aiRecommendations')}
                        className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-100 pt-3.5">
                      <div>
                        <span className="font-semibold text-brand-900 block">Weekly Digest</span>
                        <span className="text-[10px] text-brand-400 block mt-0.5">
                          Receive a weekly progress summary of applications, upcoming interviews, and skills progress.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.weeklyDigest}
                        onChange={() => handlePreferenceToggle('weeklyDigest')}
                        className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 font-bold cursor-pointer disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save Notification Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSubTab === 'security' && (
              <Card className="border border-brand-200/60 shadow-xs bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-brand-900">Security Credentials & 2FA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleUpdatePassword} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">
                        New Password (minimum 6 characters)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 font-bold cursor-pointer disabled:opacity-60"
                    >
                      {saving ? 'Updating...' : 'Change Password'}
                    </Button>
                  </form>

                  <div className="flex items-center justify-between border-t border-brand-100 pt-4">
                    <div>
                      <span className="font-semibold text-brand-900 block">Two-Factor Authentication (2FA)</span>
                      <span className="text-[10px] text-brand-400 block mt-0.5">
                        Require a secondary authenticator verification step upon portal sign in.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.twoFactorAuth}
                      onChange={() => handlePreferenceToggle('twoFactorAuth')}
                      className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSubTab === 'privacy' && (
              <Card className="border border-brand-200/60 shadow-xs bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-brand-900">Privacy & Data Governance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-brand-500 leading-relaxed text-xs">
                    CampusGent AI processes your declared profile competencies, academic transcript records, and career goals for autonomous matching and ATS recommendations. Data isolation is strictly enforced across students.
                  </p>
                  <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 text-[11px] text-brand-700 space-y-1.5 font-medium">
                    <p>• Model Context Isolation: Your private interview records and grades are never exposed to peer accounts.</p>
                    <p>• Academic Verification: Placement eligibility checks strictly verify verified grades from official departmental records.</p>
                    <p>• Audit Trail: Administrative role changes and credential updates are stored in tamper-evident audit logs.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSettings;
