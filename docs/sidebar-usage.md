# EMS Role-Based Sidebar - Usage Guide

## Overview

The EMS Sidebar is a role-based navigation system that automatically adapts its menu items based on the current user's role. It follows the shadcn/ui design patterns and integrates seamlessly with the EMS business requirements.

## Features

- **8 User Roles Support**: ADMIN, MANAGER, CENTER_HEAD, SUBJECT_LEADER, ACADEMIC_STAFF, TEACHER, STUDENT, QA
- **Role-Based Navigation**: Menu items automatically change based on user role
- **Collapsible Submenus**: Expandable navigation for better organization
- **Badge Notifications**: Visual indicators for pending items (e.g., "Pending Approval: 5")
- **Active Route Highlighting**: Clear visual feedback for current location
- **Mobile Responsive**: Drawer navigation on mobile, fixed sidebar on desktop
- **User Profile Dropdown**: Quick access to profile, settings, and logout
- **TypeScript**: Fully typed with strict mode

## File Structure

```
src/
├── types/
│   └── navigation.ts          # TypeScript types for navigation
├── lib/
│   └── navigation-config.ts   # Navigation configuration for all roles
├── components/
│   └── layout/
│       ├── AppSidebar.tsx     # Main sidebar component
│       └── MainLayout.tsx     # Layout wrapper with sidebar
└── pages/
    └── SidebarDemo.tsx        # Demo page showcasing all roles
```

## Quick Start

### 1. Basic Usage

```tsx
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarUser } from '@/types/navigation';

function MyApp() {
  const currentUser: SidebarUser = {
    name: 'Phạm Thị Giáo Vụ',
    email: 'giaovu@ems.edu',
    role: 'ACADEMIC_STAFF',
    avatar: '/avatar.jpg', // optional
  };

  const handleLogout = () => {
    // Handle logout logic
  };

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={currentUser} onLogout={handleLogout} />
      <main className="flex-1">
        {/* Your page content */}
      </main>
    </div>
  );
}
```

### 2. Using MainLayout (Recommended)

```tsx
import { MainLayout } from '@/components/layout/MainLayout';
import { SidebarUser } from '@/types/navigation';

function MyPage() {
  const currentUser: SidebarUser = {
    name: 'Nguyễn Văn Teacher',
    email: 'teacher@ems.edu',
    role: 'TEACHER',
  };

  return (
    <MainLayout user={currentUser} onLogout={() => console.log('Logout')}>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        {/* Your page content */}
      </div>
    </MainLayout>
  );
}
```

## Navigation Configuration

### Role-Based Navigation

Each role has a predefined navigation structure in `src/lib/navigation-config.ts`:

```typescript
import { getNavigationForRole } from '@/lib/navigation-config';

// Get navigation for a specific role
const navigation = getNavigationForRole('ACADEMIC_STAFF');

// navigation.navMain contains all menu items for this role
```

### Navigation Structure by Role

#### ADMIN - System Administrator
- Dashboard
- User Management (All Users, Roles & Permissions, Create User)
- Organizations (Centers, Branches, Resources)
- System Settings (General, Capacity Policies, Attendance Lock, Request Lead Times)
- Audit Logs

#### MANAGER - Operations Manager
- Dashboard (Executive Overview, Branch Performance, KPIs)
- Curriculum (Pending Approval, Approved Courses, All Courses)
- Classes (Pending Approval, All Classes, Cross-Branch)
- Teachers (All Teachers, Workload, Cross-Branch Assignment)
- Students (Enrollment Trends, Performance Analytics, All Students)
- Resources (Utilization, Optimization)
- Reports (Enrollment, Attendance, Quality, Resource Utilization)
- Requests (Escalated Issues, All Requests)

#### CENTER_HEAD - Branch Director
- Dashboard (Branch Overview, Branch KPIs)
- Classes (Pending Approval, Active Classes, All Classes)
- Teachers (Branch Teachers, Schedule, Performance)
- Students (Enrollment, Attendance, All Students)
- Resources (Rooms, Zoom Accounts, Time Slots)
- Requests (Student Requests, Teacher Requests, All Requests)
- Reports (Branch Performance, Quality, Attendance)

#### SUBJECT_LEADER - Curriculum Designer
- Dashboard
- Subjects (All Subjects, Levels, Create Subject)
- Courses (My Courses, Create Course, Phases & Sessions)
- Learning Outcomes (PLO, CLO, Session Mapping)
- Materials (Course Materials, Session Materials, Upload)
- Submissions (Pending Approval, Approved, Rejected)

#### ACADEMIC_STAFF - Giáo vụ (KEY ROLE)
- Dashboard
- Classes (My Classes, Create Class, Draft Classes)
- Enrollment (Enroll Students, Import Students, Manage Enrollment)
- Schedule (Class Schedule, Conflicts, Reschedule)
- Requests (Student Requests, Teacher Requests, All Requests)
- Resources (Assign Resources, Rooms, Zoom Accounts)
- Teachers (Assign Teachers, Availability, Find Substitutes)
- Reports (Class Progress, Attendance)

#### TEACHER - Instruction Delivery
- Dashboard (My Schedule, Upcoming Sessions)
- My Classes
- Attendance (Mark Attendance, History)
- Assessments (Enter Scores, Feedback, All Assessments)
- Availability (Regular Schedule, Register OT, Skills)
- Requests (Submit Leave, Reschedule, Swap Sessions, My Requests)
- Reports (My Sessions, Student Performance)

#### STUDENT - Learner
- Dashboard
- My Classes
- Schedule (My Schedule, Upcoming Sessions)
- Attendance
- Grades (All Grades, Assessments)
- Requests (Submit Absence, Request Make-up, Transfer Class, My Requests)
- Feedback (Rate Sessions, My Feedback)

#### QA - Quality Assurance
- Dashboard
- Classes (Monitor Classes, Low-Rated Classes)
- QA Reports (Create Report, Open Issues, In Progress, Resolved, All Reports)
- Feedback (Student Feedback, Analytics)
- CLO Tracking (Achievement Rates, Session Coverage)
- Sessions (Observe Sessions, Session Reports)

## Customization

### Adding Badge Notifications

Badges appear next to menu items to show counts or status:

```typescript
{
  title: 'Pending Approval',
  url: '/manager/classes/pending',
  badge: '5', // Shows a badge with number 5
}
```

### Adding New Navigation Items

Edit `src/lib/navigation-config.ts`:

```typescript
ACADEMIC_STAFF: {
  role: 'ACADEMIC_STAFF',
  roleName: 'Academic Staff',
  navMain: [
    // ... existing items
    {
      title: 'New Feature',
      url: '/academic-staff/new-feature',
      icon: YourLucideIcon,
      items: [
        { title: 'Sub Item 1', url: '/academic-staff/new-feature/sub1' },
        { title: 'Sub Item 2', url: '/academic-staff/new-feature/sub2' },
      ],
    },
  ],
}
```

### Changing Icons

Import Lucide icons in `navigation-config.ts`:

```typescript
import { LayoutDashboard, Users, Calendar } from 'lucide-react';

// Use in navigation items
{
  title: 'Dashboard',
  icon: LayoutDashboard,
  // ...
}
```

See all available icons at: https://lucide.dev/icons/

## Demo Page

Visit `/sidebar-demo` to see the sidebar in action for all roles.

The demo page allows you to:
- Switch between all 8 user roles
- See how navigation changes for each role
- Test mobile responsiveness
- Understand role responsibilities

## Business Context

The sidebar navigation structure is based on the EMS business requirements documented in:
- `docs/business-context.md` - Section 2.1 (Role Hierarchy)

Each role's navigation items correspond to their responsibilities and permissions in the system.

## Mobile Behavior

- **Desktop (≥1024px)**: Fixed sidebar always visible
- **Mobile (<1024px)**: Drawer that slides in from left, triggered by menu button

## Active Route Detection

The sidebar automatically highlights the current route:
- Uses React Router's `useLocation()` hook
- Matches exact URLs for menu items
- Parent items expand when child routes are active

## TypeScript Types

### SidebarUser

```typescript
interface SidebarUser {
  name: string;           // User's full name
  email: string;          // User's email
  role: UserRole;         // User's role
  avatar?: string;        // Optional avatar URL
}
```

### UserRole

```typescript
type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'CENTER_HEAD'
  | 'SUBJECT_LEADER'
  | 'ACADEMIC_STAFF'
  | 'TEACHER'
  | 'STUDENT'
  | 'QA';
```

### NavigationItem

```typescript
interface NavigationItem {
  title: string;              // Display title
  url: string;                // Navigation URL
  icon?: LucideIcon;          // Lucide icon component
  isActive?: boolean;         // Is active route
  items?: NavigationSubItem[]; // Submenu items
  badge?: string;             // Badge text
}
```

## Best Practices

1. **Always use MainLayout** for consistent layout across pages
2. **Update navigation config** when adding new features
3. **Use role-based routes** in your router configuration
4. **Keep navigation hierarchy** max 2 levels (main item → subitems)
5. **Use badges sparingly** only for important notifications
6. **Test on mobile** to ensure responsive behavior works
7. **Match business requirements** when modifying navigation structure

## Troubleshooting

### Sidebar not showing on mobile
- Ensure you're using the Sheet trigger on mobile
- Check that lg:hidden classes are working

### Wrong navigation items showing
- Verify user.role is correct
- Check navigation-config.ts for role definition

### Active route not highlighting
- Ensure URLs match exactly between navigation config and routes
- Check React Router location.pathname value

## Related Components

- `AppSidebar.tsx` - Main sidebar component
- `MainLayout.tsx` - Layout wrapper
- `navigation-config.ts` - Role-based navigation data
- `navigation.ts` - TypeScript types

## Support

For questions or issues related to sidebar implementation, refer to:
- `CLAUDE.md` - Development guidelines
- `docs/business-context.md` - Business requirements
- shadcn/ui documentation: https://ui.shadcn.com
