import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ScheduleSession } from '@/types/student';
import {
  Clock,
  MapPin,
  Video,
  User,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  session: ScheduleSession;
  showDate?: boolean;
  compact?: boolean;
  onViewDetails?: (sessionId: number) => void;
  onSubmitAbsence?: (sessionId: number) => void;
}

// Color coding based on attendance status (from spec)
const getStatusColor = (
  status: ScheduleSession['attendanceStatus']
): { bg: string; text: string; border: string } => {
  switch (status) {
    case 'present':
      return { bg: 'bg-green-50 dark:bg-green-950', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' };
    case 'absent':
      return { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' };
    case 'late':
      return { bg: 'bg-yellow-50 dark:bg-yellow-950', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' };
    case 'excused':
      return { bg: 'bg-gray-50 dark:bg-gray-900', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' };
    case 'planned':
      return { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' };
    default:
      return { bg: 'bg-background', text: 'text-foreground', border: 'border-border' };
  }
};

const getStatusLabel = (status: ScheduleSession['attendanceStatus']): string => {
  switch (status) {
    case 'present':
      return 'Present';
    case 'absent':
      return 'Absent';
    case 'late':
      return 'Late';
    case 'excused':
      return 'Excused';
    case 'planned':
      return 'Planned';
    default:
      return status;
  }
};

export const SessionCard = ({
  session,
  showDate = true,
  compact = false,
  onViewDetails,
  onSubmitAbsence,
}: SessionCardProps) => {
  const statusColors = getStatusColor(session.attendanceStatus);
  const isUpcoming = session.attendanceStatus === 'planned';
  const sessionDate = parseISO(session.date);

  return (
    <Card
      className={cn(
        'transition-colors hover:shadow-md',
        statusColors.border,
        statusColors.bg
      )}
    >
      <CardContent className={cn('p-4', compact && 'p-3')}>
        <div className="flex flex-col space-y-3">
          {/* Header: Class and Session Info */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-xs">
                  {session.classCode}
                </Badge>
                {session.isMakeup && (
                  <Badge variant="secondary" className="text-xs">
                    Make-up
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={cn('text-xs', statusColors.text)}
                >
                  {getStatusLabel(session.attendanceStatus)}
                </Badge>
              </div>
              <h3 className={cn('font-semibold mt-1', compact ? 'text-sm' : 'text-base')}>
                Session {session.sessionNumber}: {session.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {session.className}
              </p>
            </div>
          </div>

          {/* Session Details */}
          <div className="grid gap-2 text-sm">
            {showDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>
                  {format(sessionDate, 'EEE, MMM dd, yyyy')} • {session.startTime} - {session.endTime}
                </span>
              </div>
            )}

            {!showDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>
                  {session.startTime} - {session.endTime}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span>{session.teacherName}</span>
            </div>

            {session.modalityType === 'offline' && session.roomName && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{session.roomName}</span>
              </div>
            )}

            {(session.modalityType === 'online' || session.modalityType === 'hybrid') &&
              session.zoomLink && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Video className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {isUpcoming ? (
                      <a
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Join Zoom Session
                      </a>
                    ) : (
                      'Online Session'
                    )}
                  </span>
                </div>
              )}

            {session.note && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="text-xs">{session.note}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!compact && (
            <div className="flex items-center gap-2 pt-2">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(session.id)}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Details
                </Button>
              )}
              {isUpcoming && onSubmitAbsence && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSubmitAbsence(session.id)}
                  className="flex-1"
                >
                  Submit Absence
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
