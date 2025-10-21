import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import type { SidebarUser } from '@/types/navigation';
import { ClassFilterBar } from '@/components/features/student/ClassFilterBar';
import { ClassCard } from '@/components/features/student/ClassCard';
import type { StudentClass, StudentClassFilter } from '@/types/student';
import { BookOpen } from 'lucide-react';

// Mock data - Replace with RTK Query API call
const mockClasses: StudentClass[] = [
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
  {
    id: 3,
    code: 'ENG-A2-W01',
    name: 'English A2 - Weekend Class',
    courseName: 'English Elementary A2',
    courseCode: 'ENG-A2',
    subjectName: 'English',
    level: 'A2',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    status: 'completed',
    currentSession: 40,
    totalSessions: 40,
    attendanceRate: 92.5,
    teacherName: 'Ms. Emily Chen',
    schedule: 'Sat, Sun - 14:00-16:00',
    modalityType: 'hybrid',
    roomName: 'Room 205',
    zoomLink: 'https://zoom.us/j/9876543210',
  },
  {
    id: 4,
    code: 'IELTS-P01',
    name: 'IELTS Preparation',
    courseName: 'IELTS Intensive Preparation',
    courseCode: 'IELTS-PREP',
    subjectName: 'IELTS',
    level: 'Advanced',
    startDate: '2025-11-01',
    endDate: '2026-01-15',
    status: 'upcoming',
    currentSession: 0,
    totalSessions: 24,
    attendanceRate: 0,
    teacherName: 'Dr. Michael Brown',
    schedule: 'Mon, Wed, Fri - 19:00-21:00',
    modalityType: 'online',
    zoomLink: 'https://zoom.us/j/5555555555',
  },
];

export const StudentClassesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<StudentClassFilter>({
    status: 'all',
    modalityType: 'all',
    searchTerm: '',
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

  // TODO: Replace with RTK Query API call
  const classes = mockClasses;

  // Filter classes based on current filter
  const filteredClasses = classes.filter((classItem) => {
    // Status filter
    if (filter.status && filter.status !== 'all' && classItem.status !== filter.status) {
      return false;
    }

    // Modality filter
    if (
      filter.modalityType &&
      filter.modalityType !== 'all' &&
      classItem.modalityType !== filter.modalityType
    ) {
      return false;
    }

    // Search filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const matchesSearch =
        classItem.name.toLowerCase().includes(searchLower) ||
        classItem.code.toLowerCase().includes(searchLower) ||
        classItem.courseName.toLowerCase().includes(searchLower) ||
        classItem.subjectName.toLowerCase().includes(searchLower);

      if (!matchesSearch) {
        return false;
      }
    }

    return true;
  });

  const handleViewClassDetail = (classId: number) => {
    navigate(`/student/classes/${classId}`);
  };

  return (
    <MainLayout user={sidebarUser} onLogout={logout}>
      <div className="p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">My Classes</h1>
            </div>
            <p className="text-muted-foreground">
              View all your enrolled classes and track your progress
            </p>
          </div>

          {/* Filters */}
          <ClassFilterBar
            filter={filter}
            onFilterChange={setFilter}
            resultCount={filteredClasses.length}
          />

          {/* Classes Grid */}
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground">
                {filter.searchTerm || filter.status !== 'all' || filter.modalityType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'You are not enrolled in any classes yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  onViewDetail={handleViewClassDetail}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
