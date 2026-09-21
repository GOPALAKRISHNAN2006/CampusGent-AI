import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Settings, 
  User, 
  Bell, 
  ShieldAlert, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const PlacementSettings: React.FC = () => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Placement Cell Configurations</h1>
        <p className="text-brand-500 mt-1">Configure profile details, adjust operations alert thresholds, and toggle AI assistant features.</p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg">
          Settings configured successfully!
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-brand-200/60 shadow-sm bg-white">
            <CardHeader className="border-b border-brand-100">
              <div className="flex items-center gap-1.5">
                <User className="h-4.5 w-4.5 text-indigo-650" />
                <CardTitle className="text-brand-900 font-bold">Officer Profile Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-700 block">Placement Officer Name</label>
                  <input
                    required
                    type="text"
                    defaultValue="Placement Officer"
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-700 block">Official email address</label>
                  <input
                    required
                    type="email"
                    defaultValue="placement@campusgent.edu"
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-brand-700 block">Department Designation</label>
                  <input
                    required
                    type="text"
                    defaultValue="Director, Recruitment Operations"
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-700 block">Cell Office Room Location</label>
                  <input
                    type="text"
                    defaultValue="Building C, Ground Floor"
                    className="w-full border border-brand-200 rounded-lg p-2.5 outline-none bg-white text-brand-850"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card className="border border-brand-200/60 shadow-sm bg-white">
            <CardHeader className="border-b border-brand-100">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="h-4.5 w-4.5 text-indigo-650" />
                <CardTitle className="text-brand-900 font-bold">AI Governance Cutoffs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-brand-900 text-[11px]">Flag low-readiness students</span>
                    <p className="text-brand-500 max-w-sm">Automatically flag students below a specified threshold readiness rating index.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1" />
                </div>
                <div className="flex items-start justify-between border-t border-brand-100 pt-3">
                  <div className="space-y-0.5">
                    <span className="font-bold text-brand-900 text-[11px]">ATS Optimization Assistant</span>
                    <p className="text-brand-500 max-w-sm">Enable AI feedback suggestions for student resume uploads in drive eligibility reviews.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications and Save */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-brand-200/60 shadow-sm bg-white">
            <CardHeader className="border-b border-brand-100">
              <div className="flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-indigo-650" />
                <CardTitle className="text-brand-900 font-bold">Operations Alert Channels</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-semibold text-brand-700">
              <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                <span>Direct email dispatches</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                <span>System alerts drawer dropdown</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
                <span>Weekly digest outcomes reports</span>
                <input type="checkbox" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-3 text-[11px]">
            Save Configuration Settings
          </Button>
        </div>

      </form>

    </div>
  );
};
export default PlacementSettings;
