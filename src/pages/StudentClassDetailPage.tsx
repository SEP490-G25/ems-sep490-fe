import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import type { SidebarUser } from '@/types/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionsTab } from '@/components/features/student/SessionsTab';
import { MaterialsTab } from '@/components/features/student/MaterialsTab';
import { GradesTab } from '@/components/features/student/GradesTab';
import {
  ChevronLeft,
  BookOpen,
  Calendar,
  User,
  MapPin,
  Video,
  TrendingUp,
  Clock,
  FileText,
  Award,
} from 'lucide-react';
import type { StudentClassDetail, ClassSession, ClassMaterial, StudentGrade } from '@/types/student';

// Mock data - Replace with RTK Query API call
const mockClassDetail: StudentClassDetail = {
  id: 1,
  code: 'ENG-A1-M01',
  name: 'English A1 - Morning Class',
  courseName: 'English Foundation A1',
  courseCode: 'ENG-A1',
  subjectName: 'English',
  level: 'A1',
  startDate: '2025-09-01',
  endDate: '2025-12-15',
  status: 'active',
  currentSession: 12,
  totalSessions: 48,
  attendanceRate: 95.8,
  teacherName: 'Ms. Sarah Johnson',
  schedule: 'Mon, Wed, Fri - 08:00-10:00',
  modalityType: 'offline',
  roomName: 'Room 301',
  description:
    'Foundation level English course for beginners. This course covers basic grammar, vocabulary, and conversation skills.',
  objectives: [
    'Understand and use familiar everyday expressions',
    'Introduce yourself and others',
    'Ask and answer questions about personal details',
    'Interact in a simple way',
  ],
  sessions: [
    {
      id: 1,
      sessionNumber: 13,
      courseSessionId: 13,
      title: 'Present Continuous Tense',
      description: 'Learn to describe actions happening now',
      scheduledDate: '2025-10-23',
      startTime: '08:00',
      endTime: '10:00',
      teacherName: 'Ms. Sarah Johnson',
      teacherId: 101,
      roomName: 'Room 301',
      modalityType: 'offline',
      status: 'scheduled',
    },
    {
      id: 2,
      sessionNumber: 12,
      courseSessionId: 12,
      title: 'Present Simple Tense',
      scheduledDate: '2025-10-21',
      startTime: '08:00',
      endTime: '10:00',
      teacherName: 'Ms. Sarah Johnson',
      teacherId: 101,
      roomName: 'Room 301',
      modalityType: 'offline',
      status: 'completed',
      attendanceStatus: 'present',
      sessionNote: 'Great participation! Keep practicing the exercises.',
    },
  ] as ClassSession[],
  materials: [
    {
      id: 1,
      title: 'Session 12 - Present Simple Slides',
      type: 'slide',
      fileUrl: '#',
      sessionNumber: 12,
      uploadedAt: '2025-10-20T10:00:00Z',
      uploadedBy: 'Ms. Sarah Johnson',
      fileSize: 2048000,
    },
    {
      id: 2,
      title: 'Grammar Exercises - Present Simple',
      description: 'Practice exercises for present simple tense',
      type: 'worksheet',
      fileUrl: '#',
      sessionNumber: 12,
      uploadedAt: '2025-10-20T10:05:00Z',
      uploadedBy: 'Ms. Sarah Johnson',
      fileSize: 512000,
    },
  ] as ClassMaterial[],
  assessments: [
    {
      id: 1,
      classId: 1,
      className: 'English A1 - Morning Class',
      assessmentType: 'Quiz',
      assessmentName: 'Grammar Quiz 1',
      score: 18,
      maxScore: 20,
      percentage: 90,
      weight: 10,
      date: '2025-10-15',
      feedback: 'Excellent work! You have a strong grasp of basic grammar.',
      teacherName: 'Ms. Sarah Johnson',
    },
  ] as StudentGrade[],
  attendanceSummary: {
    totalSessions: 12,
    presentCount: 11,
    absentCount: 0,
    lateCount: 1,
    excusedCount: 0,
    attendanceRate: 95.8,
  },
};

export const StudentClassDetailPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // TODO: Use classId to fetch class detail from API
  // const { data: classDetail } = useGetClassDetailQuery(classId);
  console.log('Viewing class:', classId); // Temporary - will be removed when API is integrated

  // Convert auth user to sidebar user
  const sidebarUser: SidebarUser = {
    name: user?.fullName || 'Student',
    email: user?.email || '',
    role: 'STUDENT',
    primaryBranch: user?.branches?.[0]
      ? {
          id: user.branches[0].id,
          code: user.branches[0].code,
          name: user.branches[0].name,
        }
      : undefined,
  };

  // TODO: Replace with RTK Query API call
  const classDetail = mockClassDetail;

  const getStatusBadge = (status: StudentClassDetail['status']) => {
    const variants: Record<
      StudentClassDetail['status'],
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

  const getModalityIcon = () => {
    switch (classDetail.modalityType) {
      case 'online':
        return <Video className="h-5 w-5" />;
      case 'offline':
        return <MapPin className="h-5 w-5" />;
      case 'hybrid':
        return <Clock className="h-5 w-5" />;
    }
  };

  const progressPercentage = (classDetail.currentSession / classDetail.totalSessions) * 100;

  return (
    <MainLayout user={sidebarUser} onLogout={logout}>
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate('/student/classes')} className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Classes
          </Button>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{classDetail.name}</h1>
                  {getStatusBadge(classDetail.status)}
                </div>
                <p className="text-lg text-muted-foreground">
                  {classDetail.courseName} ({classDetail.courseCode})
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {classDetail.subjectName} - {classDetail.level}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2 text-base px-4 py-2">
              {getModalityIcon()}
              {classDetail.modalityType.charAt(0).toUpperCase() + classDetail.modalityType.slice(1)}
            </Badge>
          </div>

          {/* Quick Info Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {classDetail.currentSession}/{classDetail.totalSessions}
                </div>
                <Progress value={progressPercentage} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-1">{progressPercentage.toFixed(1)}% complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classDetail.attendanceRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {classDetail.attendanceSummary.presentCount} present, {classDetail.attendanceSummary.lateCount} late
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Teacher
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{classDetail.teacherName}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{classDetail.schedule}</div>
                {classDetail.roomName && (
                  <p className="text-xs text-muted-foreground mt-1">{classDetail.roomName}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description & Objectives */}
          {(classDetail.description || classDetail.objectives) && (
            <Card>
              <CardHeader>
                <CardTitle>About This Class</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {classDetail.description && <p className="text-muted-foreground">{classDetail.description}</p>}

                {classDetail.objectives && classDetail.objectives.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Learning Objectives:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {classDetail.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="sessions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="sessions" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Sessions</span>
                <span className="sm:hidden">Sessions</span>
              </TabsTrigger>
              <TabsTrigger value="materials" className="gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Materials</span>
                <span className="sm:hidden">Files</span>
              </TabsTrigger>
              <TabsTrigger value="grades" className="gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Grades</span>
                <span className="sm:hidden">Grades</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">
              <SessionsTab sessions={classDetail.sessions} />
            </TabsContent>

            <TabsContent value="materials">
              <MaterialsTab materials={classDetail.materials} />
            </TabsContent>

            <TabsContent value="grades">
              <GradesTab grades={classDetail.assessments} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};
