import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
    Settings, Shield, Lock, Bell, CheckCircle2, AlertCircle,
    User, Sliders, Database, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';

export const AdminSettings = () => {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [activeTab, setActiveTab] = useState('profile');

    // Profile & Credentials
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // System Governance Preferences
    const [prefs, setPrefs] = useState({
        systemAlertEmail: true,
        highRiskAlerts: true,
        auditLogRetentionDays: 90,
        rateLimitPerMinute: 60,
        enableTwoFactor: false,
        theme: 'light',
    });

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/auth/settings');
            if (res.data.data?.preferences) {
                setPrefs((prev) => ({ ...prev, ...res.data.data.preferences }));
            }
        } catch (err) {
            console.error('Failed to load settings:', err);
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
        setError(null);
        setSuccessMsg(null);
        try {
            await apiClient.put('/auth/settings', { preferences: prefs });
            setSuccessMsg('Platform settings persisted successfully.');
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update preferences.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }
        setSaving(true);
        setError(null);
        setSuccessMsg(null);
        try {
            await apiClient.put('/auth/settings', {
                currentPassword,
                newPassword,
            });
            setSuccessMsg('Administrator security credentials updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in font-sans text-[#1F150C]">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F150C] via-[#31210F] to-[#412D15] p-6 sm:p-8 text-white border border-[#412D15] shadow-xl">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">
                        <Shield className="h-3.5 w-3.5 text-[#E1DCC9]" />
                        <span>Platform Administration</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
                        <Settings className="h-7 w-7 text-[#E1DCC9]" />
                        <span>System & Governance Settings</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#E1DCC9]/85 max-w-2xl font-normal leading-relaxed">
                        Configure institutional governance policies, audit logging parameters, and administrator security credentials.
                    </p>
                </div>
            </div>

            {/* Notifications */}
            {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-2xl flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}
            {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-2xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 bg-white border border-[#E1DCC9] p-3 rounded-2xl shadow-sm space-y-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activeTab === 'profile'
                                ? 'bg-[#1F150C] text-[#FAF7F2]'
                                : 'text-[#6B5336] hover:bg-[#FAF7F2] hover:text-[#1F150C]'
                        }`}
                    >
                        <User className="h-4 w-4" />
                        <span>Account Details</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('governance')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activeTab === 'governance'
                                ? 'bg-[#1F150C] text-[#FAF7F2]'
                                : 'text-[#6B5336] hover:bg-[#FAF7F2] hover:text-[#1F150C]'
                        }`}
                    >
                        <Sliders className="h-4 w-4" />
                        <span>Platform Policies</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activeTab === 'security'
                                ? 'bg-[#1F150C] text-[#FAF7F2]'
                                : 'text-[#6B5336] hover:bg-[#FAF7F2] hover:text-[#1F150C]'
                        }`}
                    >
                        <Lock className="h-4 w-4" />
                        <span>Security & Password</span>
                    </button>
                </div>

                {/* Tab Views */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <Card className="border border-[#E1DCC9] shadow-sm bg-white">
                            <CardHeader className="border-b border-[#E1DCC9]/70 pb-3">
                                <CardTitle className="text-sm font-bold text-[#1F150C]">Administrator Profile</CardTitle>
                                <p className="text-[11px] text-[#8F7554]">Verified active session credentials</p>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-[#8F7554] uppercase tracking-wider block">Administrator Name</span>
                                        <p className="font-bold text-[#1F150C] text-sm">{authUser?.name || 'Administrator'}</p>
                                    </div>
                                    <div className="p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-[#8F7554] uppercase tracking-wider block">Official Email</span>
                                        <p className="font-bold text-[#1F150C] text-sm">{authUser?.email}</p>
                                    </div>
                                    <div className="p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-[#8F7554] uppercase tracking-wider block">Assigned Role</span>
                                        <Badge variant="danger" className="text-[10px] font-bold mt-1">
                                            {authUser?.role || 'ADMIN'}
                                        </Badge>
                                    </div>
                                    <div className="p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl space-y-1">
                                        <span className="text-[10px] font-bold text-[#8F7554] uppercase tracking-wider block">Access Scope</span>
                                        <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mt-1">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Full Campus Governance
                                        </span>
                                    </div>
                                    <div className="p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl flex items-center justify-between sm:col-span-2">
                                        <div>
                                            <span className="text-[10px] font-bold text-[#8F7554] uppercase tracking-wider block">Interface Appearance</span>
                                            <p className="font-bold text-[#1F150C] text-xs mt-0.5">Toggle between Light and Dark mode</p>
                                        </div>
                                        <ThemeToggle variant="pill" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'governance' && (
                        <Card className="border border-[#E1DCC9] shadow-sm bg-white">
                            <CardHeader className="border-b border-[#E1DCC9]/70 pb-3">
                                <CardTitle className="text-sm font-bold text-[#1F150C]">System Governance Policies</CardTitle>
                                <p className="text-[11px] text-[#8F7554]">Audited platform thresholds and alerts</p>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-5">
                                <form onSubmit={handleSavePreferences} className="space-y-4">
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl cursor-pointer">
                                            <div>
                                                <p className="font-bold text-[#1F150C]">Critical Incident Email Broadcasts</p>
                                                <p className="text-[10.5px] text-[#8F7554]">Receive immediate notifications if AI services report rate limit exhaustion or errors.</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={prefs.systemAlertEmail}
                                                onChange={(e) => setPrefs({ ...prefs, systemAlertEmail: e.target.checked })}
                                                className="h-4 w-4 rounded text-[#412D15] focus:ring-[#412D15]"
                                            />
                                        </label>

                                        <label className="flex items-center justify-between p-3.5 bg-[#FAF7F2] border border-[#E1DCC9] rounded-xl cursor-pointer">
                                            <div>
                                                <p className="font-bold text-[#1F150C]">Daily Student At-Risk Digest</p>
                                                <p className="text-[10.5px] text-[#8F7554]">Forward aggregated low-attendance and academic warning signals to dean and mentors.</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={prefs.highRiskAlerts}
                                                onChange={(e) => setPrefs({ ...prefs, highRiskAlerts: e.target.checked })}
                                                className="h-4 w-4 rounded text-[#412D15] focus:ring-[#412D15]"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                                Audit Log Retention (Days)
                                            </label>
                                            <input
                                                type="number"
                                                min={30}
                                                max={365}
                                                value={prefs.auditLogRetentionDays}
                                                onChange={(e) => setPrefs({ ...prefs, auditLogRetentionDays: parseInt(e.target.value, 10) || 90 })}
                                                className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs font-bold text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                                AI Gateway Max Requests / Min
                                            </label>
                                            <input
                                                type="number"
                                                min={10}
                                                max={300}
                                                value={prefs.rateLimitPerMinute}
                                                onChange={(e) => setPrefs({ ...prefs, rateLimitPerMinute: parseInt(e.target.value, 10) || 60 })}
                                                className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs font-bold text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <Button type="submit" variant="primary" isLoading={saving} className="font-bold px-5 py-2">
                                            Save Governance Policies
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card className="border border-[#E1DCC9] shadow-sm bg-white">
                            <CardHeader className="border-b border-[#E1DCC9]/70 pb-3">
                                <CardTitle className="text-sm font-bold text-[#1F150C]">Security & Credentials</CardTitle>
                                <p className="text-[11px] text-[#8F7554]">Update administrator authentication password</p>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <form onSubmit={handleUpdatePassword} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                            Current Password *
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                                New Password *
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="At least 8 characters"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                                Confirm New Password *
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Repeat new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <Button type="submit" variant="primary" isLoading={saving} className="font-bold px-5 py-2">
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
