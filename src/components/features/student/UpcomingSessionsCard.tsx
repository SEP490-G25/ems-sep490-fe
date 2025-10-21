import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, ChevronRight } from 'lucide-react';
import type { UpcomingSession } from '@/types/student';
import { format, parseISO } from 'date-fns';

interface UpcomingSessionsCardProps {
  sessions: UpcomingSession[];
  onViewAll?: () => void;
}

export const UpcomingSessionsCard = ({ sessions, onViewAll }: UpcomingSessionsCardProps) => {
  const getModalityIcon = (modalityType: UpcomingSession['modalityType']) => {
    switch (modalityType) {
      case 'online':
        return <Video className="h-4 w-4" />;
      case 'offline':
        return <MapPin className="h-4 w-4" />;
      case 'hybrid':
        return (
          <div className="flex gap-1">
            <MapPin className="h-4 w-4" />
            <Video className="h-4 w-4" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: UpcomingSession['status']) => {
    const variants: Record<UpcomingSession['status'], 'default' | 'secondary' | 'destructive'> = {
      scheduled: 'default',
      cancelled: 'destructive',
      rescheduled: 'secondary',
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your next classes</CardDescription>
          </div>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No upcoming sessions scheduled
          </p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{session.className}</h4>
                      <p className="text-sm text-muted-foreground">
                        Session {session.sessionNumber}: {session.title}
                      </p>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{format(parseISO(session.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {session.startTime} - {session.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getModalityIcon(session.modalityType)}
                      <span>
                        {session.modalityType === 'offline' && session.roomName}
                        {session.modalityType === 'online' && 'Online'}
                        {session.modalityType === 'hybrid' && 'Hybrid'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Teacher: {session.teacherName}
                  </p>
                </div>

                {session.modalityType !== 'offline' && session.zoomLink && (
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <a href={session.zoomLink} target="_blank" rel="noopener noreferrer">
                      <Video className="h-4 w-4 mr-2" />
                      Join
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
