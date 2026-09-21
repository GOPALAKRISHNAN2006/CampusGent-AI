import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, Filter, X, Users, Mail, GraduationCap, Award, Phone } from 'lucide-react';

export const FacultyStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'NONE'>('ALL');
  
  // Selected Student Drawer State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  useEffect(() => {
    const fetchStudentsDirectory = async () => {
      try {
        setLoading(true);
        // We fetch from classes to extract all unique students
        const res = await apiClient.get('/faculty/classes');
        const uniqueStudentsMap = new Map<string, any>();
        
        (res.data.data || []).forEach((c: any) => {
          (c.students || []).forEach((s: any) => {
            if (!uniqueStudentsMap.has(s._id)) {
              // Add mock details for rendering compatibility
              uniqueStudentsMap.set(s._id, {
                ...s,
                className: `${c.courseCode} - ${c.section}`,
                subjectName: c.subjectName
              });
            }
          });
        });

        setStudents(Array.from(uniqueStudentsMap.values()));
      } catch (err: any) {
        setError('Failed to load students roster.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentsDirectory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-44 bg-brand-100 rounded"></div>
        <div className="h-12 bg-brand-100 rounded-lg"></div>
      </div>
    );
  }

  // Risk calculation helper
  const getRiskLabel = (cgpa: number) => {
    if (cgpa < 5.5) return 'HIGH';
    if (cgpa < 6.5) return 'MEDIUM';
    return 'NONE';
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      (s.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const risk = getRiskLabel(s.cgpa);
    const matchesRisk = riskFilter === 'ALL' || risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in relative">
      <div>
        <h1 className="text-xl font-bold text-brand-900">Student Directory</h1>
        <p className="text-xs text-brand-500 mt-1">Search student roster details, analyze GPA averages, and view profiles.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="NONE">No Risk</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase">
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Roll Number</th>
                <th className="px-6 py-3">Enrolled Class</th>
                <th className="px-6 py-3">CGPA</th>
                <th className="px-6 py-3">Risk Level</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-brand-450">
                    No matching students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const risk = getRiskLabel(s.cgpa);
                  return (
                    <tr key={s._id} className="hover:bg-brand-50/50">
                      <td className="px-6 py-4 font-semibold text-brand-900">{s.user?.name || 'Mentee'}</td>
                      <td className="px-6 py-4">{s.rollNumber}</td>
                      <td className="px-6 py-4">{s.className} ({s.subjectName})</td>
                      <td className="px-6 py-4 font-bold">{s.cgpa}/10</td>
                      <td className="px-6 py-4">
                        <Badge variant={risk === 'HIGH' ? 'danger' : risk === 'MEDIUM' ? 'warning' : 'success'}>
                          {risk}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          onClick={() => setSelectedStudent(s)} 
                          size="sm" 
                          variant="secondary"
                          className="text-[10px] font-semibold border-brand-200 text-brand-700 hover:bg-brand-50"
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Selected Student Slide-Over Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-brand-950/40 transition-opacity" 
            onClick={() => setSelectedStudent(null)}
          />
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b border-brand-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-indigo-650" />
                <span>Student Details Profile</span>
              </h3>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="p-1 hover:bg-brand-50 rounded-full text-brand-450"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Profile Card */}
              <div className="flex items-center gap-4 bg-brand-50/50 p-4 border border-brand-100 rounded-xl">
                <div className="h-12 w-12 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-black text-sm">
                  {selectedStudent.user?.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-900 text-sm">{selectedStudent.user?.name}</h4>
                  <p className="text-brand-450 text-[10px] mt-0.5">Roll No: {selectedStudent.rollNumber}</p>
                </div>
              </div>

              {/* Academic Overview */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-100 pb-1">
                  Academic overview
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-brand-100 rounded-xl">
                    <span className="text-[9px] font-bold text-brand-450 uppercase">Cumulative GPA</span>
                    <p className="text-base font-extrabold text-brand-900 mt-0.5">{selectedStudent.cgpa}/10</p>
                  </div>
                  <div className="p-3 border border-brand-100 rounded-xl">
                    <span className="text-[9px] font-bold text-brand-450 uppercase">Attendance Average</span>
                    <p className="text-base font-extrabold text-brand-900 mt-0.5">{selectedStudent.placementReadinessScore || 70}%</p>
                  </div>
                </div>
              </div>

              {/* Career Goal & details */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-100 pb-1">
                  Career goals & details
                </h5>
                <div className="p-4 border border-brand-100 rounded-xl bg-brand-50/20 text-brand-700 leading-relaxed space-y-1">
                  <p className="font-bold text-brand-950">Target role: {selectedStudent.careerInterests?.[0] || 'Software Engineer'}</p>
                  <p className="text-brand-500 text-[10px]">
                    Goal details: {selectedStudent.careerGoals?.[0] || 'Looking to work on full-stack web architectures.'}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-100 pb-1">
                  Contact details
                </h5>
                <div className="space-y-2 text-[10.5px]">
                  <div className="flex items-center gap-2 text-brand-650">
                    <Mail className="h-4 w-4 text-brand-400" />
                    <span>{selectedStudent.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-650">
                    <Phone className="h-4 w-4 text-brand-400" />
                    <span>+91 98765 43210</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-brand-100 flex gap-2">
              <Button 
                onClick={() => setSelectedStudent(null)} 
                variant="secondary" 
                className="flex-1 text-[10px] border-brand-200 text-brand-700 font-bold"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default FacultyStudents;
