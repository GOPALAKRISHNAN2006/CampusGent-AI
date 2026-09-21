import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  TrendingUp, 
  Award, 
  FileText, 
  Video, 
  Info
} from 'lucide-react';

export const PlacementReadiness: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchReadiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/students');
        setStudents(res.data.data || []);
      } catch (err: any) {
        setError('Failed to compute readiness statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchReadiness();
  }, []);

  const totalStudents = students.length;
  const avgReadiness = totalStudents > 0 
    ? Math.round(students.reduce((acc, s) => acc + (s.placementReadinessScore || 0), 0) / totalStudents)
    : 0;

  const avgCgpa = totalStudents > 0 
    ? (students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / totalStudents).toFixed(2)
    : '0.00';

  const resumeUploadRate = totalStudents > 0
    ? Math.round((students.filter(s => s.resumeUrl).length / totalStudents) * 100)
    : 0;

  const skillsUploadRate = totalStudents > 0
    ? Math.round((students.filter(s => s.skills && s.skills.length > 0).length / totalStudents) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Student Readiness Overview</h1>
        <p className="text-brand-500 mt-1">Review aggregated readiness scores, analyze resume compliance, and identify skills preparation priorities.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Primary indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border border-brand-200/60 shadow-sm p-4 space-y-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Resume Completeness</span>
              <p className="text-xl font-black text-brand-900">{resumeUploadRate}%</p>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-700">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-2 border-t border-brand-100 pt-3 text-brand-650 font-semibold">
            <div className="flex justify-between items-center text-[10.5px]">
              <span>Candidates with Resumes</span>
              <span className="font-bold text-green-700">{students.filter(s => s.resumeUrl).length} / {totalStudents}</span>
            </div>
            <div className="flex justify-between items-center text-[10.5px]">
              <span>Average Cohort CGPA</span>
              <span className="font-bold text-indigo-700">{avgCgpa} / 10</span>
            </div>
          </div>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm p-4 space-y-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Verified Skills Base</span>
              <p className="text-xl font-black text-brand-900">{skillsUploadRate}%</p>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-700">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-2 border-t border-brand-100 pt-3 text-brand-650 font-semibold">
            <div className="flex justify-between items-center text-[10.5px]">
              <span>Profiles with Skills</span>
              <span className="font-bold text-brand-700">{students.filter(s => s.skills && s.skills.length > 0).length} students</span>
            </div>
            <div className="flex justify-between items-center text-[10.5px]">
              <span>Average Skills Count</span>
              <span className="font-bold text-indigo-700">
                {totalStudents > 0 ? (students.reduce((acc, s) => acc + (s.skills?.length || 0), 0) / totalStudents).toFixed(1) : 0} skills
              </span>
            </div>
          </div>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm p-4 space-y-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-brand-500 uppercase font-extrabold tracking-wider block">Overall Placement Readiness</span>
              <p className="text-xl font-black text-brand-900">{avgReadiness}%</p>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl text-amber-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-2 border-t border-brand-100 pt-3 text-brand-650 font-semibold">
            <div className="flex justify-between items-center text-[10.5px]">
              <span>Ready Candidates (&gt;= 75)</span>
              <span className="font-bold text-green-700">{students.filter(s => s.placementReadinessScore >= 75).length} students</span>
            </div>
            <div className="flex justify-between items-center text-[10.5px]">
              <span>Critical Risk Candidates (&lt; 60)</span>
              <span className="font-bold text-red-700">{students.filter(s => (s.placementReadinessScore || 0) < 60).length} students</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Cohort breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-brand-200/60 shadow-sm md:col-span-2 bg-white">
          <CardHeader className="border-b border-brand-100">
            <CardTitle className="text-brand-900 font-bold">Explainable Score Calculation</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 leading-relaxed text-brand-750">
            <div className="flex gap-3 items-start border-l-2 border-indigo-200 pl-4 py-1">
              <div className="space-y-1">
                <span className="font-bold text-brand-900 block">How is the Readiness score calculated?</span>
                <p>
                  Readiness scores represent weighted composites evaluated daily: Resume Completeness (25%), Aptitude assessments pass rates (25%), Verified code skills metrics (25%), and Mock interview evaluation reports (25%).
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start border-l-2 border-indigo-200 pl-4 py-1">
              <div className="space-y-1">
                <span className="font-bold text-brand-900 block">Cutoff Eligibility Verification</span>
                <p>
                  Drives cutoffs check candidate registries in real-time. Students below the cutoff score boundaries (e.g. min 7.0 CGPA and &gt;= 75% readiness) are flagged for intervention counseling.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-brand-200/60 shadow-sm md:col-span-1 bg-white">
          <CardHeader className="border-b border-brand-100">
            <CardTitle className="text-brand-900 font-bold">Branch Metrics Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 font-semibold text-brand-700">
            <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
              <span>Total Registry Volume</span>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-150 font-bold text-[9px]">
                {totalStudents} students
              </Badge>
            </div>
            <div className="flex justify-between items-center bg-brand-50 p-2.5 rounded-lg border border-brand-100">
              <span>Verified Skillsets Profiles</span>
              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-150 font-bold text-[9px]">
                {students.filter(s => s.skills?.length > 0).length} students
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
export default PlacementReadiness;
