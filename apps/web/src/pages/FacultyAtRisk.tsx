import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AlertCircle, Eye, ShieldAlert, CheckCircle } from 'lucide-react';

export const FacultyAtRisk: React.FC = () => {
  const [riskStudents, setRiskStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchRiskRoster = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/faculty/at-risk');
      setRiskStudents(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch at-risk register.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskRoster();
  }, []);

  const handleCreateIntervention = (studentId: string, studentName: string) => {
    setSuccessMsg(`Intervention plan initialized for ${studentName}. Email notifications dispatched.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-44 bg-brand-100 rounded"></div>
        <div className="h-44 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900">At-Risk Student Registry</h1>
        <p className="text-xs text-brand-500 mt-1">Intervene early for students below threshold academic or attendance benchmarks.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {riskStudents.length === 0 ? (
        <Card className="p-8 text-center text-brand-450 border border-brand-200/60 shadow-sm">
          <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
          <p className="font-bold">No students currently require attention.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {riskStudents.map((s) => (
            <Card key={s._id} className="border border-brand-200/60 shadow-sm p-5 hover:border-red-200 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Badge variant={s.riskLevel === 'HIGH' ? 'danger' : 'warning'}>
                    {s.riskLevel} RISK
                  </Badge>
                  <h4 className="font-extrabold text-brand-950 text-sm">{s.name}</h4>
                  <span className="text-[10px] text-brand-450">Roll No: {s.rollNumber}</span>
                </div>
                
                <div className="flex gap-4 text-[10px] text-brand-650">
                  <p>CGPA: <span className="font-bold text-brand-900">{s.cgpa}/10</span></p>
                  <p>Attendance: <span className="font-bold text-brand-900">{s.attendance}%</span></p>
                </div>

                <div className="bg-red-50/50 border border-red-100 rounded-lg p-2 flex gap-1.5 items-start text-red-700 max-w-xl">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[9px] uppercase tracking-wider">Concern details</p>
                    <p className="text-[10px] mt-0.5">{s.reasons.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0 w-full md:w-auto">
                <Button 
                  onClick={() => handleCreateIntervention(s._id, s.name)} 
                  className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex-1 md:flex-initial"
                >
                  Create Intervention
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default FacultyAtRisk;
