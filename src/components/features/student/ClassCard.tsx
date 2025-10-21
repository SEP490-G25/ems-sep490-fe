import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  MapPin,
  Video,
  User,
  ChevronRight,
  Clock,
} from 'lucide-react';
import type { StudentClass } from '@/types/student';

interface ClassCardProps {
  classItem: StudentClass;
  onViewDetail: (classId: number) => void;
}

export const ClassCard = ({ classItem, onViewDetail }: ClassCardProps) => {
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

  const getModalityBadge = (modalityType: StudentClass['modalityType']) => {
    const config = {
      offline: { icon: MapPin, label: 'Offline', variant: 'outline' as const },
      online: { icon: Video, label: 'Online', variant: 'outline' as const },
      hybrid: { icon: Clock, label: 'Hybrid', variant: 'outline' as const },
    };

    const { icon: Icon, label, variant } = config[modalityType];
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400';
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const progressPercentage = (classItem.currentSession / classItem.totalSessions) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewDetail(classItem.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{classItem.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {classItem.courseName} ({classItem.courseCode})
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {getStatusBadge(classItem.status)}
            {getModalityBadge(classItem.modalityType)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Subject & Level */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subject & Level:</span>
          <span className="font-medium">
            {classItem.subjectName} - {classItem.level}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="font-medium">
              {classItem.currentSession} / {classItem.totalSessions} sessions
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{progressPercentage.toFixed(1)}% complete</p>
        </div>

        {/* Attendance Rate */}
        <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Attendance Rate</span>
          </div>
          <span className={`font-semibold ${getAttendanceColor(classItem.attendanceRate)}`}>
            {classItem.attendanceRate.toFixed(1)}%
          </span>
        </div>

        {/* Teacher & Schedule */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Teacher:</span>
            <span className="font-medium">{classItem.teacherName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Schedule:</span>
            <span className="font-medium text-xs">{classItem.schedule}</span>
          </div>
          {classItem.modalityType === 'offline' && classItem.roomName && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Room:</span>
              <span className="font-medium">{classItem.roomName}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Button variant="outline" className="w-full mt-4" onClick={() => onViewDetail(classItem.id)}>
          View Details
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
