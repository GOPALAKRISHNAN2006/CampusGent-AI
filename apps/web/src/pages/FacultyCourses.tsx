import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

export const FacultyCourses: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
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
    fetchCourses();
  }, []);

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
        <h1 className="text-xl font-bold text-brand-900">Assigned Courses</h1>
        <p className="text-xs text-brand-500 mt-1">Review course curriculum specs, codes, and section distributions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((c) => (
          <Card key={c._id} className="border border-brand-200/60 shadow-sm p-4">
            <CardHeader className="pb-2">
              <span className="text-[9px] font-bold text-indigo-650 uppercase bg-indigo-50 px-2 py-0.5 rounded w-fit">
                {c.courseCode}
              </span>
              <CardTitle className="text-sm font-bold text-brand-950 mt-1">{c.subjectName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-brand-500 leading-normal">
                Focuses on building standard coding patterns, industry workflows, and core syllabus components.
              </p>
              
              <div className="flex gap-4 text-[10.5px] border-t border-brand-50 pt-3 text-brand-650">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-brand-400" />
                  <span>{c.students?.length || 0} Enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-brand-400" />
                  <span>Credits: 4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default FacultyCourses;
