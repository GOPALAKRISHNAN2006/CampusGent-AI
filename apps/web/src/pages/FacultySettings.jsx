import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { CheckCircle, Settings, AlertCircle, User, Bell, Lock } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';

export const FacultySettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    weeklyDigest: true,
    aiRecommendations: true,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/auth/settings');
      const u = res.data?.data?.user;
      if (u) {
        setName(u.name || '');
        setEmail(u.email || '');
        if (u.preferences) {
          setPreferences((prev) => ({ ...prev, ...u.preferences }));
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch faculty settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSavePreferences = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await apiClient.put('/auth/settings', {
        name,
        preferences,
      });
      setSuccess(res.data?.message || 'Faculty settings updated successfully.');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await apiClient.put('/auth/settings', {
        currentPassword,
        newPassword,
      });
      setSuccess(res.data?.message || 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900 flex items-center gap-1.5">
          <Settings className="h-5.5 w-5.5 text-brand-500" />
          <span>Faculty Settings Portal</span>
        </h1>
        <p className="text-xs text-brand-500 mt-1">
          Configure profile details, alert notification thresholds, and faculty security credentials.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-brand-500 font-semibold animate-pulse">
          Loading faculty settings...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="flex flex-col gap-1.5 md:col-span-1 bg-white border border-brand-200/60 p-3 rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-2.5 rounded-lg text-left font-bold transition-all text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-450 hover:bg-brand-50/50 hover:text-brand-700'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Account Details</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3.5 py-2.5 rounded-lg text-left font-bold transition-all text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-450 hover:bg-brand-50/50 hover:text-brand-700'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span>Notification Limits</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2.5 rounded-lg text-left font-bold transition-all text-xs flex items-center gap-2 cursor-pointer ${
                activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-450 hover:bg-brand-50/50 hover:text-brand-700'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Security & Password</span>
            </button>
          </div>

          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <Card className="border border-brand-200/60 shadow-xs bg-white">
                <CardHeader className="pb-3 border-b border-brand-50">
                  <CardTitle className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                    Update Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-450 mb-1">
                        Faculty Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-450 mb-1">
                        Email Address
                      </label>
                      <input
                        type="text"
                        disabled
                        value={email}
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-brand-50/60 text-brand-600"
                      />
                    </div>
                    <div className="p-3 bg-brand-50/50 rounded-lg border border-brand-100 flex items-center justify-between md:col-span-2">
                      <div>
                        <span className="text-brand-450 block font-medium text-[11px]">Interface Theme</span>
                        <span className="font-bold text-brand-900 block mt-0.5 text-xs">Switch between Light and Dark mode</span>
                      </div>
                      <ThemeToggle variant="pill" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2 h-9 font-bold cursor-pointer disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="border border-brand-200/60 shadow-xs bg-white">
                <CardHeader className="pb-3 border-b border-brand-50">
                  <CardTitle className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                    Configure Alert Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-3.5">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <span className="font-semibold text-brand-800 block">Email Alerts</span>
                        <span className="text-[10px] text-brand-400 block mt-0.5">
                          Receive notifications for attendance warnings and student risk detections.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.emailAlerts}
                        onChange={() => setPreferences((p) => ({ ...p, emailAlerts: !p.emailAlerts }))}
                        className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between border-t border-brand-100 pt-3.5 cursor-pointer">
                      <div>
                        <span className="font-semibold text-brand-800 block">Weekly Analytical Progress Reports</span>
                        <span className="text-[10px] text-brand-400 block mt-0.5">
                          Receive automated AI class engagement and assessment digests each week.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.weeklyDigest}
                        onChange={() => setPreferences((p) => ({ ...p, weeklyDigest: !p.weeklyDigest }))}
                        className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between border-t border-brand-100 pt-3.5 cursor-pointer">
                      <div>
                        <span className="font-semibold text-brand-800 block">AI Interventions</span>
                        <span className="text-[10px] text-brand-400 block mt-0.5">
                          Allow cognitive agent recommendations for students needing targeted academic assistance.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.aiRecommendations}
                        onChange={() => setPreferences((p) => ({ ...p, aiRecommendations: !p.aiRecommendations }))}
                        className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2 h-9 font-bold cursor-pointer disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="border border-brand-200/60 shadow-xs bg-white">
                <CardHeader className="pb-3 border-b border-brand-50">
                  <CardTitle className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                    Change Account Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-450 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-450 mb-1">
                        New Password (minimum 6 characters)
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-450 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2 h-9 font-bold cursor-pointer disabled:opacity-60"
                      >
                        {saving ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultySettings;
