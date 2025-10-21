import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, ChevronRight, FileText } from 'lucide-react';
import type { StudentRequest } from '@/types/student';
import { format, parseISO } from 'date-fns';

interface PendingRequestsCardProps {
  requests: StudentRequest[];
  onViewAll?: () => void;
  onViewRequest?: (requestId: number) => void;
}

export const PendingRequestsCard = ({
  requests,
  onViewAll,
  onViewRequest,
}: PendingRequestsCardProps) => {
  const getRequestTypeLabel = (type: StudentRequest['type']) => {
    const labels: Record<StudentRequest['type'], string> = {
      absence: 'Absence',
      make_up: 'Make-up Session',
      transfer: 'Class Transfer',
    };
    return labels[type];
  };

  const getRequestTypeIcon = (type: StudentRequest['type']) => {
    const icons = {
      absence: AlertCircle,
      make_up: Clock,
      transfer: FileText,
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: StudentRequest['status']) => {
    const variants: Record<
      StudentRequest['status'],
      { variant: 'default' | 'secondary' | 'destructive'; label: string }
    > = {
      pending: { variant: 'default', label: 'Pending' },
      approved: { variant: 'secondary', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Requests
              {pendingRequests.length > 0 && (
                <Badge variant="default" className="ml-2">
                  {pendingRequests.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Requests awaiting approval</CardDescription>
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
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No pending requests
          </p>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onViewRequest?.(request.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {getRequestTypeIcon(request.type)}
                    <h4 className="font-semibold text-sm">
                      {getRequestTypeLabel(request.type)}
                    </h4>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Class:</span>{' '}
                    {request.className}
                  </p>
                  {request.sessionTitle && (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Session:</span>{' '}
                      {request.sessionTitle}
                    </p>
                  )}
                  {request.targetClassName && (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Target:</span>{' '}
                      {request.targetClassName}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    Submitted: {format(parseISO(request.submittedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>

                {request.reason && (
                  <div className="mt-3 p-2 rounded bg-muted/50">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {request.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
