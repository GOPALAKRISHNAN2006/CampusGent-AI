import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Calendar, CheckCircle, AlertCircle, RefreshCw, Check, X, ShieldAlert } from 'lucide-react';

export const FacultyAttendance: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<any[]>([]);
  
  // Local attendance status mapping studentId -> PRESENT | ABSENT | LATE
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/faculty/classes');
        setClasses(res.data.data || []);
        if (res.data.data?.length > 0) {
          setSelectedClass(res.data.data[0]._id);
        }
      } catch (err: any) {
        setError('Failed to fetch assigned classes.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Update students roster when class selection updates
  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find(c => c._id === selectedClass);
      if (cls) {
        setStudents(cls.students || []);
        // Initialize all student records to PRESENT by default
        const initialMap: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
        (cls.students || []).forEach((s: any) => {
          initialMap[s._id] = 'PRESENT';
        });
        setAttendanceMap(initialMap);
      }
    }
  }, [selectedClass, classes]);

  const toggleStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmitAttendance = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const records = Object.entries(attendanceMap).map(([student, status]) => ({
        student,
        status
      }));

      await apiClient.post('/faculty/attendance', {
        classId: selectedClass,
        date,
        records
      });

      setSuccessMessage('Attendance register logged successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSaving(false);
    }
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
        <h1 className="text-xl font-bold text-brand-900">Mark Student Attendance</h1>
        <p className="text-xs text-brand-500 mt-1">Select class, configure dates, and toggle student presence registers.</p>
      </div>

      {/* Select Controls bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-brand-450 uppercase">Target class & section</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.courseCode} - {c.subjectName} ({c.section})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-brand-450 uppercase">Session date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Attendance Check List */}
      <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-brand-50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">
            Roster checklist ({students.length} students)
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => {
                const updated: Record<string, 'PRESENT'> = {};
                students.forEach(s => { updated[s._id] = 'PRESENT'; });
                setAttendanceMap(updated as any);
              }}
              className="text-[9px] border-brand-200 text-brand-650 font-bold hover:bg-brand-50"
            >
              Mark All Present
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase">
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Roll Number</th>
                <th className="px-6 py-3">Eligibility Index</th>
                <th className="px-6 py-3 text-right">Attendance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-brand-450">
                    No students enrolled in this section.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  const status = attendanceMap[s._id] || 'PRESENT';
                  return (
                    <tr key={s._id} className="hover:bg-brand-50/50">
                      <td className="px-6 py-4 font-semibold text-brand-900">{s.user?.name || 'Mentee'}</td>
                      <td className="px-6 py-4">{s.rollNumber}</td>
                      <td className="px-6 py-4">
                        <Badge variant={s.cgpa < 6.0 ? 'warning' : 'success'}>
                          {s.cgpa < 6.0 ? 'At Warning Risks' : 'Eligible'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex rounded-lg border border-brand-200 overflow-hidden h-8">
                          <button
                            onClick={() => toggleStatus(s._id, 'PRESENT')}
                            className={`px-3 py-1 font-bold text-[10px] transition-colors border-r border-brand-200 ${
                              status === 'PRESENT' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-white hover:bg-brand-50 text-brand-700'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => toggleStatus(s._id, 'LATE')}
                            className={`px-3 py-1 font-bold text-[10px] transition-colors border-r border-brand-200 ${
                              status === 'LATE' 
                                ? 'bg-amber-500 text-white' 
                                : 'bg-white hover:bg-brand-50 text-brand-700'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            onClick={() => toggleStatus(s._id, 'ABSENT')}
                            className={`px-3 py-1 font-bold text-[10px] transition-colors ${
                              status === 'ABSENT' 
                                ? 'bg-red-650 text-white' 
                                : 'bg-white hover:bg-brand-50 text-brand-700'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Save Trigger */}
      {students.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSubmitAttendance} 
            isLoading={saving}
            className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2.5 font-bold h-10 rounded-xl shadow-sm"
          >
            Submit attendance logs
          </Button>
        </div>
      )}

    </div>
  );
};
export default FacultyAttendance;
