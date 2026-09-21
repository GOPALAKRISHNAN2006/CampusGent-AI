import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, Settings, ShieldAlert, Bell, Lock } from 'lucide-react';

export const FacultySettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900 flex items-center gap-1.5">
          <Settings className="h-5.5 w-5.5 text-brand-500" />
          <span>Faculty settings portal</span>
        </h1>
        <p className="text-xs text-brand-500 mt-1">Configure your profile visibility, password security, and alerts thresholds.</p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left Side Tab Buttons */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-lg text-left font-bold transition-all text-[11px] ${
              activeTab === 'profile' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-brand-450 hover:bg-brand-50/50 hover:text-brand-700'
            }`}
          >
            Account Details
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-lg text-left font-bold transition-all text-[11px] ${
              activeTab === 'notifications' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-brand-450 hover:bg-brand-50/50 hover:text-brand-700'
            }`}
          >
            Notification limits
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-lg text-left font-bold transition-all text-[11px] ${
              activeTab === 'security' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-brand-450 hover:bg-brand-50/50 hover:text-brand-700'
            }`}
          >
            Security & password
          </button>
        </div>

        {/* Right Side Content Panel */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-brand-50">
                <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                  Update Account details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Designation</label>
                    <input
                      type="text"
                      defaultValue="Assistant Professor"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Office Hours Classroom</label>
                    <input
                      type="text"
                      defaultValue="Cabin 402, Block B"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2 h-9 font-bold">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-brand-50">
                <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                  Configure alert notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                    <span className="font-semibold text-brand-800">Email alerts for High-Risk student detections</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-brand-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                    <span className="font-semibold text-brand-800">Weekly analytical class progress reports</span>
                  </label>
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2 h-9 font-bold">
                    Save preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="border border-brand-200/60 shadow-sm">
              <CardHeader className="pb-3 border-b border-brand-50">
                <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">
                  Change account password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">New Password</label>
                    <input
                      type="password"
                      className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSave} className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2 h-9 font-bold">
                    Update Password
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
export default FacultySettings;
