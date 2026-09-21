import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock, ArrowRight, GraduationCap } from 'lucide-react';

export const FacultyClasses: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/faculty/classes');
        setClasses(res.data.data || []);
      } catch (err: any) {
        setError('Failed to load classes.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-brand-100 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-brand-100 rounded-xl"></div>
          <div className="h-48 bg-brand-100 rounded-xl"></div>
          <div className="h-48 bg-brand-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900">Assigned Courses & Classes</h1>
        <p className="text-xs text-brand-500 mt-1">Manage sections, schedules, student rosters, and assessments.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {classes.length === 0 ? (
        <Card className="p-8 text-center text-brand-450 border border-brand-200/60 shadow-sm">
          <BookOpen className="h-8 w-8 mx-auto text-brand-300 mb-2" />
          <p className="font-bold">No classes are assigned to you yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <Card key={c._id} className="border border-brand-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardHeader className="pb-2">
                <span className="text-[9px] font-bold text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded w-fit">
                  {c.courseCode}
                </span>
                <CardTitle className="text-sm font-bold text-brand-950 mt-1">{c.subjectName}</CardTitle>
                <p className="text-[10px] text-brand-500 mt-0.5">{c.section} • Semester {c.semester}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-[10px] border-y border-brand-50 py-3 my-1">
                  <div className="flex items-center gap-1.5 text-brand-650">
                    <Users className="h-4 w-4 text-brand-400 shrink-0" />
                    <span>{c.students?.length || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-650">
                    <GraduationCap className="h-4 w-4 text-brand-400 shrink-0" />
                    <span>Avg GPA: 7.8</span>
                  </div>
                </div>

                <div className="space-y-1 bg-brand-50/40 p-2.5 rounded-lg border border-brand-100">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Schedule timetable</span>
                  </span>
                  <div className="text-[10px] text-brand-700 font-semibold space-y-0.5">
                    {c.timetable.map((slot: any, idx: number) => (
                      <p key={idx}>{slot.day}: {slot.time} ({slot.room})</p>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Link to={`/faculty/classes/${c._id}`} className="flex-1">
                    <Button className="w-full bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold flex gap-1.5 justify-center items-center py-2 h-9 rounded-lg">
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default FacultyClasses;
