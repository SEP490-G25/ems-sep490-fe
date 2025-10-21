import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ScheduleSession } from '@/types/student';
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleCalendarViewProps {
  sessions: ScheduleSession[];
  onViewDetails?: (sessionId: number) => void;
  onSubmitAbsence?: (sessionId: number) => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  label: string;
}

// Generate time slots from 06:00 to 22:00 in 1-hour intervals
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour <= 21; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({
      startTime,
      endTime,
      label: startTime,
    });
  }
  return slots;
};

// Find which time slot a session belongs to
const findTimeSlotIndex = (sessionStartTime: string, timeSlots: TimeSlot[]): number => {
  const sessionHour = parseInt(sessionStartTime.split(':')[0]);
  const sessionMinutes = parseInt(sessionStartTime.split(':')[1]);
  const sessionTimeInMinutes = sessionHour * 60 + sessionMinutes;

  for (let i = 0; i < timeSlots.length; i++) {
    const slotStartHour = parseInt(timeSlots[i].startTime.split(':')[0]);
    const slotEndHour = parseInt(timeSlots[i].endTime.split(':')[0]);
    const slotStartMinutes = slotStartHour * 60;
    const slotEndMinutes = slotEndHour * 60;

    if (sessionTimeInMinutes >= slotStartMinutes && sessionTimeInMinutes < slotEndMinutes) {
      return i;
    }
  }

  // If session is outside regular hours, add it to the closest slot
  if (sessionTimeInMinutes < 6 * 60) return 0; // Before 6am
  return timeSlots.length - 1; // After 10pm
};

// Color coding based on attendance status
const getStatusColor = (
  status: ScheduleSession['attendanceStatus']
): { bg: string; text: string; border: string } => {
  switch (status) {
    case 'present':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-300 dark:border-green-700',
      };
    case 'absent':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-300 dark:border-red-700',
      };
    case 'late':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-300 dark:border-yellow-700',
      };
    case 'excused':
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-300 dark:border-gray-600',
      };
    case 'planned':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-700',
      };
    default:
      return {
        bg: 'bg-background',
        text: 'text-foreground',
        border: 'border-border',
      };
  }
};

export const ScheduleCalendarView = ({
  sessions,
  onViewDetails,
}: ScheduleCalendarViewProps) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Get the days of the current week
  const weekDays = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
  }, [currentWeekStart]);

  // Organize sessions by day and time slot
  const timetableData = useMemo(() => {
    const data: Map<number, Map<number, ScheduleSession[]>> = new Map();

    // Initialize empty structure
    for (let day = 0; day < 7; day++) {
      data.set(day, new Map());
      for (let slot = 0; slot < timeSlots.length; slot++) {
        data.get(day)!.set(slot, []);
      }
    }

    // Place sessions in the appropriate cells
    sessions.forEach((session) => {
      const sessionDate = parseISO(session.date);
      const dayOfWeek = weekDays.findIndex((day) => isSameDay(day, sessionDate));

      if (dayOfWeek !== -1) {
        const timeSlotIndex = findTimeSlotIndex(session.startTime, timeSlots);
        const daySessions = data.get(dayOfWeek)!;
        const slotSessions = daySessions.get(timeSlotIndex) || [];
        slotSessions.push(session);
        daySessions.set(timeSlotIndex, slotSessions);
      }
    });

    return data;
  }, [sessions, weekDays, timeSlots]);

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, -1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const isCurrentWeek = isSameDay(currentWeekStart, startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Week of {format(currentWeekStart, 'MMM dd, yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              {!isCurrentWeek && (
                <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Today
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timetable Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row - Days of Week */}
              <div className="grid grid-cols-8 border-b bg-muted/50 sticky top-0 z-10">
                <div className="p-3 border-r font-semibold text-sm">Time</div>
                {weekDays.map((day, index) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div
                      key={index}
                      className={cn(
                        'p-3 border-r last:border-r-0 text-center',
                        isToday && 'bg-primary/10'
                      )}
                    >
                      <div className="font-semibold text-sm">{format(day, 'EEE')}</div>
                      <div
                        className={cn(
                          'text-xs mt-1',
                          isToday ? 'text-primary font-medium' : 'text-muted-foreground'
                        )}
                      >
                        {format(day, 'MMM dd')}
                      </div>
                      {isToday && (
                        <Badge variant="default" className="mt-1 text-[10px] h-4 px-1">
                          Today
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time Slot Rows */}
              <div className="divide-y">
                {timeSlots.map((timeSlot, slotIndex) => (
                  <div key={slotIndex} className="grid grid-cols-8 min-h-[80px]">
                    {/* Time Label */}
                    <div className="p-2 border-r text-xs text-muted-foreground font-medium bg-muted/30">
                      {timeSlot.label}
                    </div>

                    {/* Day Cells */}
                    {weekDays.map((day, dayIndex) => {
                      const daySessions = timetableData.get(dayIndex)?.get(slotIndex) || [];
                      const isToday = isSameDay(day, new Date());

                      return (
                        <div
                          key={dayIndex}
                          className={cn(
                            'p-1 border-r last:border-r-0 relative',
                            isToday && 'bg-primary/5'
                          )}
                        >
                          {daySessions.length > 0 ? (
                            <div className="space-y-1">
                              {daySessions.map((session) => {
                                const statusColors = getStatusColor(session.attendanceStatus);

                                return (
                                  <div
                                    key={session.id}
                                    className={cn(
                                      'p-2 rounded border text-xs cursor-pointer hover:shadow-md transition-shadow',
                                      statusColors.bg,
                                      statusColors.border,
                                      statusColors.text
                                    )}
                                    onClick={() => onViewDetails?.(session.id)}
                                  >
                                    <div className="font-semibold truncate" title={session.title}>
                                      {session.title}
                                    </div>
                                    <div className="text-[10px] mt-0.5 opacity-80">
                                      {session.startTime} - {session.endTime}
                                    </div>
                                    <div className="text-[10px] truncate opacity-70" title={session.className}>
                                      {session.classCode}
                                    </div>
                                    {session.roomName && (
                                      <div className="text-[10px] truncate opacity-70">
                                        {session.roomName}
                                      </div>
                                    )}
                                    {session.isMakeup && (
                                      <Badge variant="secondary" className="text-[9px] h-4 px-1 mt-1">
                                        Make-up
                                      </Badge>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="h-full min-h-[60px]"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-blue-300 bg-blue-100 dark:bg-blue-900/30" />
                <span className="text-xs">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-green-300 bg-green-100 dark:bg-green-900/30" />
                <span className="text-xs">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-yellow-300 bg-yellow-100 dark:bg-yellow-900/30" />
                <span className="text-xs">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-red-300 bg-red-100 dark:bg-red-900/30" />
                <span className="text-xs">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded border border-gray-300 bg-gray-100 dark:bg-gray-800" />
                <span className="text-xs">Excused</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Click on a session to view details
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
