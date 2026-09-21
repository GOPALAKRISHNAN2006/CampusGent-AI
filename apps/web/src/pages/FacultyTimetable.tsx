import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const FacultyTimetable: React.FC = () => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/faculty/timetable');
        setTimetable(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 w-44 bg-brand-100 rounded"></div>
        <div className="h-44 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  // Group timetable slots by day
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-brand-900">Teaching Timetable</h1>
        <p className="text-xs text-brand-500 mt-1">Review scheduled weekly lecture hours, sections, and classroom rooms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {days.map((day) => {
          const slots = timetable.filter(slot => slot.day === day);
          return (
            <Card key={day} className="border border-brand-200/60 shadow-sm flex flex-col h-fit">
              <CardHeader className="bg-brand-50/50 py-3 border-b border-brand-100">
                <CardTitle className="text-xs font-bold text-brand-850 uppercase tracking-wider text-center">{day}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3 flex-1">
                {slots.length === 0 ? (
                  <p className="text-center text-brand-400 py-6 text-[10px]">No scheduled classes</p>
                ) : (
                  slots.map((slot, idx) => (
                    <div key={idx} className="p-2.5 border border-brand-100 rounded-lg bg-indigo-50/10 space-y-1.5 hover:border-indigo-200 transition-colors">
                      <p className="font-bold text-brand-900 leading-tight">{slot.subjectName}</p>
                      <p className="text-brand-500 text-[10px]">{slot.courseCode} • {slot.section}</p>
                      <div className="flex flex-col gap-0.5 text-[9px] text-brand-450 font-bold border-t border-brand-50 pt-1.5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{slot.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>{slot.room}</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default FacultyTimetable;
