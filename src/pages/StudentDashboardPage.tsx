import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import type { SidebarUser } from '@/types/navigation';
import { DashboardStatsCard } from '@/components/features/student/DashboardStatsCard';
import { UpcomingSessionsCard } from '@/components/features/student/UpcomingSessionsCard';
import { ActiveClassesCard } from '@/components/features/student/ActiveClassesCard';
import { PendingRequestsCard } from '@/components/features/student/PendingRequestsCard';
import { RecentScoresCard } from '@/components/features/student/RecentScoresCard';
import { AlertsCard } from '@/components/features/student/AlertsCard';
import {
  BookOpen,
  Calendar,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  Clock,
} from 'lucide-react';
import type {
  StudentDashboardData,
  UpcomingSession,
  StudentClass,
  StudentRequest,
  StudentGrade,
} from '@/types/student';

// Mock data for demonstration - Replace with actual API calls
const mockDashboardData: StudentDashboardData = {
  stats: {
    totalClasses: 3,
    activeClasses: 2,
    completedClasses: 1,
    overallAttendanceRate: 92.5,
    totalSessions: 48,
    attendedSessions: 44,
    pendingRequests: 1,
    upcomingSessions: 3,
  },
  upcomingSessions: [
    {
      id: 1,
      classId: 1,
      className: 'English A1 - Morning Class',
      sessionNumber: 12,
      title: 'Present Simple Tense',
      date: '2025-10-22',
      startTime: '08:00',
      endTime: '10:00',
      teacherName: 'Ms. Sarah Johnson',
      roomName: 'Room 301',
      modalityType: 'offline',
      status: 'scheduled',
    },
    {
      id: 2,
      classId: 2,
      className: 'Business English B1',
      sessionNumber: 8,
      title: 'Business Presentations',
      date: '2025-10-23',
      startTime: '18:00',
      endTime: '20:00',
      teacherName: 'Mr. David Lee',
      zoomLink: 'https://zoom.us/j/1234567890',
      modalityType: 'online',
      status: 'scheduled',
    },
    {
      id: 3,
      classId: 1,
      className: 'English A1 - Morning Class',
      sessionNumber: 13,
      title: 'Vocabulary: Daily Activities',
      date: '2025-10-24',
      startTime: '08:00',
      endTime: '10:00',
      teacherName: 'Ms. Sarah Johnson',
      roomName: 'Room 301',
      modalityType: 'offline',
      status: 'scheduled',
    },
  ] as UpcomingSession[],
  recentAttendance: [],
  activeClasses: [
    {
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
    },
    {
      id: 2,
      code: 'BUS-B1-E01',
      name: 'Business English B1',
      courseName: 'Business English Intermediate',
      courseCode: 'BUS-B1',
      subjectName: 'Business English',
      level: 'B1',
      startDate: '2025-09-15',
      endDate: '2026-01-30',
      status: 'active',
      currentSession: 8,
      totalSessions: 36,
      attendanceRate: 88.9,
      teacherName: 'Mr. David Lee',
      schedule: 'Tue, Thu - 18:00-20:00',
      modalityType: 'online',
      zoomLink: 'https://zoom.us/j/1234567890',
    },
  ] as StudentClass[],
  pendingRequests: [
    {
      id: 1,
      type: 'absence',
      classId: 1,
      className: 'English A1 - Morning Class',
      sessionId: 15,
      sessionTitle: 'Session 15: Past Simple Tense',
      reason: 'Medical appointment - doctor\'s certificate will be provided',
      status: 'pending',
      submittedAt: '2025-10-20T10:30:00Z',
    },
  ] as StudentRequest[],
};

// Mock recent grades
const mockRecentGrades: StudentGrade[] = [
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
    feedback: 'Excellent work!',
    teacherName: 'Ms. Sarah Johnson',
  },
  {
    id: 2,
    classId: 2,
    className: 'Business English B1',
    assessmentType: 'Presentation',
    assessmentName: 'Business Presentation',
    score: 42,
    maxScore: 50,
    percentage: 84,
    weight: 20,
    date: '2025-10-10',
    teacherName: 'Mr. David Lee',
  },
  {
    id: 3,
    classId: 1,
    className: 'English A1 - Morning Class',
    assessmentType: 'Test',
    assessmentName: 'Vocabulary Test 3',
    score: 22,
    maxScore: 25,
    percentage: 88,
    weight: 15,
    date: '2025-10-08',
    teacherName: 'Ms. Sarah Johnson',
  },
];

// Mock alerts
const mockAlerts = [
  {
    id: '1',
    type: 'info' as const,
    title: 'Session Reminder',
    message: 'Your next class starts tomorrow at 8:00 AM - English A1',
  },
];

export const StudentDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  // TODO: Replace with actual API call using RTK Query
  const dashboardData = mockDashboardData;

  return (
    <MainLayout user={sidebarUser} onLogout={logout}>
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.fullName || 'Student'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardStatsCard
              title="Active Classes"
              value={dashboardData.stats.activeClasses}
              description={`${dashboardData.stats.totalClasses} total classes`}
              icon={BookOpen}
            />
            <DashboardStatsCard
              title="Attendance Rate"
              value={`${dashboardData.stats.overallAttendanceRate.toFixed(1)}%`}
              description={`${dashboardData.stats.attendedSessions}/${dashboardData.stats.totalSessions} sessions`}
              icon={TrendingUp}
            />
            <DashboardStatsCard
              title="Upcoming Sessions"
              value={dashboardData.stats.upcomingSessions}
              description="In the next 7 days"
              icon={Calendar}
            />
            <DashboardStatsCard
              title="Pending Requests"
              value={dashboardData.stats.pendingRequests}
              description="Awaiting approval"
              icon={AlertCircle}
            />
          </div>

          {/* Alerts Section */}
          {mockAlerts.length > 0 && <AlertsCard alerts={mockAlerts} />}

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upcoming Sessions */}
            <UpcomingSessionsCard
              sessions={dashboardData.upcomingSessions.slice(0, 3)}
              onViewAll={() => navigate('/student/schedule')}
            />

            {/* Recent Scores */}
            <RecentScoresCard
              grades={mockRecentGrades.slice(0, 5)}
              onViewAll={() => {
                // TODO: Navigate to grades page
                console.log('View all grades');
              }}
            />
          </div>

          {/* Second Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pending Requests */}
            <PendingRequestsCard
              requests={dashboardData.pendingRequests}
              onViewAll={() => {
                // TODO: Navigate to requests page
                console.log('View all requests');
              }}
              onViewRequest={(requestId) => {
                // TODO: Navigate to request detail
                console.log('View request:', requestId);
              }}
            />
          </div>

          {/* Active Classes */}
          <ActiveClassesCard
            classes={dashboardData.activeClasses}
            onViewAll={() => navigate('/student/classes')}
            onViewClass={(classId) => navigate(`/student/classes/${classId}`)}
          />

          {/* Quick Actions Section */}
          <div className="grid gap-4 md:grid-cols-3">
            <div
              className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate('/student/classes')}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">My Classes</h3>
                  <p className="text-sm text-muted-foreground">View all enrolled classes</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">My Grades</h3>
                  <p className="text-sm text-muted-foreground">View your performance</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Submit Request</h3>
                  <p className="text-sm text-muted-foreground">Absence, make-up, transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
