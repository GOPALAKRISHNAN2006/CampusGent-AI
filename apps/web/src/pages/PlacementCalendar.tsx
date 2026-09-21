import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Briefcase,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const PlacementCalendar: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'MONTH' | 'WEEK' | 'AGENDA'>('AGENDA');

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/jobs/all-interviews');
        setInterviews(res.data.data || []);
      } catch (err: any) {
        setError('Failed to load calendar events.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Placement Operations Calendar</h1>
          <p className="text-brand-500 mt-1">Audit booked interview schedules, PPT talks dates, and recruiter coordination slots.</p>
        </div>
        <div className="flex gap-2 bg-white border border-brand-200 p-1 rounded-lg text-[10px] font-bold shrink-0">
          {(['MONTH', 'WEEK', 'AGENDA'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode)}
              className={`px-3 py-1 rounded-md transition-colors uppercase ${
                activeTab === mode 
                  ? 'bg-indigo-650 text-white font-extrabold' 
                  : 'text-brand-650 hover:bg-brand-50'
              }`}
            >
              {mode.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Mode content rendering */}
      {activeTab === 'AGENDA' ? (
        <Card className="border border-brand-200/60 shadow-sm bg-white">
          <CardHeader className="border-b border-brand-100 flex flex-row items-center justify-between">
            <CardTitle className="text-brand-900 font-bold">Upcoming Operations Agenda</CardTitle>
            <span className="font-bold text-brand-500">{interviews.length} slots booked</span>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-brand-100 rounded-lg"></div>
              </div>
            ) : interviews.length === 0 ? (
              <p className="text-center py-10 text-brand-450 font-semibold">No operations schedules registered.</p>
            ) : (
              interviews.map((int) => (
                <div key={int._id} className="border border-brand-200 rounded-xl p-4 bg-brand-50/20 hover:bg-brand-50/50 transition-colors flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-[9px] uppercase">
                        {int.type} ROUND
                      </Badge>
                      <h4 className="font-extrabold text-brand-950 text-[11.5px]">{int.student?.name}</h4>
                    </div>
                    <p className="font-bold text-brand-900">{int.job?.companyName} &mdash; <span className="font-semibold text-brand-500">{int.job?.title}</span></p>
                    <div className="flex items-center gap-3 text-brand-500 font-semibold pt-1">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(int.date).toLocaleString()}</span>
                      {int.meetingUrl && (
                        <a href={int.meetingUrl} target="_blank" rel="noreferrer" className="text-indigo-650 hover:underline inline-flex items-center gap-0.5 font-bold">
                          <Video className="h-3.5 w-3.5" />
                          <span>Video lobby link</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-end shrink-0">
                    <Badge variant={int.status === 'COMPLETED' ? 'success' : 'warning'} className="font-bold text-[9px]">
                      {int.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-brand-200/60 shadow-sm bg-white p-6 text-center">
          <CardContent className="space-y-3">
            <CalendarIcon className="h-8 w-8 text-brand-450 mx-auto" />
            <h3 className="font-bold text-brand-900 text-sm">Visual Calendar Mode</h3>
            <p className="text-brand-500 text-xs max-w-sm mx-auto">
              Please use the <strong>Agenda</strong> view tab to check slotted logs or update candidate interview feedback.
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  );
};
export default PlacementCalendar;
