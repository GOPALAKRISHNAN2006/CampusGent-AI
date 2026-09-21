import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, Plus, CheckCircle, Clock, Trash2, HelpCircle } from 'lucide-react';

export const FacultyAssessments: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New assessment Wizard Steps states: 1 = Basic Info, 2 = Marks & Questions, 3 = Review
  const [step, setStep] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);
  const [questionCount, setQuestionCount] = useState(5);
  const [date, setDate] = useState('');

  const fetchClassesAndAssessments = async () => {
    try {
      setLoading(true);
      const classesRes = await apiClient.get('/faculty/classes');
      setClasses(classesRes.data.data || []);
      if (classesRes.data.data?.length > 0) {
        setSelectedClass(classesRes.data.data[0]._id);
      }
    } catch (err: any) {
      setError('Failed to fetch assigned classes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassesAndAssessments();
  }, []);

  // Fetch assessments when selectedClass changes
  useEffect(() => {
    const fetchClassAssessments = async () => {
      if (selectedClass) {
        try {
          const res = await apiClient.get(`/faculty/assessments?classId=${selectedClass}`);
          setAssessments(res.data.data || []);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchClassAssessments();
  }, [selectedClass]);

  const handlePublishAssessment = async () => {
    try {
      await apiClient.post('/faculty/assessments', {
        classId: selectedClass,
        title,
        description,
        totalMarks,
        questionCount,
        date
      });
      // Reset wizard
      setShowWizard(false);
      setStep(1);
      setTitle('');
      setDescription('');
      setTotalMarks(100);
      setQuestionCount(5);
      setDate('');
      // Reload list
      const res = await apiClient.get(`/faculty/assessments?classId=${selectedClass}`);
      setAssessments(res.data.data || []);
    } catch (err) {
      alert('Failed to publish assessment');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Assessments & Exams</h1>
          <p className="text-xs text-brand-500 mt-1">Publish midterm tests, track grading status, and manage schedules.</p>
        </div>
        <Button 
          onClick={() => setShowWizard(!showWizard)} 
          className="bg-indigo-650 hover:bg-indigo-700 text-white text-xs px-4 py-2 h-10 rounded-xl font-bold flex gap-1.5 items-center"
        >
          <Plus className="h-4 w-4" />
          <span>Publish New Assessment</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Select class and section bar */}
      <div className="bg-white border border-brand-200/60 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="text-brand-450 font-bold text-[10px] uppercase shrink-0">Filter Class:</span>
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
      </div>

      {/* Stepped Creation Wizard Modal */}
      {showWizard && (
        <Card className="border border-indigo-200 bg-indigo-50/5 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-brand-100">
            <h3 className="font-bold text-indigo-900 text-sm">stepped Assessment Publisher</h3>
            <span className="text-[10px] text-brand-400 font-semibold">Step {step} of 3</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Assessment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid Term Exam 1"
                  className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Description / Syllabus Gaps</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Covers modules 1-3, SQL normalizations joins."
                  className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setShowWizard(false)} className="text-[10px] border-brand-200">Cancel</Button>
                <Button onClick={() => setStep(2)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl">Next Step</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Question Count</label>
                  <input
                    type="number"
                    required
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-450 mb-1">Schedule Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs border border-brand-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setStep(1)} className="text-[10px] border-brand-200">Previous</Button>
                <Button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl">Next Step</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 space-y-2">
                <p className="font-bold text-brand-900 text-sm">Review published details</p>
                <p><span className="font-semibold text-brand-450">Title:</span> {title}</p>
                <p><span className="font-semibold text-brand-450">Description:</span> {description || '-'}</p>
                <p><span className="font-semibold text-brand-450">Marks:</span> {totalMarks} points ({questionCount} questions)</p>
                <p><span className="font-semibold text-brand-450">Date:</span> {date}</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setStep(2)} className="text-[10px] border-brand-200">Previous</Button>
                <Button onClick={handlePublishAssessment} className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl">Publish Assessment</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Published Assessments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.length === 0 ? (
          <div className="col-span-full py-8 text-center text-brand-450">
            No assessments registered for this class. Click Publish New Assessment to register one.
          </div>
        ) : (
          assessments.map((a) => (
            <Card key={a._id} className="border border-brand-200/60 shadow-sm flex flex-col justify-between p-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-brand-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Scheduled {new Date(a.date).toLocaleDateString()}</span>
                  </span>
                  <Badge variant={a.status === 'COMPLETED' ? 'success' : 'warning'}>
                    {a.status}
                  </Badge>
                </div>
                <h4 className="font-bold text-brand-900 text-sm">{a.title}</h4>
                <p className="text-brand-650 leading-relaxed text-[10.5px]">{a.description || 'No syllabus context provided.'}</p>
                <p className="text-brand-500 font-bold text-[10px]">
                  {a.totalMarks} Points • {a.questionCount} Questions
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
export default FacultyAssessments;
