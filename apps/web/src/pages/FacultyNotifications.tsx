import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Check, Clock } from 'lucide-react';

export const FacultyNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      setNotifications(res.data.data.notifications || []);
    } catch (err) {
      setError('Failed to load notifications feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      fetchAlerts();
    } catch (err) {
      console.error(err);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-brand-900 flex items-center gap-1.5">
            <Bell className="h-5.5 w-5.5 text-brand-500" />
            <span>Faculty Notifications Hub</span>
          </h1>
          <p className="text-xs text-brand-500 mt-1">Review alerts regarding student attendance warnings and task submissions.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <Button 
            onClick={handleMarkAllRead} 
            className="bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-xl flex gap-1.5 items-center h-9"
          >
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

      <Card className="border border-brand-200/60 shadow-sm overflow-hidden">
        <CardContent className="p-0 divide-y divide-brand-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-brand-450">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className={`p-4 flex gap-4 items-start hover:bg-brand-50/20 transition-colors ${!n.read ? 'bg-brand-50/30' : ''}`}>
                <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg shrink-0 mt-0.5">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-brand-900 text-xs">{n.title}</h4>
                    <span className="text-[9px] text-brand-400 font-semibold shrink-0 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="text-brand-650 leading-relaxed text-[11px]">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default FacultyNotifications;
