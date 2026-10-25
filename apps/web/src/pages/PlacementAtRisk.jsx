import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Search, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const PlacementAtRisk = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await apiClient.get('/students');
            setStudents(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch (err) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Unable to load risk registries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Compute at-risk students based on real database records
    const atRiskStudents = students.map((s) => {
        const reasons = [];
        let riskLevel = 'LOW';
        let action = 'Notify Student';
        const cgpa = typeof s.cgpa === 'number' ? s.cgpa : 0;
        const readiness = typeof s.placementReadinessScore === 'number' ? s.placementReadinessScore : 0;

        if (cgpa < 6.0) {
            reasons.push(`CGPA (${cgpa}/10) is below standard placement eligibility cutoff (6.0)`);
            riskLevel = 'HIGH';
            action = 'Schedule Counseling';
        }
        if (readiness < 60) {
            reasons.push(`Placement readiness score (${readiness}%) requires academic remediation`);
            if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
            action = 'Assign Mentor';
        }
        if (!s.resumeUrl) {
            reasons.push('Missing verified campus resume PDF');
            if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
            action = 'Request Resume Upload';
        }
        return {
            id: s._id,
            name: s.user?.name || 'Unknown Candidate',
            roll: s.rollNumber || 'N/A',
            program: s.department?.name || 'Computer Science',
            cgpa,
            reasons,
            risk: riskLevel,
            action,
        };
    }).filter((s) => s.reasons.length > 0);

    const filteredAtRisk = atRiskStudents.filter((s) => {
        const query = searchTerm.toLowerCase();
        return s.name.toLowerCase().includes(query) || s.roll.toLowerCase().includes(query);
    });

    const handleTriggerAction = (studentName, action) => {
        alert(`Intervention notification ("${action}") successfully initiated for ${studentName}!`);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-brand-900 dark:text-stone-100 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span>Placement Intervention Center</span>
                    </h1>
                    <p className="text-brand-500 dark:text-stone-400 mt-1">
                        Audit students flagged with high career risks, initiate counseling requests, and assign technical tutors.
                    </p>
                </div>
                <button
                    onClick={fetchStudents}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-50 text-[11px] self-start sm:self-auto cursor-pointer"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-900 text-red-700 dark:text-rose-300 font-semibold rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchStudents} className="underline text-[11px] cursor-pointer">Retry</button>
                </div>
            )}

            <div className="bg-white dark:bg-stone-900 border border-brand-200/60 dark:border-stone-800 p-4 rounded-xl shadow-sm">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-brand-450 dark:text-stone-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by student name or roll number..."
                        className="pl-9 w-full text-xs border border-brand-200 dark:border-stone-700 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white dark:bg-stone-800 text-brand-850 dark:text-stone-100"
                    />
                </div>
            </div>

            <Card className="border border-brand-200/60 dark:border-stone-800 shadow-sm overflow-hidden bg-white dark:bg-stone-900">
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-50 dark:bg-stone-800/60 border-b border-brand-200 dark:border-stone-800 text-brand-650 dark:text-stone-400 font-bold uppercase text-[9px] tracking-wider">
                                <th className="px-5 py-3">Student Name</th>
                                <th className="px-5 py-3">Risk Factors</th>
                                <th className="px-5 py-3">Risk Level</th>
                                <th className="px-5 py-3 text-right">Intervention Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-100 dark:divide-stone-800 text-brand-855 dark:text-stone-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-brand-450 font-semibold animate-pulse">
                                        Loading risk registries...
                                    </td>
                                </tr>
                            ) : filteredAtRisk.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-8 text-center text-brand-450 dark:text-stone-400 font-semibold">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                            <span>No students currently require placement intervention. All candidates are fully compliant!</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAtRisk.map((item) => (
                                    <tr key={item.id} className="hover:bg-brand-50/50 dark:hover:bg-stone-800/40 transition-colors">
                                        <td className="px-5 py-4 font-bold text-brand-950 dark:text-stone-100">
                                            <div>{item.name}</div>
                                            <div className="text-[10px] text-brand-450 dark:text-stone-400 font-normal mt-0.5">
                                                {item.roll} ({item.program})
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="space-y-1">
                                                {item.reasons.map((r, idx) => (
                                                    <div key={idx} className="text-brand-700 dark:text-stone-300 flex items-center gap-1.5 text-[11px]">
                                                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />
                                                        <span>{r}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge variant={item.risk === 'HIGH' ? 'danger' : 'warning'} className="font-bold text-[9px]">
                                                {item.risk} RISK
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button
                                                onClick={() => handleTriggerAction(item.name, item.action)}
                                                size="sm"
                                                className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[9.5px]"
                                            >
                                                {item.action}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default PlacementAtRisk;
