/**
 * Student-related TypeScript type definitions
 * These types represent data structures for the student role
 */

export interface StudentClass {
  id: number;
  code: string;
  name: string;
  courseName: string;
  courseCode: string;
  subjectName: string;
  level: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming' | 'cancelled';
  currentSession: number;
  totalSessions: number;
  attendanceRate: number;
  teacherName: string;
  schedule: string; // e.g., "Mon, Wed, Fri - 18:00-20:00"
  modalityType: 'offline' | 'online' | 'hybrid';
  roomName?: string;
  zoomLink?: string;
}

export interface UpcomingSession {
  id: number;
  classId: number;
  className: string;
  sessionNumber: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  teacherName: string;
  roomName?: string;
  zoomLink?: string;
  modalityType: 'offline' | 'online' | 'hybrid';
  status: 'scheduled' | 'cancelled' | 'rescheduled';
}

export interface AttendanceRecord {
  id: number;
  sessionId: number;
  classId: number;
  className: string;
  sessionNumber: number;
  sessionTitle: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
  markedAt: string;
  markedBy: string;
}

export interface StudentRequest {
  id: number;
  type: 'absence' | 'make_up' | 'transfer';
  classId: number;
  className: string;
  sessionId?: number;
  sessionTitle?: string;
  targetSessionId?: number;
  targetClassName?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export interface StudentGrade {
  id: number;
  classId: number;
  className: string;
  assessmentType: string;
  assessmentName: string;
  score: number;
  maxScore: number;
  percentage: number;
  weight: number;
  date: string;
  feedback?: string;
  teacherName: string;
}

export interface StudentDashboardStats {
  totalClasses: number;
  activeClasses: number;
  completedClasses: number;
  overallAttendanceRate: number;
  totalSessions: number;
  attendedSessions: number;
  pendingRequests: number;
  upcomingSessions: number;
}

export interface StudentDashboardData {
  stats: StudentDashboardStats;
  upcomingSessions: UpcomingSession[];
  recentAttendance: AttendanceRecord[];
  activeClasses: StudentClass[];
  pendingRequests: StudentRequest[];
}

// Extended types for Student Class Detail Page
export interface ClassSession {
  id: number;
  sessionNumber: number;
  courseSessionId: number;
  title: string;
  description?: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  teacherName: string;
  teacherId: number;
  roomName?: string;
  zoomLink?: string;
  modalityType: 'offline' | 'online' | 'hybrid';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  attendanceStatus?: 'present' | 'absent' | 'late' | 'excused';
  sessionNote?: string;
  materialsUrl?: string;
}

export interface StudentClassDetail extends StudentClass {
  description?: string;
  objectives?: string[];
  prerequisites?: string[];
  phaseId?: number;
  phaseName?: string;
  sessions: ClassSession[];
  materials: ClassMaterial[];
  assessments: StudentGrade[];
  attendanceSummary: {
    totalSessions: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendanceRate: number;
  };
}

export interface ClassMaterial {
  id: number;
  title: string;
  description?: string;
  type: 'slide' | 'worksheet' | 'video' | 'audio' | 'document' | 'other';
  fileUrl: string;
  sessionId?: number;
  sessionNumber?: number;
  uploadedAt: string;
  uploadedBy: string;
  fileSize?: number;
}

export interface StudentClassFilter {
  status?: 'active' | 'completed' | 'upcoming' | 'cancelled' | 'all';
  subjectId?: number;
  level?: string;
  modalityType?: 'offline' | 'online' | 'hybrid' | 'all';
  searchTerm?: string;
}

// Schedule-specific types
export interface ScheduleSession {
  id: number;
  classId: number;
  className: string;
  classCode: string;
  sessionNumber: number;
  title: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  duration: number; // in minutes
  teacherName: string;
  teacherId: number;
  roomName?: string;
  zoomLink?: string;
  modalityType: 'offline' | 'online' | 'hybrid';
  attendanceStatus: 'present' | 'absent' | 'late' | 'excused' | 'planned';
  isMakeup: boolean;
  note?: string; // Reason for absence/late if applicable
}

export interface ScheduleSummary {
  thisWeek: {
    totalSessions: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    planned: number;
  };
  thisMonth: {
    totalSessions: number;
    attendanceRate: number;
  };
}

export interface ScheduleFilter {
  classId?: number | null;
  dateFrom?: string;
  dateTo?: string;
  attendanceStatus?: 'present' | 'absent' | 'late' | 'excused' | 'planned' | 'all';
}
