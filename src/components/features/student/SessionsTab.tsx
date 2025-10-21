import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, User, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { ClassSession } from '@/types/student';
import { format, parseISO } from 'date-fns';

interface SessionsTabProps {
  sessions: ClassSession[];
}

export const SessionsTab = ({ sessions }: SessionsTabProps) => {
  const getStatusBadge = (status: ClassSession['status']) => {
    const variants: Record<
      ClassSession['status'],
      { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }
    > = {
      scheduled: { variant: 'default', label: 'Scheduled' },
      completed: { variant: 'secondary', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      rescheduled: { variant: 'outline', label: 'Rescheduled' },
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAttendanceBadge = (status?: ClassSession['attendanceStatus']) => {
    if (!status) return null;

    const config: Record<
      NonNullable<ClassSession['attendanceStatus']>,
      { icon: typeof CheckCircle2; color: string; label: string }
    > = {
      present: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', label: 'Present' },
      absent: { icon: XCircle, color: 'text-red-600 dark:text-red-400', label: 'Absent' },
      late: { icon: AlertCircle, color: 'text-yellow-600 dark:text-yellow-400', label: 'Late' },
      excused: { icon: CheckCircle2, color: 'text-blue-600 dark:text-blue-400', label: 'Excused' },
    };

    const { icon: Icon, color, label } = config[status];
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${color}`}>
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
    );
  };

  const getModalityIcon = (modalityType: ClassSession['modalityType']) => {
    switch (modalityType) {
      case 'online':
        return <Video className="h-4 w-4" />;
      case 'offline':
        return <MapPin className="h-4 w-4" />;
      case 'hybrid':
        return (
          <div className="flex gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <Video className="h-3.5 w-3.5" />
          </div>
        );
    }
  };

  // Group sessions by status for better organization
  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled');
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const otherSessions = sessions.filter((s) => s.status !== 'scheduled' && s.status !== 'completed');

  const renderSessionCard = (session: ClassSession) => (
    <Card key={session.id} className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono">
                Session {session.sessionNumber}
              </Badge>
              {getStatusBadge(session.status)}
            </div>
            <h4 className="font-semibold text-lg">{session.title}</h4>
            {session.description && (
              <p className="text-sm text-muted-foreground mt-1">{session.description}</p>
            )}
          </div>
          {session.attendanceStatus && getAttendanceBadge(session.attendanceStatus)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{format(parseISO(session.scheduledDate), 'MMM dd, yyyy')}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {session.startTime} - {session.endTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{session.teacherName}</span>
          </div>

          <div className="flex items-center gap-2">
            {getModalityIcon(session.modalityType)}
            <span>
              {session.modalityType === 'offline' && session.roomName}
              {session.modalityType === 'online' && 'Online'}
              {session.modalityType === 'hybrid' && 'Hybrid'}
            </span>
          </div>
        </div>

        {session.sessionNote && (
          <div className="mt-3 p-3 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">{session.sessionNote}</p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          {session.materialsUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={session.materialsUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4 mr-2" />
                Materials
              </a>
            </Button>
          )}

          {session.modalityType !== 'offline' && session.zoomLink && session.status === 'scheduled' && (
            <Button variant="default" size="sm" asChild>
              <a href={session.zoomLink} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4 mr-2" />
                Join Session
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Upcoming Sessions ({upcomingSessions.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingSessions.map(renderSessionCard)}
          </div>
        </div>
      )}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Completed Sessions ({completedSessions.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedSessions.map(renderSessionCard)}
          </div>
        </div>
      )}

      {/* Other Sessions (Cancelled/Rescheduled) */}
      {otherSessions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Other Sessions ({otherSessions.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {otherSessions.map(renderSessionCard)}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No sessions scheduled yet</p>
        </div>
      )}
    </div>
  );
};
