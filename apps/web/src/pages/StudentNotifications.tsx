import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Bell,
  CheckCheck,
  Check,
  Calendar,
  Sparkles,
  BookOpen,
  Briefcase,
  AlertTriangle,
  Info
} from 'lucide-react';

export const StudentNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      setNotifications(res.data.data.notifications || []);
      setUnreadCount(res.data.data.unreadCount || 0);
    } catch (err: any) {
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markSingleRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      // Update local state
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await apiClient.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Group notifications helper
  const groupNotifications = () => {
    const today: any[] = [];
    const yesterday: any[] = [];
    const earlier: any[] = [];

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    notifications.forEach(n => {
      const date = new Date(n.createdAt);
      const diffTime = Math.abs(now.getTime() - date.getTime());
      
      if (diffTime < oneDay && now.getDate() === date.getDate()) {
        today.push(n);
      } else if (diffTime < 2 * oneDay) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <BookOpen className="h-4 w-4 text-indigo-500" />;
      case 'placement':
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'career':
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      case 'AI':
        return <Sparkles className="h-4 w-4 text-indigo-600" />;
      case 'system':
      default:
        return <Info className="h-4 w-4 text-brand-500" />;
    }
  };

  const { today, yesterday, earlier } = groupNotifications();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-10 w-44 bg-brand-100 rounded-lg"></div>
        <div className="h-64 bg-brand-100 rounded-xl"></div>
      </div>
    );
  }

  const renderSection = (title: string, list: any[]) => {
    if (list.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-brand-500 uppercase tracking-wider px-1">{title}</h3>
        <div className="space-y-2">
          {list.map((n) => (
            <Card 
              key={n._id} 
              className={`border border-brand-200/50 transition-all ${
                n.read ? 'bg-white opacity-70' : 'bg-indigo-50/15 border-indigo-100/70 shadow-sm'
              }`}
            >
              <CardContent className="p-4 flex items-start gap-4">
                {/* Icon Container */}
                <div className={`p-2 rounded-xl shrink-0 ${n.read ? 'bg-brand-50 text-brand-500' : 'bg-indigo-50/70 text-indigo-700'}`}>
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-brand-950">{n.title}</span>
                    <span className="text-[10px] text-brand-400 font-semibold">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-brand-700 leading-relaxed text-xs">{n.message}</p>
                </div>

                {/* Mark as read action */}
                {!n.read && (
                  <button
                    onClick={() => markSingleRead(n._id)}
                    className="p-1 text-brand-400 hover:text-indigo-600 transition-colors shrink-0 tooltip"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-indigo-500" />
            <span>Notification Hub</span>
          </h1>
          <p className="text-sm text-brand-500 mt-1">
            Keep updated with latest academic reports, job matches, mock evaluations, and system announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={markAllRead}
            variant="secondary"
            className="text-xs py-1.5 px-3 flex gap-1 items-center shrink-0 border-brand-200 hover:bg-brand-50"
          >
            <CheckCheck className="h-4 w-4 text-indigo-650" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <Card className="text-center p-12 border border-brand-200/60 shadow-sm text-brand-400">
          <CardContent className="space-y-2">
            <Bell className="h-8 w-8 mx-auto text-brand-300" />
            <h3 className="font-bold text-brand-900 text-sm">No Notifications Yet</h3>
            <p className="max-w-md mx-auto text-brand-500 text-xs">
              We'll send you alerts when placement officers post jobs or AI agents complete evaluations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {renderSection('Today', today)}
          {renderSection('Yesterday', yesterday)}
          {renderSection('Earlier', earlier)}
        </div>
      )}
    </div>
  );
};
export default StudentNotifications;
