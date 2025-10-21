import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import type { SidebarUser } from '@/types/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleCalendarView } from '@/components/features/student/schedule/ScheduleCalendarView';
import { ScheduleListView } from '@/components/features/student/schedule/ScheduleListView';
import { ScheduleSummaryPanel } from '@/components/features/student/schedule/ScheduleSummaryPanel';
import { ScheduleFilters } from '@/components/features/student/schedule/ScheduleFilters';
import type { ScheduleSession, ScheduleSummary, ScheduleFilter } from '@/types/student';

// Mock data - Replace with actual API calls
const mockScheduleSessions: ScheduleSession[] = [
  // Previous sessions (past)
  {
    id: 1,
    classId: 1,
    className: 'English A1 - Morning Class',
    classCode: 'ENG-A1-M01',
    sessionNumber: 10,
    title: 'Present Continuous Tense',
    date: '2025-10-15',
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    teacherName: 'Ms. Sarah Johnson',
    teacherId: 1,
    roomName: 'Room 301',
    modalityType: 'offline',
    attendanceStatus: 'present',
    isMakeup: false,
  },
  {
    id: 2,
    classId: 2,
    className: 'Business English B1',
    classCode: 'BUS-B1-E01',
    sessionNumber: 6,
    title: 'Email Writing',
    date: '2025-10-16',
    startTime: '18:00',
    endTime: '20:00',
    duration: 120,
    teacherName: 'Mr. David Lee',
    teacherId: 2,
    zoomLink: 'https://zoom.us/j/1234567890',
    modalityType: 'online',
    attendanceStatus: 'present',
    isMakeup: false,
  },
  {
    id: 3,
    classId: 1,
    className: 'English A1 - Morning Class',
    classCode: 'ENG-A1-M01',
    sessionNumber: 11,
    title: 'Reading Comprehension',
    date: '2025-10-17',
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    teacherName: 'Ms. Sarah Johnson',
    teacherId: 1,
    roomName: 'Room 301',
    modalityType: 'offline',
    attendanceStatus: 'late',
    isMakeup: false,
    note: 'Arrived 15 minutes late',
  },
  // Upcoming sessions (future)
  {
    id: 4,
    classId: 1,
    className: 'English A1 - Morning Class',
    classCode: 'ENG-A1-M01',
    sessionNumber: 12,
    title: 'Present Simple Tense',
    date: '2025-10-22',
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    teacherName: 'Ms. Sarah Johnson',
    teacherId: 1,
    roomName: 'Room 301',
    modalityType: 'offline',
    attendanceStatus: 'planned',
    isMakeup: false,
  },
  {
    id: 5,
    classId: 2,
    className: 'Business English B1',
    classCode: 'BUS-B1-E01',
    sessionNumber: 8,
    title: 'Business Presentations',
    date: '2025-10-23',
    startTime: '18:00',
    endTime: '20:00',
    duration: 120,
    teacherName: 'Mr. David Lee',
    teacherId: 2,
    zoomLink: 'https://zoom.us/j/1234567890',
    modalityType: 'online',
    attendanceStatus: 'planned',
    isMakeup: false,
  },
  {
    id: 6,
    classId: 1,
    className: 'English A1 - Morning Class',
    classCode: 'ENG-A1-M01',
    sessionNumber: 13,
    title: 'Vocabulary: Daily Activities',
    date: '2025-10-24',
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    teacherName: 'Ms. Sarah Johnson',
    teacherId: 1,
    roomName: 'Room 301',
    modalityType: 'offline',
    attendanceStatus: 'planned',
    isMakeup: false,
  },
  {
    id: 7,
    classId: 2,
    className: 'Business English B1',
    classCode: 'BUS-B1-E01',
    sessionNumber: 9,
    title: 'Negotiation Skills',
    date: '2025-10-25',
    startTime: '18:00',
    endTime: '20:00',
    duration: 120,
    teacherName: 'Mr. David Lee',
    teacherId: 2,
    zoomLink: 'https://zoom.us/j/1234567890',
    modalityType: 'online',
    attendanceStatus: 'planned',
    isMakeup: false,
  },
  {
    id: 8,
    classId: 1,
    className: 'English A1 - Morning Class',
    classCode: 'ENG-A1-M01',
    sessionNumber: 14,
    title: 'Listening Practice',
    date: '2025-10-29',
    startTime: '08:00',
    endTime: '10:00',
    duration: 120,
    teacherName: 'Ms. Sarah Johnson',
    teacherId: 1,
    roomName: 'Room 301',
    modalityType: 'offline',
    attendanceStatus: 'planned',
    isMakeup: false,
  },
  // Make-up session example
  {
    id: 9,
    classId: 3,
    className: 'English A1 - Evening Class',
    classCode: 'ENG-A1-E02',
    sessionNumber: 11,
    title: 'Reading Comprehension (Make-up)',
    date: '2025-10-26',
    startTime: '18:00',
    endTime: '20:00',
    duration: 120,
    teacherName: 'Mr. John Smith',
    teacherId: 3,
    roomName: 'Room 205',
    modalityType: 'offline',
    attendanceStatus: 'planned',
    isMakeup: true,
    note: 'Make-up for Session 11 missed on Oct 17',
  },
];

const mockScheduleSummary: ScheduleSummary = {
  thisWeek: {
    totalSessions: 5,
    present: 2,
    absent: 0,
    late: 1,
    excused: 0,
    planned: 3,
  },
  thisMonth: {
    totalSessions: 18,
    attendanceRate: 94.4,
  },
};

// Mock class list for filter dropdown
const mockClassOptions = [
  { id: 1, name: 'English A1 - Morning Class', code: 'ENG-A1-M01' },
  { id: 2, name: 'Business English B1', code: 'BUS-B1-E01' },
];

export const StudentSchedulePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('list'); // Default to list (mobile-first)
  const [filters, setFilters] = useState<ScheduleFilter>({
    classId: null,
    attendanceStatus: 'all',
  });

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

  // Filter sessions based on current filters
  const filteredSessions = mockScheduleSessions.filter((session) => {
    if (filters.classId && session.classId !== filters.classId) return false;
    if (
      filters.attendanceStatus &&
      filters.attendanceStatus !== 'all' &&
      session.attendanceStatus !== filters.attendanceStatus
    )
      return false;
    if (filters.dateFrom && session.date < filters.dateFrom) return false;
    if (filters.dateTo && session.date > filters.dateTo) return false;
    return true;
  });

  const handleFilterChange = (newFilters: ScheduleFilter) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleViewDetails = (sessionId: number) => {
    // TODO: Navigate to session detail page or open modal
    console.log('View details for session:', sessionId);
  };

  const handleSubmitAbsence = (sessionId: number) => {
    // TODO: Navigate to absence request form with pre-filled session
    console.log('Submit absence for session:', sessionId);
  };

  const handleViewMaterials = (sessionId: number) => {
    // TODO: Navigate to materials page or open materials modal
    console.log('View materials for session:', sessionId);
  };

  return (
    <MainLayout user={sidebarUser} onLogout={logout}>
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">My Schedule</h1>
            <p className="text-muted-foreground mt-1">
              View your class schedule and attendance history
            </p>
          </div>

          {/* Summary Panel */}
          <ScheduleSummaryPanel summary={mockScheduleSummary} />

          {/* Filters and Tabs in same row */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'calendar' | 'list')}>
            <div className="flex flex-col justify-between lg:flex-row lg:items-end gap-4">
              {/* Filters */}
              <ScheduleFilters
                classOptions={mockClassOptions}
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />

              {/* Tabs */}
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Timetable View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="mt-6">
              <ScheduleListView
                sessions={filteredSessions}
                onViewDetails={handleViewDetails}
                onSubmitAbsence={handleSubmitAbsence}
                onViewMaterials={handleViewMaterials}
              />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <ScheduleCalendarView sessions={filteredSessions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};
