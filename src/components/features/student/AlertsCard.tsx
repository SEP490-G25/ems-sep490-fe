import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertsCardProps {
  alerts: Alert[];
}

export const AlertsCard = ({ alerts }: AlertsCardProps) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'info':
        return <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getAlertBadge = (type: Alert['type']) => {
    const config: Record<Alert['type'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      warning: { variant: 'default', label: 'Warning' },
      error: { variant: 'destructive', label: 'Alert' },
      success: { variant: 'secondary', label: 'Success' },
      info: { variant: 'outline', label: 'Info' },
    };

    const { variant, label } = config[type];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getAlertBorderColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20';
      case 'error':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20';
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20';
      case 'info':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  if (alerts.length === 0) {
    return null; // Don't show the card if there are no alerts
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Alerts & Notifications
        </CardTitle>
        <CardDescription>Important updates and reminders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertBorderColor(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    {getAlertBadge(alert.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  {alert.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={alert.action.onClick}
                      className="mt-3"
                    >
                      {alert.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
