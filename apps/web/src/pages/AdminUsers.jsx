import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Input } from '../components/ui/Input.jsx';
import {
    Users, Search, Shield, ChevronLeft, ChevronRight,
    UserCheck, AlertCircle, CheckCircle2, Filter, ShieldAlert, X
} from 'lucide-react';

const ROLES = [
    { value: '', label: 'All Roles' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'FACULTY', label: 'Faculty' },
    { value: 'PLACEMENT_OFFICER', label: 'Placement Officer' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' }
];

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Modal state for changing role
    const [selectedUser, setSelectedUser] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            params.set('page', page);
            params.set('limit', pagination.limit);
            if (searchTerm.trim()) params.set('search', searchTerm.trim());
            if (roleFilter) params.set('role', roleFilter);

            const res = await apiClient.get(`/admin/users?${params.toString()}`);
            setUsers(res.data.data?.users || []);
            if (res.data.data?.pagination) {
                setPagination(res.data.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.error?.message || err.message || 'Failed to load user accounts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [roleFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchUsers(1);
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser || !targetRole || targetRole === selectedUser.role) return;
        setUpdating(true);
        setError(null);
        try {
            await apiClient.put(`/admin/users/${selectedUser._id}/role`, { role: targetRole });
            setSuccessMsg(`Role for ${selectedUser.name} updated to ${targetRole}.`);
            setSelectedUser(null);
            fetchUsers(pagination.page);
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to update user role.');
        } finally {
            setUpdating(false);
        }
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'SUPER_ADMIN':
            case 'ADMIN':
                return 'danger';
            case 'PLACEMENT_OFFICER':
                return 'warning';
            case 'FACULTY':
                return 'primary';
            case 'STUDENT':
            default:
                return 'neutral';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in font-sans text-[#1F150C]">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F150C] via-[#31210F] to-[#412D15] p-6 sm:p-8 text-white border border-[#412D15] shadow-xl">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1DCC9]/15 border border-[#E1DCC9]/30 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E1DCC9]">
                        <Shield className="h-3.5 w-3.5 text-[#E1DCC9]" />
                        <span>Security & Access Governance</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2.5">
                        <Users className="h-7 w-7 text-[#E1DCC9]" />
                        <span>Platform User Management</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-[#E1DCC9]/85 max-w-2xl font-normal leading-relaxed">
                        Audit authenticated identities, inspect department affiliations, and reassign system permissions with strict audit logging.
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

            {/* Search & Filter Toolbar */}
            <Card className="border border-[#E1DCC9] shadow-sm bg-white">
                <CardContent className="p-4 sm:p-5">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="flex-1 relative">
                            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F7554]" />
                            <input
                                type="text"
                                placeholder="Search users by name or email address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E1DCC9] text-[#1F150C] focus:bg-white focus:border-[#412D15] focus:outline-none transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E1DCC9] px-3 py-1.5 rounded-xl text-xs font-semibold">
                                <Filter className="h-3.5 w-3.5 text-[#6B5336]" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="bg-transparent border-none text-xs font-bold text-[#1F150C] focus:outline-none cursor-pointer"
                                >
                                    {ROLES.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button type="submit" variant="primary" className="text-xs font-bold px-4 py-2">
                                Search
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border border-[#E1DCC9] shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-[#E1DCC9]/70 px-6 py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold text-[#1F150C]">Registered Accounts</CardTitle>
                        <p className="text-[11px] text-[#8F7554] mt-0.5">
                            Showing {users.length} of {pagination.total} accounts
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center space-y-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#412D15] mx-auto" />
                            <p className="text-xs text-[#8F7554] font-semibold">Loading platform users...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center text-[#8F7554] space-y-2">
                            <Users className="h-10 w-10 mx-auto text-[#C9BF9F]" />
                            <p className="text-sm font-bold text-[#1F150C]">No users found</p>
                            <p className="text-xs text-[#8F7554]">Try refining your search keyword or selected role filter.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#FAF7F2] border-b border-[#E1DCC9] text-[#6B5336] font-bold uppercase tracking-wider text-[10px]">
                                        <th className="py-3.5 px-6">User Account</th>
                                        <th className="py-3.5 px-6">System Role</th>
                                        <th className="py-3.5 px-6">Status</th>
                                        <th className="py-3.5 px-6">Created On</th>
                                        <th className="py-3.5 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E1DCC9]/60 text-[#1F150C]">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#1F150C] to-[#412D15] text-[#E1DCC9] font-black text-xs flex items-center justify-center shrink-0">
                                                        {u.name ? u.name.slice(0, 2).toUpperCase() : 'U'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-[#1F150C] truncate">{u.name}</p>
                                                        <p className="text-[10.5px] text-[#8F7554] truncate">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <Badge variant={getRoleBadgeVariant(u.role)} className="text-[9.5px]">
                                                    {u.role?.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="py-3.5 px-6">
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    {u.status || 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-[#6B5336] font-medium text-[11px]">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setTargetRole(u.role);
                                                    }}
                                                    className="font-bold text-[11px] py-1 px-3"
                                                >
                                                    Change Role
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
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
                                onClick={() => fetchUsers(pagination.page - 1)}
                                className="font-bold text-xs"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" /> Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                disabled={pagination.page >= pagination.totalPages}
                                onClick={() => fetchUsers(pagination.page + 1)}
                                className="font-bold text-xs"
                            >
                                Next <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Role Update Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-md bg-white border border-[#E1DCC9] shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-[#FAF7F2] border-b border-[#E1DCC9] p-5 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-[#412D15]" />
                                <CardTitle className="text-sm font-bold text-[#1F150C]">Modify Access Permissions</CardTitle>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-1 hover:bg-[#F4EFE6] rounded-lg text-[#6B5336] transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </CardHeader>

                        <CardContent className="p-6 space-y-4">
                            <div>
                                <p className="text-xs text-[#8F7554]">Target Account:</p>
                                <p className="font-extrabold text-[#1F150C] text-sm mt-0.5">{selectedUser.name}</p>
                                <p className="text-xs text-[#6B5336]">{selectedUser.email}</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5336]">
                                    Assign New Role
                                </label>
                                <select
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-[#E1DCC9] bg-[#FAF7F2] text-xs font-bold text-[#1F150C] focus:outline-none focus:border-[#412D15]"
                                >
                                    <option value="STUDENT">STUDENT (Access to courseware, jobs & student AI)</option>
                                    <option value="FACULTY">FACULTY (Access to classes, roster & grading)</option>
                                    <option value="PLACEMENT_OFFICER">PLACEMENT_OFFICER (Access to drives, candidates & recruiter tools)</option>
                                    <option value="ADMIN">ADMIN (Access to platform governance & users)</option>
                                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full system access)</option>
                                </select>
                            </div>

                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                                <strong>Security Notice:</strong> Changing a user's role alters their authorization token on next sign-in and generates an immutable security audit entry.
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2">
                                <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    isLoading={updating}
                                    disabled={targetRole === selectedUser.role}
                                    onClick={handleRoleUpdate}
                                    className="font-bold"
                                >
                                    Confirm Role Update
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
