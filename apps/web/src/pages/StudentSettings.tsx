import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Settings,
  User,
  Lock,
  Bell,
  Shield,
  Sliders,
  CheckCircle
} from 'lucide-react';

export const StudentSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'account' | 'security' | 'notifications' | 'privacy' | 'preferences'>('profile');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Settings dummy states
  const [emailNotify, setEmailNotify] = useState(true);
  const [aiMatchingNotify, setAiMatchingNotify] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('light');

  const triggerSave = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-500" />
          <span>System Settings</span>
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Customize notifications, security tokens, profile display settings, and system preferences.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid Sub-navigation Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Side Sub-Navigation */}
        <div className="md:col-span-1 bg-white border border-brand-200/60 p-3 rounded-xl shadow-sm space-y-1">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeSubTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile Visibility</span>
          </button>
          <button
            onClick={() => setActiveSubTab('account')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeSubTab === 'account' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Account Details</span>
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeSubTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Security & Pass</span>
          </button>
          <button
            onClick={() => setActiveSubTab('notifications')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeSubTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => setActiveSubTab('privacy')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeSubTab === 'privacy' ? 'bg-indigo-50 text-indigo-700' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-900'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Data & Privacy</span>
          </button>
        </div>

        {/* Right Side Settings Panels */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeSubTab === 'profile' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-brand-900">Profile Visibility Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-brand-500 leading-relaxed">
                  Configure who can view your featured projects, academic grades transcripts, and declared skills.
                </p>
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" />
                    <span className="font-semibold text-brand-850">Make profile searchable by Placement Officers</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" />
                    <span className="font-semibold text-brand-850">Display cumulative GPA on Job Board applications</span>
                  </label>
                </div>
                <div className="pt-2">
                  <Button onClick={() => triggerSave('Profile visibility parameters updated.')} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: ACCOUNT */}
          {activeSubTab === 'account' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-brand-900">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-brand-50/50 rounded-lg">
                    <span className="text-brand-450 block font-medium">Logged Name</span>
                    <span className="font-bold text-brand-900 block mt-0.5">{user?.name}</span>
                  </div>
                  <div className="p-3 bg-brand-50/50 rounded-lg">
                    <span className="text-brand-450 block font-medium">Authentication Email</span>
                    <span className="font-bold text-brand-900 block mt-0.5">{user?.email}</span>
                  </div>
                  <div className="p-3 bg-brand-50/50 rounded-lg">
                    <span className="text-brand-450 block font-medium">Current System Role</span>
                    <span className="font-bold text-indigo-650 block mt-0.5">{user?.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: SECURITY */}
          {activeSubTab === 'security' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-brand-900">Security Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-brand-500 mb-1.5 tracking-wider">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white focus:border-indigo-500" />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-brand-100 pt-4">
                  <div>
                    <span className="font-semibold text-brand-900 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-[10px] text-brand-400 block mt-0.5">Secure your student account with authenticator codes.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <Button onClick={() => triggerSave('Security tokens and password updated.')} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4">
                    Update Security settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeSubTab === 'notifications' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-brand-900">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-brand-900 block">Email Alerts</span>
                      <span className="text-[10px] text-brand-400 block mt-0.5">Receive email digests for placement announcements and schedule changes.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotify}
                      onChange={(e) => setEmailNotify(e.target.checked)}
                      className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-brand-100 pt-3.5">
                    <div>
                      <span className="font-semibold text-brand-900 block">AI Recommendation Digests</span>
                      <span className="text-[10px] text-brand-400 block mt-0.5">Get notified immediately when job match recommendation algorithms suggest opportunities.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiMatchingNotify}
                      onChange={(e) => setAiMatchingNotify(e.target.checked)}
                      className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button onClick={() => triggerSave('Notification settings saved.')} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: PRIVACY */}
          {activeSubTab === 'privacy' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-brand-900">Privacy & Data Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-brand-500 leading-relaxed">
                  CampusGent AI processes your profile parameters, GPA records, and transcripts for autonomous matching operations. You can review permission parameters below.
                </p>
                <div className="space-y-3.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" />
                    <span className="font-semibold text-brand-850">Allow AI advisor model to process project source codes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" />
                    <span className="font-semibold text-brand-850">Store anonymized mock interview evaluation session records for analysis</span>
                  </label>
                </div>
                <div className="pt-2">
                  <Button onClick={() => triggerSave('Privacy and data preferences saved.')} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4">
                    Confirm Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
export default StudentSettings;
