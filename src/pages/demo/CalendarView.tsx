import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsDesktop } from '@/hooks/useIsDesktop';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { StaggerList } from '@/components/shared/StaggerList';
import { households } from '@/data';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users,
  Home, Stethoscope, UtensilsCrossed, Megaphone, GraduationCap,
  Heart, Truck,
} from 'lucide-react';

// ── Mock calendar events for a navigator ──
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  endTime?: string;
  type: 'visit' | 'distribution' | 'clinic' | 'meeting' | 'training' | 'followup' | 'delivery';
  householdId?: string;
  householdName?: string;
  location?: string;
  notes?: string;
}

const EVENT_CONFIG: Record<string, { label: string; color: string; icon: typeof Home }> = {
  visit: { label: 'Home Visit', color: 'bg-primary/10 text-primary border-l-primary', icon: Home },
  followup: { label: 'Follow-up', color: 'bg-amber-100 text-amber-800 border-l-amber-500', icon: Heart },
  distribution: { label: 'Distribution', color: 'bg-blue-100 text-blue-800 border-l-blue-500', icon: Truck },
  clinic: { label: 'Health Clinic', color: 'bg-green-100 text-green-800 border-l-green-500', icon: Stethoscope },
  meeting: { label: 'Team Meeting', color: 'bg-purple-100 text-purple-800 border-l-purple-500', icon: Megaphone },
  training: { label: 'Training', color: 'bg-indigo-100 text-indigo-800 border-l-indigo-500', icon: GraduationCap },
  delivery: { label: 'Supply Delivery', color: 'bg-orange-100 text-orange-800 border-l-orange-500', icon: UtensilsCrossed },
};

function generateMockEvents(): CalendarEvent[] {
  const today = new Date();
  const events: CalendarEvent[] = [];
  const hh = households;

  // Generate events for this week and next 2 weeks
  for (let dayOffset = -3; dayOffset <= 18; dayOffset++) {
    const d = new Date(today);
    d.setDate(today.getDate() + dayOffset);
    const dow = d.getDay();
    if (dow === 0) continue; // No Sunday events

    const dateStr = d.toISOString().split('T')[0];

    // Weekday visits
    if (dow >= 1 && dow <= 5) {
      const familyIdx = (dayOffset + 10) % hh.length;
      const family2Idx = (dayOffset + 7) % hh.length;
      events.push({
        id: `ev-visit-${dayOffset}`,
        title: `Visit ${hh[familyIdx].familyName} family`,
        date: dateStr,
        time: '9:00 AM',
        endTime: '10:30 AM',
        type: dayOffset % 3 === 0 ? 'followup' : 'visit',
        householdId: hh[familyIdx].id,
        householdName: hh[familyIdx].familyName,
        location: hh[familyIdx].address,
        notes: `Check on ${hh[familyIdx].headOfHousehold}. Review active needs.`,
      });

      if (dow <= 3) {
        events.push({
          id: `ev-visit2-${dayOffset}`,
          title: `Visit ${hh[family2Idx].familyName} family`,
          date: dateStr,
          time: '2:00 PM',
          endTime: '3:30 PM',
          type: 'visit',
          householdId: hh[family2Idx].id,
          householdName: hh[family2Idx].familyName,
          location: hh[family2Idx].address,
        });
      }
    }

    // Weekly distribution (Thursday)
    if (dow === 4) {
      events.push({
        id: `ev-dist-${dayOffset}`,
        title: 'Supply Distribution — Zone 1',
        date: dateStr,
        time: '10:00 AM',
        endTime: '2:00 PM',
        type: 'distribution',
        location: 'First Baptist Church, 529 Convention St',
        notes: 'Cleaning supplies, tarps, water. 4 volunteers needed.',
      });
    }

    // Medical clinic (Wednesday)
    if (dow === 3) {
      events.push({
        id: `ev-clinic-${dayOffset}`,
        title: 'Free Health Clinic',
        date: dateStr,
        time: '8:00 AM',
        endTime: '12:00 PM',
        type: 'clinic',
        location: 'Community Health Center, 3700 Florida Blvd',
        notes: 'Walk-ins welcome. Sliding scale. Bring medications list.',
      });
    }

    // Team meeting (Monday)
    if (dow === 1) {
      events.push({
        id: `ev-meeting-${dayOffset}`,
        title: 'Navigator Team Check-in',
        date: dateStr,
        time: '8:00 AM',
        endTime: '8:45 AM',
        type: 'meeting',
        location: 'Office / Zoom',
        notes: 'Weekly sync. Review stalled refuges. Assign new intakes.',
      });
    }

    // Saturday training
    if (dow === 6 && dayOffset % 14 < 7) {
      events.push({
        id: `ev-train-${dayOffset}`,
        title: 'New Volunteer Orientation',
        date: dateStr,
        time: '9:00 AM',
        endTime: '12:00 PM',
        type: 'training',
        location: 'Catholic Charities, 1408 Carmel Dr',
        notes: '6 new volunteers expected.',
      });
    }
  }

  return events.sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.time.localeCompare(b.time);
  });
}

const MOCK_EVENTS = generateMockEvents();

// ── Helpers ──
function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ── Event Card ──
function EventCard({ event }: { event: CalendarEvent }) {
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.visit;
  const Icon = config.icon;

  return (
    <Card className={`p-3 border-l-[3px] ${config.color.split(' ').find(c => c.startsWith('border-l-')) || ''}`}>
      <div className="flex items-start gap-2.5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${config.color.split(' ').slice(0, 2).join(' ')}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{event.title}</p>
            <Badge variant="secondary" className={`text-[9px] shrink-0 ${config.color.split(' ').slice(0, 2).join(' ')}`}>
              {config.label}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}{event.endTime ? ` – ${event.endTime}` : ''}</span>
            {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location.split(',')[0]}</span>}
          </div>
          {event.notes && <p className="text-[11px] text-muted-foreground mt-1 italic">{event.notes}</p>}
        </div>
      </div>
    </Card>
  );
}

// ── Main Calendar View ──
export default function CalendarView() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(today));
  const isDesktop = useIsDesktop();

  const days = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

  const eventsForDate = useMemo(() =>
    MOCK_EVENTS.filter(e => e.date === selectedDate),
    [selectedDate]
  );

  const eventCountByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_EVENTS.forEach(e => {
      counts[e.date] = (counts[e.date] || 0) + 1;
    });
    return counts;
  }, []);

  // Upcoming events (next 7 days)
  const upcoming = useMemo(() => {
    const todayStr = formatDate(today);
    const weekLater = new Date(today);
    weekLater.setDate(today.getDate() + 7);
    const weekStr = formatDate(weekLater);
    return MOCK_EVENTS.filter(e => e.date >= todayStr && e.date <= weekStr);
  }, []);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const todayStr = formatDate(today);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-xl font-bold">Calendar</h1>
          <p className="text-xs text-muted-foreground">Your schedule of visits, events, and activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(todayStr)}>Today</Button>
        </div>
      </div>

      <div className={isDesktop ? 'grid grid-cols-5 gap-6' : 'space-y-4'}>
        {/* Month grid */}
        <div className={isDesktop ? 'col-span-3' : ''}>
          <Card className="p-4">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="font-serif text-lg font-semibold">{MONTHS[currentMonth]} {currentYear}</h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const eventCount = eventCountByDate[dateStr] || 0;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`relative p-1.5 rounded-lg text-center transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                        : isToday
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-xs">{day}</span>
                    {eventCount > 0 && (
                      <div className="flex justify-center gap-0.5 mt-0.5">
                        {Array.from({ length: Math.min(eventCount, 3) }).map((_, di) => (
                          <span key={di} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 px-1">
            {Object.entries(EVENT_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <span key={key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right panel: selected day + upcoming */}
        <div className={isDesktop ? 'col-span-2 space-y-6' : 'space-y-4'}>
          {/* Selected day events */}
          <div>
            <h3 className="font-serif text-base font-semibold mb-2">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            {eventsForDate.length === 0 ? (
              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No events scheduled</p>
                <p className="text-xs text-muted-foreground mt-1 italic">A day for rest, reflection, or unexpected encounters.</p>
              </Card>
            ) : (
              <StaggerList className="space-y-2">
                {eventsForDate.map(e => <EventCard key={e.id} event={e} />)}
              </StaggerList>
            )}
          </div>

          {/* Week at a glance */}
          <div>
            <h3 className="font-serif text-base font-semibold mb-2">
              <Calendar className="h-4 w-4 inline mr-1.5" />
              Next 7 days
            </h3>
            <Card className="p-3">
              <div className="space-y-2">
                {(() => {
                  const grouped: Record<string, CalendarEvent[]> = {};
                  upcoming.forEach(e => {
                    if (!grouped[e.date]) grouped[e.date] = [];
                    grouped[e.date].push(e);
                  });
                  return Object.entries(grouped).map(([date, events]) => (
                    <div key={date}>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {date === todayStr && <Badge variant="secondary" className="text-[8px] ml-1.5 bg-primary/10 text-primary">Today</Badge>}
                      </p>
                      {events.map(e => {
                        const config = EVENT_CONFIG[e.type];
                        const Icon = config?.icon || Calendar;
                        return (
                          <div key={e.id} className="flex items-center gap-2 py-1 text-xs">
                            <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground w-16 shrink-0">{e.time}</span>
                            <span className="truncate">{e.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
