import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import {
    History, Search, Shield, ChevronLeft, ChevronRight,
    Terminal, User, Clock, AlertTriangle, ArrowUpRight, Filter
} from 'lucide-react';

export const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionFilter, setActionFilter] = useState('');
    const [expandedLogId, setExpandedLogId] = useState(null);

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get(`/admin/audit-logs?page=${page}&limit=${pagination.limit}`);
            setLogs(res.data.data?.logs || []);
            if (res.data.data?.pagination) {
                setPagination(res.data.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to fetch audit log trail.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, []);

    const filteredLogs = logs.filter((log) => {
        if (!actionFilter) return true;
        return log.action?.toLowerCase().includes(actionFilter.toLowerCase());
    });

    const getActionBadgeVariant = (action) => {
        if (action?.includes('AUTH') || action?.includes('LOGIN')) return 'neutral';
        if (action?.includes('ROLE') || action?.includes('PERMISSION')) return 'danger';
        if (action?.includes('JOB') || action?.includes('DRIVE')) return 'warning';
        return 'primary';
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans text-[#1F150C]">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F150C] via-[#31210F] to-[#412D15] p-6 sm:p-8 text-white border border-[#412D15] shadow-xl">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">
                        <Shield className="h-3.5 w-3.5 text-[#E1DCC9]" />
                        <span>Security Audit & Compliance</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
                        <History className="h-7 w-7 text-[#E1DCC9]" />
                        <span>Immutable Audit Trail</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#E1DCC9]/85 max-w-2xl font-normal leading-relaxed">
                        Traceable security logs recording user role changes, authorization transitions, and administrative operations.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-2xl flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Logs Table Card */}
            <Card className="border border-[#E1DCC9] shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-[#E1DCC9]/70 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-sm font-bold text-[#1F150C]">Security Events Ledger</CardTitle>
                        <p className="text-[11px] text-[#8F7554] mt-0.5">
                            Showing {filteredLogs.length} events (Total: {pagination.total})
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-[#6B5336]" />
                        <input
                            type="text"
                            placeholder="Filter by action name..."
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#E1DCC9] text-[#1F150C] focus:bg-white focus:outline-none focus:border-[#412D15]"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-12 text-center space-y-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#412D15] mx-auto" />
                            <p className="text-xs text-[#8F7554] font-semibold">Loading security audit records...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-12 text-center text-[#8F7554] space-y-2">
                            <History className="h-10 w-10 mx-auto text-[#C9BF9F]" />
                            <p className="text-sm font-bold text-[#1F150C]">No audit records found</p>
                            <p className="text-xs text-[#8F7554]">System actions will appear here automatically when security events occur.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#FAF7F2] border-b border-[#E1DCC9] text-[#6B5336] font-bold uppercase tracking-wider text-[10px]">
                                        <th className="py-3.5 px-6">Timestamp</th>
                                        <th className="py-3.5 px-6">Action / Event</th>
                                        <th className="py-3.5 px-6">Actor Identity</th>
                                        <th className="py-3.5 px-6">Client IP</th>
                                        <th className="py-3.5 px-6 text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E1DCC9]/60 text-[#1F150C]">
                                    {filteredLogs.map((log) => {
                                        const isExpanded = expandedLogId === log._id;
                                        return (
                                            <React.Fragment key={log._id}>
                                                <tr className="hover:bg-[#FAF7F2]/60 transition-colors">
                                                    <td className="py-3.5 px-6 font-mono text-[11px] text-[#6B5336] whitespace-nowrap">
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-6">
                                                        <Badge variant={getActionBadgeVariant(log.action)} className="font-mono text-[9.5px]">
                                                            {log.action}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3.5 px-6">
                                                        {log.user ? (
                                                            <div>
                                                                <p className="font-bold text-[#1F150C]">{log.user.name}</p>
                                                                <p className="text-[10px] text-[#8F7554]">{log.user.email} ({log.user.role})</p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[#8F7554] italic">System Worker</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-6 font-mono text-[11px] text-[#8F7554]">
                                                        {log.ipAddress || '127.0.0.1'}
                                                    </td>
                                                    <td className="py-3.5 px-6 text-right">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => setExpandedLogId(isExpanded ? null : log._id)}
                                                            className="text-[10.5px] font-bold py-1 px-2.5"
                                                        >
                                                            {isExpanded ? 'Hide Payload' : 'Inspect Details'}
                                                        </Button>
                                                    </td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr className="bg-[#140D07] text-[#E1DCC9]">
                                                        <td colSpan={5} className="p-4 px-6 font-mono text-[11px]">
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#C9BF9F]">
                                                                    User Agent & Detailed Metadata
                                                                </p>
                                                                <p className="text-[#E1DCC9]/80 text-[10px] truncate">
                                                                    Agent: {log.userAgent || 'Internal API Client'}
                                                                </p>
                                                                <pre className="p-3 bg-black/60 border border-[#412D15] rounded-xl overflow-x-auto text-[10.5px] leading-relaxed text-emerald-400">
                                                                    {JSON.stringify(log.details || {}, null, 2)}
                                                                </pre>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>

                {/* Pagination Footer */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-[#E1DCC9]/70 flex items-center justify-between text-xs font-semibold text-[#6B5336]">
                        <span>
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                disabled={pagination.page <= 1}
                                onClick={() => fetchLogs(pagination.page - 1)}
                                className="font-bold text-xs"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" /> Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => fetchLogs(pagination.page + 1)}
                                className="font-bold text-xs"
                            >
                                Next <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminAuditLogs;
