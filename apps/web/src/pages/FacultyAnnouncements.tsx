import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Bell, Info, AlertTriangle } from 'lucide-react';

export const FacultyAnnouncements: React.FC = () => {
  const announcements = [
    {
      title: "End Semester Exams Time Table Release",
      date: "August 24, 2026",
      content: "The academic council has finalized dates for the upcoming term end exams. Check the timetable portal to confirm invigilation duties.",
      priority: "HIGH"
    },
    {
      title: "Faculty Feedback Surveys Launch",
      date: "August 22, 2026",
      content: "Course registration surveys are live for students. Please advise your mentees to submit feedback by next Monday.",
      priority: "MEDIUM"
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900 flex items-center gap-1.5">
          <Bell className="h-5.5 w-5.5 text-brand-500" />
          <span>Circulars & Announcements</span>
        </h1>
        <p className="text-xs text-brand-500 mt-1">Review official academic messages and department updates.</p>
      </div>

      <div className="space-y-4">
        {announcements.map((ann, idx) => (
          <Card key={idx} className="border border-brand-200/60 shadow-sm p-4">
            <div className="flex gap-3 items-start">
              <div className={`p-2 rounded-lg shrink-0 ${ann.priority === 'HIGH' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                {ann.priority === 'HIGH' ? <AlertTriangle className="h-4.5 w-4.5" /> : <Info className="h-4.5 w-4.5" />}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-extrabold text-brand-950 text-xs leading-snug">{ann.title}</h4>
                  <span className="text-[9px] text-brand-400 font-bold shrink-0">{ann.date}</span>
                </div>
                <p className="text-brand-650 leading-relaxed text-[11px] pt-1">{ann.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default FacultyAnnouncements;
