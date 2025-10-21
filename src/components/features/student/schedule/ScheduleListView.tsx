import { useMemo } from 'react';
import { SessionCard } from './SessionCard';
import type { ScheduleSession } from '@/types/student';
import { format, parseISO } from 'date-fns';

interface ScheduleListViewProps {
  sessions: ScheduleSession[];
  onViewDetails?: (sessionId: number) => void;
  onSubmitAbsence?: (sessionId: number) => void;
  onViewMaterials?: (sessionId: number) => void;
}

interface GroupedSessions {
  date: string;
  sessions: ScheduleSession[];
}

export const ScheduleListView = ({
  sessions,
  onViewDetails,
  onSubmitAbsence,
  onViewMaterials,
}: ScheduleListViewProps) => {
  // Group sessions by date
  const groupedSessions = useMemo<GroupedSessions[]>(() => {
    const groups = new Map<string, ScheduleSession[]>();

    sessions.forEach((session) => {
      const existing = groups.get(session.date) || [];
      groups.set(session.date, [...existing, session]);
    });

    // Sort each group by start time
    groups.forEach((sessionList) => {
      sessionList.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    // Convert to array and sort by date (newest first)
    return Array.from(groups.entries())
      .map(([date, sessions]) => ({ date, sessions }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [sessions]);

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sessions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedSessions.map(({ date, sessions }) => {
        const dateObj = parseISO(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sessionDate = new Date(dateObj);
        sessionDate.setHours(0, 0, 0, 0);

        const isToday = sessionDate.getTime() === today.getTime();
        const isFuture = sessionDate > today;

        return (
          <div key={date} className="space-y-3">
            {/* Date Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {format(dateObj, 'EEEE, MMMM dd, yyyy')}
                {isToday && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                    Today
                  </span>
                )}
                {isFuture && !isToday && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    Upcoming
                  </span>
                )}
              </h3>
            </div>

            {/* Sessions for this date */}
            <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  showDate={false} // Date is shown in header
                  onViewDetails={onViewDetails}
                  onSubmitAbsence={onSubmitAbsence}
                  onViewMaterials={onViewMaterials}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
