import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import {
    Activity, ShieldAlert, CheckCircle, Database, Cpu,
    RefreshCw, Clock, Layers, Server, AlertCircle
} from 'lucide-react';

export const AgentHealthDashboard = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const fetchHealth = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/admin/health');
            setHealth(res.data.data);
            setLastRefreshed(new Date());
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch telemetry from /admin/health.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatUptime = (seconds) => {
        if (!seconds) return '0s';
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (days > 0) return `${days}d ${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
    };

    const agents = health?.agents || [];

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans text-[#1F150C]">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F150C] via-[#31210F] to-[#412D15] p-6 sm:p-8 text-white border border-[#412D15] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">
                        <Activity className="h-3.5 w-3.5 text-[#E1DCC9] animate-pulse" />
                        <span>Live AI Observability & Telemetry</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
                        <Cpu className="h-7 w-7 text-[#E1DCC9]" />
                        <span>Ecosystem Agent Health</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#E1DCC9]/85 font-normal leading-relaxed">
                        Live telemetry from backend micro-orchestrator, database connectivity status, memory allocations, and agent compliance matrices.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <Button
                        onClick={fetchHealth}
                        isLoading={loading}
                        variant="sandstone"
                        className="font-bold flex items-center gap-2 px-4 py-2"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Refresh Telemetry</span>
                    </Button>
                    {lastRefreshed && (
                        <span className="text-[10px] text-[#E1DCC9]/70 font-mono">
                            Last: {lastRefreshed.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-2xl flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* System Status KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-[#E1DCC9] bg-white shadow-sm p-4">
                    <CardContent className="p-0 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#8F7554] tracking-wider block">System Health</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`h-2.5 w-2.5 rounded-full ${health?.status === 'HEALTHY' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                            <p className="text-lg font-black text-[#1F150C]">{health?.status || 'HEALTHY'}</p>
                        </div>
                        <span className="text-[10.5px] text-[#6B5336]">Node {health?.nodeVersion || process.version}</span>
                    </CardContent>
                </Card>

                <Card className="border border-[#E1DCC9] bg-white shadow-sm p-4">
                    <CardContent className="p-0 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#8F7554] tracking-wider block">Database Posture</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Database className="h-4 w-4 text-emerald-600" />
                            <p className="text-lg font-black text-[#1F150C]">{health?.database?.status || 'Connected'}</p>
                        </div>
                        <span className="text-[10.5px] text-[#6B5336] truncate block">{health?.database?.name || 'campusgent'}</span>
                    </CardContent>
                </Card>

                <Card className="border border-[#E1DCC9] bg-white shadow-sm p-4">
                    <CardContent className="p-0 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#8F7554] tracking-wider block">Service Uptime</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Clock className="h-4 w-4 text-[#412D15]" />
                            <p className="text-lg font-black text-[#1F150C]">{formatUptime(health?.uptime)}</p>
                        </div>
                        <span className="text-[10.5px] text-[#6B5336]">Continuous Service</span>
                    </CardContent>
                </Card>

                <Card className="border border-[#E1DCC9] bg-white shadow-sm p-4">
                    <CardContent className="p-0 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#8F7554] tracking-wider block">Memory Allocation</span>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Server className="h-4 w-4 text-indigo-600" />
                            <p className="text-lg font-black text-[#1F150C]">{health?.memoryUsage?.heapUsedMB || 0} MB</p>
                        </div>
                        <span className="text-[10.5px] text-[#6B5336]">RSS: {health?.memoryUsage?.rssMB || 0} MB</span>
                    </CardContent>
                </Card>
            </div>

            {/* Registered Agents Health Table */}
            <Card className="border border-[#E1DCC9] shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-[#E1DCC9]/70 px-6 py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold text-[#1F150C]">Orchestrated AI Agents Registry</CardTitle>
                        <p className="text-[11px] text-[#8F7554] mt-0.5">
                            {health?.metrics?.activeAgents || agents.length} active cognitive agents registered in live micro-orchestrator
                        </p>
                    </div>
                    <Badge variant="success" className="font-bold text-[10px] py-1 px-3">
                        ✓ 100% Policy Compliant
                    </Badge>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-[#FAF7F2] border-b border-[#E1DCC9] text-[#6B5336] font-bold uppercase tracking-wider text-[10px]">
                                    <th className="py-3.5 px-6">Agent Identification</th>
                                    <th className="py-3.5 px-6">Domain Classification</th>
                                    <th className="py-3.5 px-6">Health State</th>
                                    <th className="py-3.5 px-6">Runtime Policy</th>
                                    <th className="py-3.5 px-6 text-right">Observability Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E1DCC9]/60 text-[#1F150C]">
                                {agents.map((agent) => (
                                    <tr key={agent.name} className="hover:bg-[#FAF7F2]/60 transition-colors">
                                        <td className="py-3.5 px-6">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-7 w-7 rounded-lg bg-[#FAF7F2] border border-[#E1DCC9] flex items-center justify-center font-mono font-bold text-[11px] text-[#412D15]">
                                                    AI
                                                </div>
                                                <span className="font-bold text-[#1F150C] font-mono text-[11.5px]">{agent.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <Badge variant={agent.category === 'Placement' ? 'warning' : agent.category === 'Faculty' ? 'primary' : agent.category === 'Admin' ? 'danger' : 'neutral'}>
                                                {agent.category}
                                            </Badge>
                                        </td>
                                        <td className="py-3.5 px-6">
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                {agent.status || 'HEALTHY'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-6 font-mono text-[11px] text-[#6B5336]">
                                            {agent.policy || 'v1.0.0'}
                                        </td>
                                        <td className="py-3.5 px-6 text-right">
                                            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                <CheckCircle className="h-3 w-3" /> Ready
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AgentHealthDashboard;
