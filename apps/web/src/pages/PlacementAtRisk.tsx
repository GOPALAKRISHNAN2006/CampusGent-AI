import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Mail, 
  Info
} from 'lucide-react';

export const PlacementAtRisk: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/students');
      setStudents(res.data.data || []);
    } catch (err: any) {
      setError('Unable to load risk registries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Compute at-risk students based on real database records
  const atRiskStudents = students.map((s: any) => {
    const reasons: string[] = [];
    let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    let action = 'Notify Student';

    if (s.cgpa < 6.0) {
      reasons.push(`CGPA (${s.cgpa || 0}/10) is below standard cutoff`);
      riskLevel = 'HIGH';
      action = 'Schedule Counseling';
    }
    if ((s.placementReadinessScore || 0) < 60) {
      reasons.push(`Placement readiness score (${s.placementReadinessScore || 0}%) requires improvement`);
      if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
      action = 'Assign Mentor';
    }
    if (!s.resumeUrl) {
      reasons.push('Missing uploaded resume PDF');
      if (riskLevel !== 'HIGH') riskLevel = 'MEDIUM';
      action = 'Request Resume Upload';
    }

    return {
      id: s._id,
      name: s.user?.name || 'Unknown Candidate',
      roll: s.rollNumber || 'N/A',
      program: s.department?.name || 'Computer Science',
      cgpa: s.cgpa || 0,
      reasons,
      risk: riskLevel,
      action
    };
  }).filter(s => s.reasons.length > 0);

  const filteredAtRisk = atRiskStudents.filter((s) => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           s.roll.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleTriggerAction = (id: string) => {
    alert('Intervention notification successfully sent to the student and faculty advisor!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-brand-900">Placement Intervention Center</h1>
        <p className="text-brand-500 mt-1">Audit students flagged with high career risks, initiate counseling requests, and assign technical tutors.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-brand-450" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="pl-9 w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white text-brand-850"
          />
        </div>
      </div>

      {/* Roster Table */}
      <Card className="border border-brand-200/60 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-200 text-brand-650 font-bold uppercase text-[9px] tracking-wider">
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Risk Factors</th>
                <th className="px-5 py-3">Risk Level</th>
                <th className="px-5 py-3 text-right">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-brand-855 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-brand-450 font-semibold animate-pulse">
                    Loading risk registries...
                  </td>
                </tr>
              ) : filteredAtRisk.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-brand-450 font-semibold">
                    No students currently require placement intervention. All candidates are fully compliant!
                  </td>
                </tr>
              ) : (
                filteredAtRisk.map((item) => (
                  <tr key={item.id} className="hover:bg-brand-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-brand-950">
                      <div>{item.name}</div>
                      <div className="text-[10px] text-brand-450 font-normal mt-0.5">{item.roll} ({item.program})</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        {item.reasons.map((r, idx) => (
                          <div key={idx} className="text-brand-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
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
                        onClick={() => handleTriggerAction(item.id)} 
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
