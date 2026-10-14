import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  CheckCircle2,
  CalendarDays,
  ListOrdered,
} from 'lucide-react';

export const PlacementCalendar = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('MONTH');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayInterviews, setSelectedDayInterviews] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/jobs/all-interviews');
        setInterviews(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load interview calendar events.');
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayInterviews(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayInterviews(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDayInterviews(null);
  };

  // Group interviews by date string YYYY-MM-DD
  const getInterviewsForDate = (y, m, d) => {
    const targetStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return interviews.filter((int) => {
      if (!int.date) return false;
      const dObj = new Date(int.date);
      const intStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
      return intStr === targetStr;
    });
  };

  // Build grid cells for Month
  const calendarDays = [];
  // Leading days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    calendarDays.push({
      day: dayNum,
      isCurrentMonth: false,
      year: month === 0 ? year - 1 : year,
      month: month === 0 ? 11 : month - 1,
    });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: true,
      year,
      month,
    });
  }
  // Trailing days to fill 35 or 42 cells
  const remainingCells = (calendarDays.length % 7 === 0) ? 0 : 7 - (calendarDays.length % 7);
  for (let t = 1; t <= remainingCells; t++) {
    calendarDays.push({
      day: t,
      isCurrentMonth: false,
      year: month === 11 ? year + 1 : year,
      month: month === 11 ? 0 : month + 1,
    });
  }

  // Week calculation
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const weekDays = [];
  for (let w = 0; w < 7; w++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + w);
    weekDays.push(d);
  }

  const isToday = (y, m, d) => {
    const today = new Date();
    return (
      today.getFullYear() === y &&
      today.getMonth() === m &&
      today.getDate() === d
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">Placement Operations Calendar</h1>
          <p className="text-brand-500 mt-1">
            Audit booked interview schedules, recruiter coordination slots, and PPT talks timeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white border border-brand-200 p-1 rounded-xl text-[10px] font-bold shadow-2xs">
            <button
              onClick={() => setActiveTab('MONTH')}
              className={`px-3 py-1.5 rounded-lg transition-colors uppercase cursor-pointer flex items-center gap-1 ${
                activeTab === 'MONTH' ? 'bg-indigo-650 text-white font-extrabold shadow-xs' : 'text-brand-650 hover:bg-brand-50'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setActiveTab('WEEK')}
              className={`px-3 py-1.5 rounded-lg transition-colors uppercase cursor-pointer flex items-center gap-1 ${
                activeTab === 'WEEK' ? 'bg-indigo-650 text-white font-extrabold shadow-xs' : 'text-brand-650 hover:bg-brand-50'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Week</span>
            </button>
            <button
              onClick={() => setActiveTab('AGENDA')}
              className={`px-3 py-1.5 rounded-lg transition-colors uppercase cursor-pointer flex items-center gap-1 ${
                activeTab === 'AGENDA' ? 'bg-indigo-650 text-white font-extrabold shadow-xs' : 'text-brand-650 hover:bg-brand-50'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Agenda</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* MONTH VIEW */}
      {activeTab === 'MONTH' && (
        <Card className="border border-brand-200/60 shadow-xs bg-white overflow-hidden">
          <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50/50">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-extrabold text-brand-950">
                {monthNames[month]} {year}
              </h2>
              <span className="text-[11px] font-bold text-brand-500 bg-white px-2.5 py-0.5 rounded-full border border-brand-200">
                {interviews.length} Total Slotted
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevMonth}
                className="h-8 px-2.5 font-bold cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToday}
                className="h-8 px-3 font-bold text-[11px] cursor-pointer"
              >
                Today
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNextMonth}
                className="h-8 px-2.5 font-bold cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-brand-100 bg-brand-50/70 text-center font-bold text-[10px] text-brand-600 uppercase tracking-wider py-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-brand-100 border-b border-brand-100">
            {calendarDays.map((cell, idx) => {
              const dayInterviews = getInterviewsForDate(cell.year, cell.month, cell.day);
              const currentDayBool = isToday(cell.year, cell.month, cell.day);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (dayInterviews.length > 0) {
                      setSelectedDayInterviews({
                        date: `${cell.day} ${monthNames[cell.month]} ${cell.year}`,
                        items: dayInterviews,
                      });
                    }
                  }}
                  className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors ${
                    cell.isCurrentMonth ? 'bg-white hover:bg-brand-50/40' : 'bg-brand-50/25 text-brand-350'
                  } ${dayInterviews.length > 0 ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold inline-flex items-center justify-center h-6 w-6 rounded-full ${
                        currentDayBool
                          ? 'bg-indigo-650 text-white font-black shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-brand-900'
                          : 'text-brand-350'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {dayInterviews.length > 0 && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-indigo-200 animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayInterviews.slice(0, 2).map((item) => (
                      <div
                        key={item._id}
                        className="p-1 rounded bg-indigo-50 border border-indigo-150 text-[9.5px] font-semibold text-indigo-900 truncate"
                        title={`${item.job?.companyName || 'Company'} - ${item.student?.name || 'Candidate'} (${item.type})`}
                      >
                        <span className="font-bold">{item.job?.companyName || 'Drive'}: </span>
                        <span>{item.student?.name || 'Slot'}</span>
                      </div>
                    ))}
                    {dayInterviews.length > 2 && (
                      <span className="block text-[9px] font-bold text-indigo-700 pl-0.5">
                        +{dayInterviews.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDayInterviews && (
            <div className="p-4 bg-brand-50/70 border-t border-brand-200 flex flex-col sm:flex-row items-start justify-between gap-3 animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">Selected Day Schedule</span>
                <h4 className="font-extrabold text-brand-950 text-sm">{selectedDayInterviews.date}</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedDayInterviews.items.map((it) => (
                    <div key={it._id} className="bg-white border border-brand-200 px-3 py-1.5 rounded-lg shadow-2xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-900">{it.student?.name}</span>
                        <Badge variant="secondary" className="text-[8.5px] font-bold">
                          {it.type}
                        </Badge>
                      </div>
                      <p className="text-brand-500 text-[10px] font-semibold">
                        {it.job?.companyName} • {new Date(it.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedDayInterviews(null)}
                className="text-[11px] font-bold text-brand-600 hover:text-brand-950 cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}
        </Card>
      )}

      {/* WEEK VIEW */}
      {activeTab === 'WEEK' && (
        <Card className="border border-brand-200/60 shadow-xs bg-white overflow-hidden">
          <div className="p-4 border-b border-brand-100 flex items-center justify-between bg-brand-50/50">
            <h2 className="text-base font-extrabold text-brand-950">
              Week of {weekDays[0].toLocaleDateString()} — {weekDays[6].toLocaleDateString()}
            </h2>
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const d = new Date(currentDate);
                  d.setDate(d.getDate() - 7);
                  setCurrentDate(d);
                }}
                className="h-8 px-2.5 font-bold cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleToday}
                className="h-8 px-3 font-bold text-[11px] cursor-pointer"
              >
                Current Week
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const d = new Date(currentDate);
                  d.setDate(d.getDate() + 7);
                  setCurrentDate(d);
                }}
                className="h-8 px-2.5 font-bold cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-brand-100 min-h-[350px]">
            {weekDays.map((dateObj, idx) => {
              const dayInterviews = getInterviewsForDate(
                dateObj.getFullYear(),
                dateObj.getMonth(),
                dateObj.getDate()
              );
              const currentDayBool = isToday(
                dateObj.getFullYear(),
                dateObj.getMonth(),
                dateObj.getDate()
              );

              return (
                <div key={idx} className="p-3 flex flex-col justify-start space-y-2 bg-white">
                  <div className={`p-2 rounded-xl text-center ${currentDayBool ? 'bg-indigo-50 border border-indigo-200' : 'bg-brand-50/50'}`}>
                    <span className="block text-[10px] font-bold text-brand-500 uppercase">
                      {dateObj.toLocaleDateString([], { weekday: 'short' })}
                    </span>
                    <span className={`text-base font-black ${currentDayBool ? 'text-indigo-700' : 'text-brand-900'}`}>
                      {dateObj.getDate()}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {dayInterviews.length === 0 ? (
                      <span className="block text-center text-brand-350 text-[10px] pt-4">No slots</span>
                    ) : (
                      dayInterviews.map((slot) => (
                        <div
                          key={slot._id}
                          className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-150 space-y-1 shadow-2xs"
                        >
                          <Badge variant="secondary" className="text-[8px] font-black uppercase">
                            {slot.type}
                          </Badge>
                          <p className="font-bold text-brand-950 text-[11px] truncate">{slot.student?.name}</p>
                          <p className="text-[10px] text-brand-600 font-semibold truncate">{slot.job?.companyName}</p>
                          <div className="flex items-center gap-1 text-[9.5px] text-brand-500 pt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(slot.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* AGENDA VIEW */}
      {activeTab === 'AGENDA' && (
        <Card className="border border-brand-200/60 shadow-xs bg-white">
          <CardHeader className="border-b border-brand-100 flex flex-row items-center justify-between">
            <CardTitle className="text-brand-900 font-bold">Upcoming Operations Agenda</CardTitle>
            <span className="font-bold text-brand-500 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              {interviews.length} slots booked
            </span>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-brand-100 rounded-xl" />
                <div className="h-20 bg-brand-100 rounded-xl" />
              </div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-14 space-y-2 text-brand-450">
                <CalendarIcon className="h-8 w-8 mx-auto text-brand-300" />
                <p className="font-semibold text-xs">No scheduled interview operations found in database.</p>
              </div>
            ) : (
              interviews.map((int) => (
                <div
                  key={int._id}
                  className="border border-brand-200 rounded-xl p-4 bg-brand-50/20 hover:bg-brand-50/50 transition-colors flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold text-[9px] uppercase"
                      >
                        {int.type} ROUND
                      </Badge>
                      <h4 className="font-extrabold text-brand-950 text-[11.5px]">{int.student?.name}</h4>
                    </div>
                    <p className="font-bold text-brand-900">
                      {int.job?.companyName} —{' '}
                      <span className="font-semibold text-brand-500">{int.job?.title}</span>
                    </p>
                    <div className="flex items-center gap-4 text-brand-500 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(int.date).toLocaleString()}
                      </span>
                      {int.meetingUrl && (
                        <a
                          href={int.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-650 hover:underline inline-flex items-center gap-1 font-bold"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Video lobby link</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-end shrink-0">
                    <Badge
                      variant={int.status === 'COMPLETED' ? 'success' : 'warning'}
                      className="font-bold text-[9px]"
                    >
                      {int.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlacementCalendar;
