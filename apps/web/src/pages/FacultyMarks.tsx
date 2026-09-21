import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const FacultyMarks: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  
  // Marks record map studentId -> { marksObtained: number, remarks: string }
  const [marksMap, setMarksMap] = useState<Record<string, { marksObtained: number, remarks: string }>>({});
  
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
      } catch (err) {
        setError('Failed to fetch assigned classes');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // Fetch assessments and load students when class changes
  useEffect(() => {
    const fetchClassAssessments = async () => {
      if (selectedClass) {
        try {
          const res = await apiClient.get(`/faculty/assessments?classId=${selectedClass}`);
          setAssessments(res.data.data || []);
          if (res.data.data?.length > 0) {
            setSelectedAssessment(res.data.data[0]._id);
          } else {
            setSelectedAssessment('');
          }
          
          const cls = classes.find(c => c._id === selectedClass);
          if (cls) {
            setStudents(cls.students || []);
            // Initialize marks map to 0
            const initialMap: Record<string, { marksObtained: number, remarks: string }> = {};
            (cls.students || []).forEach((s: any) => {
              initialMap[s._id] = { marksObtained: 0, remarks: '' };
            });
            setMarksMap(initialMap);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchClassAssessments();
  }, [selectedClass, classes]);

  // Load existing marks if they exist
  useEffect(() => {
    const fetchExistingMarks = async () => {
      if (selectedAssessment) {
        try {
          const res = await apiClient.get(`/faculty/marks?assessmentId=${selectedAssessment}`);
          if (res.data.data?.length > 0) {
            const loadedMap: Record<string, { marksObtained: number, remarks: string }> = {};
            // Start with defaults
            students.forEach(s => {
              loadedMap[s._id] = { marksObtained: 0, remarks: '' };
            });
            // Overwrite with existing marks
            (res.data.data || []).forEach((m: any) => {
              if (m.student?._id) {
                loadedMap[m.student._id] = {
                  marksObtained: m.marksObtained,
                  remarks: m.remarks || ''
                };
              }
            });
            setMarksMap(loadedMap);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchExistingMarks();
  }, [selectedAssessment, students]);

  const handleScoreChange = (studentId: string, score: number) => {
    const assessment = assessments.find(a => a._id === selectedAssessment);
    const maxScore = assessment?.totalMarks || 100;
    
    // Validate marks limits
    const marksObtained = Math.max(0, Math.min(maxScore, score));

    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marksObtained
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSubmitMarks = async () => {
    if (!selectedAssessment) {
      setError('Please select an assessment to record marks.');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const marks = Object.entries(marksMap).map(([student, details]) => ({
        student,
        marksObtained: details.marksObtained,
        remarks: details.remarks
      }));

      await apiClient.post('/faculty/marks', {
        assessmentId: selectedAssessment,
        marks
      });

      setSuccessMessage('Student marks spreadsheet recorded and published.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish student scores.');
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

  const currentAssessment = assessments.find(a => a._id === selectedAssessment);

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900">Record Student Marks</h1>
        <p className="text-xs text-brand-500 mt-1">Select class, configure assessments, and enter marks in a spreadsheet-like structure.</p>
      </div>

      {/* Select Controls bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-brand-450 uppercase">Select assigned class</label>
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
          <label className="text-[10px] font-bold text-brand-450 uppercase">Select assessment</label>
          <select
            value={selectedAssessment}
            onChange={(e) => setSelectedAssessment(e.target.value)}
            className="text-xs border border-brand-200 rounded-lg p-2.5 outline-none bg-white font-bold text-brand-700 h-10"
          >
            {assessments.length === 0 ? (
              <option value="">No assessments published</option>
            ) : (
              assessments.map((a) => (
                <option key={a._id} value={a._id}>{a.title} ({a.totalMarks} Marks)</option>
              ))
            )}
          </select>
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

      {/* Marks spreadsheet registry */}
      {selectedAssessment ? (
        <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-brand-50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-brand-500 uppercase tracking-wider">
              Grading ledger sheet ({students.length} students enrolled)
            </CardTitle>
            <Badge variant={currentAssessment?.status === 'COMPLETED' ? 'success' : 'warning'}>
              {currentAssessment?.status === 'COMPLETED' ? 'Published' : 'Draft'}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-50 border-b border-brand-200 text-xs font-semibold text-brand-600 uppercase">
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Roll Number</th>
                  <th className="px-6 py-3">Score (Max: {currentAssessment?.totalMarks || 100})</th>
                  <th className="px-6 py-3">Performance remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 text-xs text-brand-800">
                {students.map((s) => {
                  const record = marksMap[s._id] || { marksObtained: 0, remarks: '' };
                  return (
                    <tr key={s._id} className="hover:bg-brand-50/50">
                      <td className="px-6 py-4 font-semibold text-brand-900">{s.user?.name || 'Mentee'}</td>
                      <td className="px-6 py-4">{s.rollNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={record.marksObtained}
                            onChange={(e) => handleScoreChange(s._id, Number(e.target.value))}
                            className="w-20 text-xs border border-brand-200 rounded-lg p-1.5 outline-none focus:border-indigo-500 bg-white font-bold text-brand-900"
                          />
                          <span className="text-brand-450 font-bold">/ {currentAssessment?.totalMarks || 100}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={record.remarks}
                          onChange={(e) => handleRemarksChange(s._id, e.target.value)}
                          placeholder="e.g. Good performance"
                          className="w-full text-xs border border-brand-200 rounded-lg p-1.5 outline-none focus:border-indigo-500 bg-white text-brand-850"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-8 text-center text-brand-450 border border-brand-200/60 shadow-sm">
          <FileText className="h-8 w-8 mx-auto text-brand-300 mb-2" />
          <p className="font-bold">No active assessments registered for this course section.</p>
        </Card>
      )}

      {selectedAssessment && students.length > 0 && (
        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSubmitMarks} 
            isLoading={saving}
            className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-6 py-2.5 font-bold h-10 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Publish Marks Sheet</span>
          </Button>
        </div>
      )}

    </div>
  );
};
export default FacultyMarks;
