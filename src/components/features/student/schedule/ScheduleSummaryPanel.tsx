import { Card, CardContent } from '@/components/ui/card';
import type { ScheduleSummary } from '@/types/student';
import { Calendar, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface ScheduleSummaryPanelProps {
  summary: ScheduleSummary;
}

export const ScheduleSummaryPanel = ({ summary }: ScheduleSummaryPanelProps) => {
  const { thisWeek, thisMonth } = summary;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* This Week Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Calendar className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold">This Week</h3>
              <p className="text-sm text-muted-foreground">{thisWeek.totalSessions} sessions</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>Present</span>
              </div>
              <span className="font-medium">{thisWeek.present}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span>Late</span>
              </div>
              <span className="font-medium">{thisWeek.late}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span>Absent</span>
              </div>
              <span className="font-medium">{thisWeek.absent}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span>Excused</span>
              </div>
              <span className="font-medium">{thisWeek.excused}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Planned</span>
              </div>
              <span className="font-medium text-blue-600 dark:text-blue-400">{thisWeek.planned}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Month Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <TrendingUp className="h-5 w-5 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <h3 className="font-semibold">This Month</h3>
              <p className="text-sm text-muted-foreground">{thisMonth.totalSessions} sessions</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {thisMonth.attendanceRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all"
                  style={{ width: `${thisMonth.attendanceRate}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {thisMonth.attendanceRate >= 90
                ? 'Excellent attendance! Keep it up!'
                : thisMonth.attendanceRate >= 80
                ? 'Good attendance. Stay consistent!'
                : 'Your attendance is below 80%. Please improve to avoid academic issues.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Quick Stats</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-muted-foreground">Attended (Week)</span>
              <span className="font-semibold">
                {thisWeek.present + thisWeek.late} / {thisWeek.totalSessions}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-muted-foreground">Perfect Attendance</span>
              <span className="font-semibold">
                {thisWeek.present} / {thisWeek.totalSessions}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-muted-foreground">Upcoming Sessions</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {thisWeek.planned}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
