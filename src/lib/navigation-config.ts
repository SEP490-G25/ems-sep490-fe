import {
  LayoutDashboard,
  Users,
  Settings,
  Building2,
  FileText,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  Target,
  FolderOpen,
  Send,
  BarChart3,
  Clock,
  CheckSquare,
  MessageSquare,
  Award,
  School,
} from 'lucide-react';
import type { RoleNavigation, UserRole } from '@/types/navigation';

/**
 * Navigation configuration for all user roles
 * Based on business-context.md section 2.1 - Role Hierarchy
 */

export const navigationConfig: Record<UserRole, RoleNavigation> = {
  /**
   * ADMIN - System Administrator
   * Full system access, user management, system configuration
   */
  ADMIN: {
    role: 'ADMIN',
    roleName: 'System Administrator',
    navMain: [
      {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'User Management',
        url: '/admin/users',
        icon: Users,
        items: [
          { title: 'All Users', url: '/admin/users' },
          { title: 'Roles & Permissions', url: '/admin/users/roles' },
          { title: 'Create User', url: '/admin/users/create' },
        ],
      },
      {
        title: 'Organizations',
        url: '/admin/organizations',
        icon: Building2,
        items: [
          { title: 'Centers', url: '/admin/organizations/centers' },
          { title: 'Branches', url: '/admin/organizations/branches' },
          { title: 'Resources', url: '/admin/organizations/resources' },
        ],
      },
      {
        title: 'System Settings',
        url: '/admin/settings',
        icon: Settings,
        items: [
          { title: 'General', url: '/admin/settings/general' },
          { title: 'Capacity Policies', url: '/admin/settings/capacity' },
          { title: 'Attendance Lock', url: '/admin/settings/attendance-lock' },
          { title: 'Request Lead Times', url: '/admin/settings/request-lead-times' },
        ],
      },
      {
        title: 'Audit Logs',
        url: '/admin/audit-logs',
        icon: FileText,
      },
    ],
  },

  /**
   * MANAGER - Operations Manager
   * System-wide operational excellence, strategic decisions, course approval
   */
  MANAGER: {
    role: 'MANAGER',
    roleName: 'Operations Manager',
    navMain: [
      {
        title: 'Dashboard',
        url: '/manager/dashboard',
        icon: LayoutDashboard,
        items: [
          { title: 'Executive Overview', url: '/manager/dashboard' },
          { title: 'Branch Performance', url: '/manager/dashboard/branches' },
          { title: 'KPIs', url: '/manager/dashboard/kpis' },
        ],
      },
      {
        title: 'Curriculum',
        url: '/manager/curriculum',
        icon: BookOpen,
        items: [
          { title: 'Pending Approval', url: '/manager/curriculum/pending', badge: '3' },
          { title: 'Approved Courses', url: '/manager/curriculum/approved' },
          { title: 'All Courses', url: '/manager/curriculum/all' },
        ],
      },
      {
        title: 'Classes',
        url: '/manager/classes',
        icon: School,
        items: [
          { title: 'Pending Approval', url: '/manager/classes/pending', badge: '5' },
          { title: 'All Classes', url: '/manager/classes/all' },
          { title: 'Cross-Branch', url: '/manager/classes/cross-branch' },
        ],
      },
      {
        title: 'Teachers',
        url: '/manager/teachers',
        icon: GraduationCap,
        items: [
          { title: 'All Teachers', url: '/manager/teachers' },
          { title: 'Workload', url: '/manager/teachers/workload' },
          { title: 'Cross-Branch Assignment', url: '/manager/teachers/cross-branch' },
        ],
      },
      {
        title: 'Students',
        url: '/manager/students',
        icon: Users,
        items: [
          { title: 'Enrollment Trends', url: '/manager/students/trends' },
          { title: 'Performance Analytics', url: '/manager/students/performance' },
          { title: 'All Students', url: '/manager/students/all' },
        ],
      },
      {
        title: 'Resources',
        url: '/manager/resources',
        icon: Building2,
        items: [
          { title: 'Utilization', url: '/manager/resources/utilization' },
          { title: 'Optimization', url: '/manager/resources/optimization' },
        ],
      },
      {
        title: 'Reports',
        url: '/manager/reports',
        icon: BarChart3,
        items: [
          { title: 'Enrollment', url: '/manager/reports/enrollment' },
          { title: 'Attendance', url: '/manager/reports/attendance' },
          { title: 'Quality', url: '/manager/reports/quality' },
          { title: 'Resource Utilization', url: '/manager/reports/resources' },
        ],
      },
      {
        title: 'Requests',
        url: '/manager/requests',
        icon: ClipboardList,
        items: [
          { title: 'Escalated Issues', url: '/manager/requests/escalated', badge: '2' },
          { title: 'All Requests', url: '/manager/requests/all' },
        ],
      },
    ],
  },

  /**
   * CENTER_HEAD - Branch Director
   * Direct branch management, operational approvals, resource management
   */
  CENTER_HEAD: {
    role: 'CENTER_HEAD',
    roleName: 'Branch Director',
    navMain: [
      {
        title: 'Dashboard',
        url: '/center-head/dashboard',
        icon: LayoutDashboard,
        items: [
          { title: 'Branch Overview', url: '/center-head/dashboard' },
          { title: 'Branch KPIs', url: '/center-head/dashboard/kpis' },
        ],
      },
      {
        title: 'Classes',
        url: '/center-head/classes',
        icon: School,
        items: [
          { title: 'Pending Approval', url: '/center-head/classes/pending', badge: '4' },
          { title: 'Active Classes', url: '/center-head/classes/active' },
          { title: 'All Classes', url: '/center-head/classes/all' },
        ],
      },
      {
        title: 'Teachers',
        url: '/center-head/teachers',
        icon: GraduationCap,
        items: [
          { title: 'Branch Teachers', url: '/center-head/teachers' },
          { title: 'Schedule', url: '/center-head/teachers/schedule' },
          { title: 'Performance', url: '/center-head/teachers/performance' },
        ],
      },
      {
        title: 'Students',
        url: '/center-head/students',
        icon: Users,
        items: [
          { title: 'Enrollment', url: '/center-head/students/enrollment' },
          { title: 'Attendance', url: '/center-head/students/attendance' },
          { title: 'All Students', url: '/center-head/students/all' },
        ],
      },
      {
        title: 'Resources',
        url: '/center-head/resources',
        icon: Building2,
        items: [
          { title: 'Rooms', url: '/center-head/resources/rooms' },
          { title: 'Zoom Accounts', url: '/center-head/resources/zoom' },
          { title: 'Time Slots', url: '/center-head/resources/time-slots' },
        ],
      },
      {
        title: 'Requests',
        url: '/center-head/requests',
        icon: ClipboardList,
        items: [
          { title: 'Student Requests', url: '/center-head/requests/students', badge: '7' },
          { title: 'Teacher Requests', url: '/center-head/requests/teachers', badge: '3' },
          { title: 'All Requests', url: '/center-head/requests/all' },
        ],
      },
      {
        title: 'Reports',
        url: '/center-head/reports',
        icon: BarChart3,
        items: [
          { title: 'Branch Performance', url: '/center-head/reports/performance' },
          { title: 'Quality', url: '/center-head/reports/quality' },
          { title: 'Attendance', url: '/center-head/reports/attendance' },
        ],
      },
    ],
  },

  /**
   * SUBJECT_LEADER - Curriculum Designer
   * Curriculum design, course creation, learning outcomes, materials
   */
  SUBJECT_LEADER: {
    role: 'SUBJECT_LEADER',
    roleName: 'Subject Leader',
    navMain: [
      {
        title: 'Dashboard',
        url: '/subject-leader/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Subjects',
        url: '/subject-leader/subjects',
        icon: BookOpen,
        items: [
          { title: 'All Subjects', url: '/subject-leader/subjects' },
          { title: 'Levels', url: '/subject-leader/subjects/levels' },
          { title: 'Create Subject', url: '/subject-leader/subjects/create' },
        ],
      },
      {
        title: 'Courses',
        url: '/subject-leader/courses',
        icon: GraduationCap,
        items: [
          { title: 'My Courses', url: '/subject-leader/courses' },
          { title: 'Create Course', url: '/subject-leader/courses/create' },
          { title: 'Phases & Sessions', url: '/subject-leader/courses/phases' },
        ],
      },
      {
        title: 'Learning Outcomes',
        url: '/subject-leader/outcomes',
        icon: Target,
        items: [
          { title: 'PLO - Program Outcomes', url: '/subject-leader/outcomes/plo' },
          { title: 'CLO - Course Outcomes', url: '/subject-leader/outcomes/clo' },
          { title: 'Session Mapping', url: '/subject-leader/outcomes/mapping' },
        ],
      },
      {
        title: 'Materials',
        url: '/subject-leader/materials',
        icon: FolderOpen,
        items: [
          { title: 'Course Materials', url: '/subject-leader/materials/courses' },
          { title: 'Session Materials', url: '/subject-leader/materials/sessions' },
          { title: 'Upload', url: '/subject-leader/materials/upload' },
        ],
      },
      {
        title: 'Submissions',
        url: '/subject-leader/submissions',
        icon: Send,
        items: [
          { title: 'Pending Approval', url: '/subject-leader/submissions/pending', badge: '2' },
          { title: 'Approved', url: '/subject-leader/submissions/approved' },
          { title: 'Rejected', url: '/subject-leader/submissions/rejected' },
        ],
      },
    ],
  },

  /**
   * ACADEMIC_STAFF - Giáo vụ (KEY OPERATIONAL ROLE)
   * Class creation, enrollment, resource assignment, request processing
   */
  ACADEMIC_STAFF: {
    role: 'ACADEMIC_STAFF',
    roleName: 'Academic Staff',
    navMain: [
      {
        title: 'Dashboard',
        url: '/academic-staff/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Classes',
        url: '/academic-staff/classes',
        icon: School,
        items: [
          { title: 'My Classes', url: '/academic-staff/classes' },
          { title: 'Create Class', url: '/academic-staff/classes/create' },
          { title: 'Draft Classes', url: '/academic-staff/classes/drafts' },
        ],
      },
      {
        title: 'Enrollment',
        url: '/academic-staff/enrollment',
        icon: Users,
        items: [
          { title: 'Enroll Students', url: '/academic-staff/enrollment/enroll' },
          { title: 'Import Students', url: '/academic-staff/enrollment/import' },
          { title: 'Manage Enrollment', url: '/academic-staff/enrollment/manage' },
        ],
      },
      {
        title: 'Schedule',
        url: '/academic-staff/schedule',
        icon: Calendar,
        items: [
          { title: 'Class Schedule', url: '/academic-staff/schedule' },
          { title: 'Conflicts', url: '/academic-staff/schedule/conflicts', badge: '2' },
          { title: 'Reschedule', url: '/academic-staff/schedule/reschedule' },
        ],
      },
      {
        title: 'Requests',
        url: '/academic-staff/requests',
        icon: ClipboardList,
        items: [
          {
            title: 'Student Requests',
            url: '/academic-staff/requests/students',
            badge: '12',
          },
          {
            title: 'Teacher Requests',
            url: '/academic-staff/requests/teachers',
            badge: '5',
          },
          { title: 'All Requests', url: '/academic-staff/requests/all' },
        ],
      },
      {
        title: 'Resources',
        url: '/academic-staff/resources',
        icon: Building2,
        items: [
          { title: 'Assign Resources', url: '/academic-staff/resources/assign' },
          { title: 'Rooms', url: '/academic-staff/resources/rooms' },
          { title: 'Zoom Accounts', url: '/academic-staff/resources/zoom' },
        ],
      },
      {
        title: 'Teachers',
        url: '/academic-staff/teachers',
        icon: GraduationCap,
        items: [
          { title: 'Assign Teachers', url: '/academic-staff/teachers/assign' },
          { title: 'Availability', url: '/academic-staff/teachers/availability' },
          { title: 'Find Substitutes', url: '/academic-staff/teachers/substitutes' },
        ],
      },
      {
        title: 'Reports',
        url: '/academic-staff/reports',
        icon: BarChart3,
        items: [
          { title: 'Class Progress', url: '/academic-staff/reports/progress' },
          { title: 'Attendance', url: '/academic-staff/reports/attendance' },
        ],
      },
    ],
  },

  /**
   * TEACHER - Instruction Delivery
   * Teaching sessions, attendance, assessments, availability, requests
   */
  TEACHER: {
    role: 'TEACHER',
    roleName: 'Teacher',
    navMain: [
      {
        title: 'Dashboard',
        url: '/teacher/dashboard',
        icon: LayoutDashboard,
        items: [
          { title: 'My Schedule', url: '/teacher/dashboard' },
          { title: 'Upcoming Sessions', url: '/teacher/dashboard/upcoming' },
        ],
      },
      {
        title: 'My Classes',
        url: '/teacher/classes',
        icon: School,
      },
      {
        title: 'Attendance',
        url: '/teacher/attendance',
        icon: CheckSquare,
        items: [
          { title: 'Mark Attendance', url: '/teacher/attendance/mark' },
          { title: 'History', url: '/teacher/attendance/history' },
        ],
      },
      {
        title: 'Assessments',
        url: '/teacher/assessments',
        icon: Award,
        items: [
          { title: 'Enter Scores', url: '/teacher/assessments/scores' },
          { title: 'Feedback', url: '/teacher/assessments/feedback' },
          { title: 'All Assessments', url: '/teacher/assessments/all' },
        ],
      },
      {
        title: 'Availability',
        url: '/teacher/availability',
        icon: Clock,
        items: [
          { title: 'Regular Schedule', url: '/teacher/availability/regular' },
          { title: 'Register OT', url: '/teacher/availability/ot' },
          { title: 'Skills', url: '/teacher/availability/skills' },
        ],
      },
      {
        title: 'Requests',
        url: '/teacher/requests',
        icon: ClipboardList,
        items: [
          { title: 'Submit Leave', url: '/teacher/requests/leave' },
          { title: 'Reschedule', url: '/teacher/requests/reschedule' },
          { title: 'Swap Sessions', url: '/teacher/requests/swap' },
          { title: 'My Requests', url: '/teacher/requests/my-requests' },
        ],
      },
      {
        title: 'Reports',
        url: '/teacher/reports',
        icon: BarChart3,
        items: [
          { title: 'My Sessions', url: '/teacher/reports/sessions' },
          { title: 'Student Performance', url: '/teacher/reports/performance' },
        ],
      },
    ],
  },

  /**
   * STUDENT - Learner
   * Personal schedule, classes, attendance, grades, requests, feedback
   */
  STUDENT: {
    role: 'STUDENT',
    roleName: 'Student',
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboards/student',
        icon: LayoutDashboard,
      },
      {
        title: 'My Classes',
        url: '/student/classes',
        icon: School,
      },
      {
        title: 'Schedule',
        url: '/student/schedule',
        icon: Calendar,
        items: [
          { title: 'My Schedule', url: '/student/schedule' },
          { title: 'Upcoming Sessions', url: '/student/schedule/upcoming' },
        ],
      },
      {
        title: 'Attendance',
        url: '/student/attendance',
        icon: CheckSquare,
      },
      {
        title: 'Grades',
        url: '/student/grades',
        icon: Award,
        items: [
          { title: 'All Grades', url: '/student/grades' },
          { title: 'Assessments', url: '/student/grades/assessments' },
        ],
      },
      {
        title: 'Requests',
        url: '/student/requests',
        icon: ClipboardList,
        items: [
          { title: 'Submit Absence', url: '/student/requests/absence' },
          { title: 'Request Make-up', url: '/student/requests/makeup' },
          { title: 'Transfer Class', url: '/student/requests/transfer' },
          { title: 'My Requests', url: '/student/requests/my-requests' },
        ],
      },
      {
        title: 'Feedback',
        url: '/student/feedback',
        icon: MessageSquare,
        items: [
          { title: 'Rate Sessions', url: '/student/feedback/sessions' },
          { title: 'My Feedback', url: '/student/feedback/history' },
        ],
      },
    ],
  },

  /**
   * QA - Quality Assurance
   * Quality monitoring, reports, feedback analysis, CLO tracking
   */
  QA: {
    role: 'QA',
    roleName: 'Quality Assurance',
    navMain: [
      {
        title: 'Dashboard',
        url: '/qa/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Classes',
        url: '/qa/classes',
        icon: School,
        items: [
          { title: 'Monitor Classes', url: '/qa/classes' },
          { title: 'Low-Rated Classes', url: '/qa/classes/low-rated', badge: '3' },
        ],
      },
      {
        title: 'QA Reports',
        url: '/qa/reports',
        icon: FileText,
        items: [
          { title: 'Create Report', url: '/qa/reports/create' },
          { title: 'Open Issues', url: '/qa/reports/open', badge: '5' },
          { title: 'In Progress', url: '/qa/reports/in-progress' },
          { title: 'Resolved', url: '/qa/reports/resolved' },
          { title: 'All Reports', url: '/qa/reports/all' },
        ],
      },
      {
        title: 'Feedback',
        url: '/qa/feedback',
        icon: MessageSquare,
        items: [
          { title: 'Student Feedback', url: '/qa/feedback/students' },
          { title: 'Analytics', url: '/qa/feedback/analytics' },
        ],
      },
      {
        title: 'CLO Tracking',
        url: '/qa/clo',
        icon: Target,
        items: [
          { title: 'Achievement Rates', url: '/qa/clo/achievement' },
          { title: 'Session Coverage', url: '/qa/clo/coverage' },
        ],
      },
      {
        title: 'Sessions',
        url: '/qa/sessions',
        icon: Calendar,
        items: [
          { title: 'Observe Sessions', url: '/qa/sessions/observe' },
          { title: 'Session Reports', url: '/qa/sessions/reports' },
        ],
      },
    ],
  },
};

/**
 * Get navigation configuration for a specific role
 */
export function getNavigationForRole(role: UserRole): RoleNavigation {
  return navigationConfig[role];
}

/**
 * Get all available roles
 */
export function getAllRoles(): UserRole[] {
  return Object.keys(navigationConfig) as UserRole[];
}
