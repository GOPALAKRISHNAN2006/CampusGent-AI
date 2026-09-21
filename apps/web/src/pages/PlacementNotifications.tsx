import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Bell, 
  Check, 
  Trash, 
  MessageSquare, 
  Award, 
  Briefcase, 
  Video,
  Sparkles
} from 'lucide-react';

export const PlacementNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (err: any) {
      setError('Unable to fetch alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      fetchAlerts();
    } catch (err: any) {
      alert('Failed to mark alert as read.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      fetchAlerts();
    } catch (err: any) {
      alert('Failed to mark all alerts as read.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Operations Alerts Hub</h1>
          <p className="text-brand-500 mt-1">Review active system notifications, eligibility approvals alerts, and recruiter feedback dispatches.</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button onClick={handleMarkAllRead} className="bg-indigo-650 hover:bg-indigo-700 text-white shrink-0 font-bold flex items-center gap-1">
            <Check className="h-4 w-4" />
            <span>Mark All as Read</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {/* Notifications list */}
      <Card className="border border-brand-200/60 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-center text-brand-450 font-semibold animate-pulse">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Bell className="h-8 w-8 text-brand-400 mx-auto" />
              <h3 className="font-bold text-brand-900 text-sm">No new alerts</h3>
              <p className="text-brand-500 text-xs">
                Your operations notifications tray is completely cleared.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-100">
              {notifications.map((n) => (
                <div key={n._id} className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  n.read ? 'opacity-60 bg-white' : 'bg-brand-50/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-brand-950">{n.title}</h4>
                        <Badge variant="secondary" className="bg-brand-100 text-brand-700 font-bold text-[8.5px] uppercase">
                          {n.type || 'System'}
                        </Badge>
                      </div>
                      <p className="text-brand-700 font-semibold leading-relaxed">{n.message}</p>
                      <span className="block text-[9px] text-brand-400 font-bold">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!n.read && (
                    <button 
                      onClick={() => handleMarkRead(n._id)}
                      className="text-[10px] text-indigo-650 hover:underline font-bold shrink-0 flex items-center gap-0.5 border border-brand-200 bg-white px-2.5 py-1 rounded"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};
export default PlacementNotifications;
