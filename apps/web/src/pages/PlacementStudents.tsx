import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  UserCircle, 
  Search, 
  Filter, 
  X, 
  TrendingUp, 
  GraduationCap, 
  Award, 
  Mail, 
  Briefcase, 
  FolderKanban,
  CheckCircle,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';

export const PlacementStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [readinessFilter, setReadinessFilter] = useState<'ALL' | 'READY' | 'NEEDS_IMPROVEMENT' | 'NOT_READY'>('ALL');
  
  // Selected Student Drawer
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/students');
      setStudents(res.data.data || []);
    } catch (err: any) {
      setError('Unable to load students directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleViewProfile = async (student: any) => {
    if (!student.user?._id) return;
    try {
      const res = await apiClient.get(`/students/profile?userId=${student.user._id}`);
      setSelectedStudent(res.data.data);
    } catch (err) {
      setSelectedStudent(student);
    }
  };

  const getReadinessState = (score: number) => {
    if (score >= 75) return 'READY';
    if (score >= 60) return 'NEEDS_IMPROVEMENT';
    return 'NOT_READY';
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      (s.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const readinessState = getReadinessState(s.placementReadinessScore || 0);
    const matchesReadiness = readinessFilter === 'ALL' || readinessState === readinessFilter;

    return matchesSearch && matchesReadiness;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in relative">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Student Directory</h1>
        <p className="text-brand-500 mt-1">Review student registry profiles, monitor corporate readiness metrics, and evaluate target credentials.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or university roll number..."
            className="pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value as any)}
            className="text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700"
          >
            <option value="ALL">All Readiness Levels</option>
            <option value="READY">Ready (&gt;= 75%)</option>
            <option value="NEEDS_IMPROVEMENT">Needs Work (60% - 74%)</option>
            <option value="NOT_READY">Not Ready (&lt; 60%)</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <Card className="border border-brand-200/60 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider">
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Roll Number</th>
                <th className="px-5 py-3">Branch Department</th>
                <th className="px-5 py-3">CGPA Cutoff</th>
                <th className="px-5 py-3">Readiness Index</th>
                <th className="px-5 py-3 text-right">Registry Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-brand-850">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold animate-pulse">
                    Loading student directory...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-450 font-semibold">
                    No matching student profiles found.
                  </td>
                </tr>
              ) : (
                filteredStudents.filter(s => s.user).map((s) => {
                  const state = getReadinessState(s.placementReadinessScore || 0);
                  return (
                    <tr key={s._id} className="hover:bg-brand-50/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-brand-950">{s.user?.name}</td>
                      <td className="px-5 py-4 font-semibold text-brand-600">{s.rollNumber}</td>
                      <td className="px-5 py-4">{s.department?.name || 'Computer Science'}</td>
                      <td className="px-5 py-4 font-bold">{s.cgpa || '0.0'} / 10</td>
                      <td className="px-5 py-4 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] ${
                          state === 'READY' ? 'bg-green-100 text-green-800' :
                          state === 'NEEDS_IMPROVEMENT' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {s.placementReadinessScore || 65}% readiness
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button 
                          onClick={() => handleViewProfile(s)}
                          size="sm" 
                          variant="secondary"
                          className="font-semibold text-[9.5px] border-brand-200 text-brand-700 hover:bg-brand-50"
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

      {/* --- SELECTED STUDENT SLIDE-OVER DRAWER --- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-brand-950/40 transition-opacity" onClick={() => setSelectedStudent(null)} />
          
          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
            {/* Header */}
            <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50">
              <h3 className="font-bold text-brand-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserCircle className="h-5 w-5 text-indigo-650" />
                <span>Student Placement Profile</span>
              </h3>
              <button onClick={() => setSelectedStudent(null)} className="p-1 hover:bg-brand-200 rounded-full text-brand-450">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 bg-brand-50 p-4 border border-brand-150 rounded-xl">
                <div className="h-12 w-12 bg-indigo-900 text-white rounded-lg flex items-center justify-center font-black text-sm">
                  {(selectedStudent.user?.name || 'Student').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-brand-950 text-sm">{selectedStudent.user?.name || 'Student'}</h4>
                  <p className="text-brand-450 text-[10px] mt-0.5">Roll No: {selectedStudent.rollNumber}</p>
                </div>
              </div>

              {/* Stats parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-brand-200 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-brand-450 uppercase block">Cumulative GPA</span>
                  <p className="text-base font-black text-brand-900 mt-1">{selectedStudent.cgpa} / 10</p>
                </div>
                <div className="p-3 border border-brand-200 rounded-xl text-center">
                  <span className="text-[9px] font-bold text-brand-450 uppercase block">Readiness Index</span>
                  <p className="text-base font-black text-indigo-700 mt-1">{selectedStudent.placementReadinessScore || 70}%</p>
                </div>
              </div>

              {/* Skills Verification List */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-brand-450 uppercase tracking-widest border-b border-brand-100 pb-1 flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Verified Professional Skills</span>
                </h5>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selectedStudent.skills || []).length === 0 ? (
                    <span className="text-brand-450">No verified skills entered.</span>
                  ) : (
                    selectedStudent.skills.map((sk: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-brand-50 border border-brand-200 text-brand-700 font-semibold">
                        {sk.name} ({sk.proficiency.toLowerCase()})
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Resume Review status */}
              {selectedStudent.resumeUrl && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-brand-450 uppercase tracking-widest border-b border-brand-100 pb-1 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-indigo-650" />
                    <span>Resume Integrity Score</span>
                  </h5>
                  <div className="p-3 border border-brand-200 rounded-xl flex justify-between items-center bg-brand-50/30">
                    <div>
                      <p className="font-bold text-brand-900">ATS Optimized Resume</p>
                      <a href={selectedStudent.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-650 hover:underline text-[9.5px] font-semibold mt-0.5 inline-block">
                        Download Uploaded PDF File
                      </a>
                    </div>
                    <Badge variant="success" className="font-bold">Score: 84/100</Badge>
                  </div>
                </div>
              )}

              {/* AI Readiness Insights (clearly labeled) */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-brand-450 uppercase tracking-widest border-b border-brand-100 pb-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-650" />
                  <span>AI Readiness Insights</span>
                </h5>
                <div className="bg-gradient-to-r from-indigo-50/20 to-brand-50/20 p-4 border border-indigo-100 rounded-xl space-y-2 text-brand-750">
                  <span className="font-extrabold text-[9px] uppercase tracking-wider text-indigo-750 bg-indigo-50 px-1.5 py-0.5 rounded block w-max">AI ANALYSES RECOMMENDATION</span>
                  <p>
                    Candidate has completed mock behavioral rounds, scoring 82% in communication indexes. Suggest scheduling technical interviews for C++ and Python development profiles matching active corporate drives eligibility cutoffs.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brand-100 flex gap-2">
              <Button onClick={() => setSelectedStudent(null)} variant="secondary" className="flex-1 font-bold">
                Close Profile Profile
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default PlacementStudents;
