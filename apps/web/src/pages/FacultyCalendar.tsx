import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Calendar, Bell, ShieldAlert } from 'lucide-react';

export const FacultyCalendar: React.FC = () => {
  const events = [
    { title: "Mid-Term Examinations Prep", date: "Sept 10, 2026", type: "Exam" },
    { title: "Syllabus Review Submission Deadline", date: "Sept 18, 2026", type: "Academic" },
    { title: "National Education Day Holiday", date: "Oct 02, 2026", type: "Holiday" },
    { title: "Course Feedback Audits", date: "Oct 15, 2026", type: "System" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900 flex items-center gap-1.5">
          <Calendar className="h-5.5 w-5.5 text-brand-500" />
          <span>Academic Calendar</span>
        </h1>
        <p className="text-xs text-brand-500 mt-1">Check scheduled institution term exam windows, events, and holidays.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((e, idx) => (
          <Card key={idx} className="border border-brand-200/60 shadow-sm p-4 hover:border-indigo-150 transition-colors flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-brand-450 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded w-fit">
                {e.type}
              </span>
              <h4 className="font-extrabold text-brand-950 text-xs mt-1">{e.title}</h4>
              <p className="text-brand-500 text-[10px]">{e.date}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default FacultyCalendar;
