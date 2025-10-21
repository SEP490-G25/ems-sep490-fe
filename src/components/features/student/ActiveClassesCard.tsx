import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import type { StudentClass } from '@/types/student';

interface ActiveClassesCardProps {
  classes: StudentClass[];
  onViewAll?: () => void;
  onViewClass?: (classId: number) => void;
}

export const ActiveClassesCard = ({ classes, onViewAll, onViewClass }: ActiveClassesCardProps) => {
  const getStatusBadge = (status: StudentClass['status']) => {
    const variants: Record<
      StudentClass['status'],
      { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }
    > = {
      active: { variant: 'default', label: 'Active' },
      completed: { variant: 'secondary', label: 'Completed' },
      upcoming: { variant: 'outline', label: 'Upcoming' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Active Classes
            </CardTitle>
            <CardDescription>Classes you are currently enrolled in</CardDescription>
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
        {classes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No active classes at the moment
          </p>
        ) : (
          <div className="space-y-4">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onViewClass?.(classItem.id)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{classItem.name}</h4>
                      {getStatusBadge(classItem.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {classItem.courseName} ({classItem.courseCode})
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {classItem.subjectName} - {classItem.level}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {classItem.currentSession} / {classItem.totalSessions} sessions
                      </span>
                    </div>
                    <Progress
                      value={(classItem.currentSession / classItem.totalSessions) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Attendance Rate */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <span className={`font-medium ${getAttendanceColor(classItem.attendanceRate)}`}>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {classItem.attendanceRate.toFixed(1)}%
                    </span>
                  </div>

                  {/* Teacher & Schedule */}
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span>Teacher:</span>
                      <span className="font-medium text-foreground">{classItem.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{classItem.schedule}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
