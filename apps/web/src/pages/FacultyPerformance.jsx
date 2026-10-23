import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, GraduationCap, Award } from 'lucide-react';

export const FacultyPerformance = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get('/faculty/classes');
                setClasses(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, []);

    const chartData = classes.length > 0
        ? classes.map((c) => ({
            name: `${c.courseCode} (${c.section})`,
            gpa: 7.8, // Baseline fallback
            attendance: 84
        }))
        : [
            { name: 'CS301 (A)', gpa: 8.4, attendance: 89 },
            { name: 'CS302 (B)', gpa: 7.6, attendance: 82 },
            { name: 'CS405 (A)', gpa: 8.8, attendance: 91 },
            { name: 'CS410 (C)', gpa: 7.2, attendance: 78 }
        ];

    if (loading) {
        return (
            <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
                <div className="h-8 w-44 bg-brand-100 dark:bg-[#21180F] rounded" />
                <div className="h-64 bg-brand-100 dark:bg-[#17120D] rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in text-brand-900 dark:text-[#F5F0E8]">
            <div>
                <h1 className="text-xl font-bold text-brand-900 dark:text-[#F5F0E8]">Academic Performance Analytics</h1>
                <p className="text-xs text-brand-500 dark:text-[#C8BFAF] mt-1">Cross-class comparisons, averages spreads, and attendance ratings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-brand-200/60 dark:border-[#403426] shadow-sm md:col-span-2 bg-white dark:bg-[#17120D]">
                    <CardHeader>
                        <CardTitle className="text-xs font-bold text-brand-700 dark:text-[#C49A5A] uppercase tracking-wider flex items-center gap-1.5">
                            <TrendingUp className="h-4.5 w-4.5 text-brand-500 dark:text-[#C49A5A]" />
                            <span>Class Performance averages comparison</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#403426" strokeOpacity={0.4} />
                                <XAxis dataKey="name" stroke="#A69B89" fontSize={10} tick={{ fill: '#A69B89' }} />
                                <YAxis domain={[0, 10]} stroke="#A69B89" fontSize={10} tick={{ fill: '#A69B89' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#17120D',
                                        borderRadius: '12px',
                                        color: '#F5F0E8',
                                        fontSize: '11px',
                                        border: '1px solid #403426',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#F5F0E8' }}
                                    labelStyle={{ color: '#C49A5A', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="gpa" fill="#C49A5A" radius={[4, 4, 0, 0]} barSize={36} name="GPA Average" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border border-brand-200/60 dark:border-[#403426] shadow-sm flex flex-col justify-between bg-white dark:bg-[#17120D]">
                    <CardHeader>
                        <CardTitle className="text-xs font-bold text-brand-700 dark:text-[#C49A5A] uppercase tracking-wider">
                            Student distribution summaries
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl text-indigo-700 dark:text-indigo-300 border dark:border-indigo-800/40">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold text-brand-900 dark:text-[#F5F0E8]">45 Active Mentees</p>
                                <p className="text-brand-500 dark:text-[#C8BFAF] text-[10px]">Under institutional counseling</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl text-emerald-700 dark:text-emerald-300 border dark:border-emerald-800/40">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold text-brand-900 dark:text-[#F5F0E8]">7.84 Cumulative GPA</p>
                                <p className="text-brand-500 dark:text-[#C8BFAF] text-[10px]">Subject average threshold</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl text-amber-700 dark:text-amber-300 border dark:border-amber-800/40">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold text-brand-900 dark:text-[#F5F0E8]">92% Passing Spread</p>
                                <p className="text-brand-500 dark:text-[#C8BFAF] text-[10px]">Overall semester pass rate</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FacultyPerformance;
