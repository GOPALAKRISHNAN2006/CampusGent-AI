import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { User, Bell, ShieldAlert, CheckCircle, AlertCircle, Lock } from 'lucide-react';

export const PlacementSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    weeklyDigest: false,
    aiRecommendations: true,
    twoFactorAuth: false,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
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
      setErrorMsg(err.response?.data?.message || 'Failed to fetch placement cell settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setErrorMsg(null);

    try {
      const payload = {
        name,
        preferences,
      };

      if (currentPassword && newPassword) {
        if (newPassword.length < 6) {
          setErrorMsg('New password must be at least 6 characters.');
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setErrorMsg('New passwords do not match.');
          setSaving(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await apiClient.put('/auth/settings', payload);
      setSaveSuccess(res.data?.message || 'Placement configuration settings saved successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update placement settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900">Placement Cell Configurations</h1>
        <p className="text-brand-500 mt-1">
          Configure officer credentials, adjust operation alert thresholds, and customize autonomous AI agents.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-brand-500 font-semibold animate-pulse">
          Loading placement configuration settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-brand-200/60 shadow-xs bg-white">
              <CardHeader className="border-b border-brand-100">
                <div className="flex items-center gap-1.5">
                  <User className="h-4.5 w-4.5 text-indigo-650" />
                  <CardTitle className="text-brand-900 font-bold">Officer Profile Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block text-[11px]">Placement Officer Name</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block text-[11px]">Official Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-brand-50/70 text-brand-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block text-[11px]">Assigned Role</label>
                    <input
                      type="text"
                      disabled
                      value={user?.role || 'PLACEMENT_OFFICER'}
                      className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-brand-50/70 text-brand-600 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-brand-700 block text-[11px]">Two-Factor Authentication</label>
                    <label className="flex items-center gap-2 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.twoFactorAuth}
                        onChange={() => setPreferences((p) => ({ ...p, twoFactorAuth: !p.twoFactorAuth }))}
                        className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                      />
                      <span className="font-semibold text-brand-800 text-xs">Enable 2FA login verification</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-xs bg-white">
              <CardHeader className="border-b border-brand-100">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="h-4.5 w-4.5 text-indigo-650" />
                  <CardTitle className="text-brand-900 font-bold">AI Governance & Thresholds</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <span className="font-bold text-brand-900 text-[11px]">Flag low-readiness students</span>
                      <p className="text-brand-500 max-w-sm text-[11px]">
                        Automatically flag candidates below minimum required interview and academic readiness indexes.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.aiRecommendations}
                      onChange={() => setPreferences((p) => ({ ...p, aiRecommendations: !p.aiRecommendations }))}
                      className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 mt-1 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-start justify-between border-t border-brand-100 pt-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-brand-900 text-[11px]">Autonomous Drive Shortlisting</span>
                      <p className="text-brand-500 max-w-sm text-[11px]">
                        Allow AI matching agent to compute ATS score rankings against drive eligibility criteria.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.weeklyDigest}
                      onChange={() => setPreferences((p) => ({ ...p, weeklyDigest: !p.weeklyDigest }))}
                      className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 mt-1 cursor-pointer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-brand-200/60 shadow-xs bg-white">
              <CardHeader className="border-b border-brand-100">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-4.5 w-4.5 text-indigo-650" />
                  <CardTitle className="text-brand-900 font-bold">Change Credentials (Optional)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-500 block mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-500 block mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-brand-500 block mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-brand-200/60 shadow-xs bg-white">
              <CardHeader className="border-b border-brand-100">
                <div className="flex items-center gap-1.5">
                  <Bell className="h-4.5 w-4.5 text-indigo-650" />
                  <CardTitle className="text-brand-900 font-bold">Operations Alert Channels</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 font-semibold text-brand-700">
                <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                  <span>Direct email dispatches</span>
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={() => setPreferences((p) => ({ ...p, emailAlerts: !p.emailAlerts }))}
                    className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                  <span>System alerts drawer dropdown</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="rounded border-brand-300 text-indigo-600 h-4 w-4 opacity-75"
                  />
                </div>
                <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                  <span>Weekly digest reports</span>
                  <input
                    type="checkbox"
                    checked={preferences.weeklyDigest}
                    onChange={() => setPreferences((p) => ({ ...p, weeklyDigest: !p.weeklyDigest }))}
                    className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3 text-xs cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Configuration Settings'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PlacementSettings;
