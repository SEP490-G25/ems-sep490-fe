# EMS Sidebar Implementation - Clean Architecture Guide

## Overview

This document describes the clean, production-ready sidebar implementation for the EMS system using shadcn/ui sidebar-02 pattern.

## Architecture

### Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── EMSSidebar.tsx       # Main sidebar component (PRODUCTION)
│   │   └── MainLayout.tsx       # Layout wrapper with SidebarProvider
│   └── ui/
│       └── sidebar.tsx          # shadcn/ui sidebar primitives
├── lib/
│   └── navigation-config.ts     # Role-based navigation data
├── types/
│   └── navigation.ts            # TypeScript types
└── pages/
    └── SidebarDemo.tsx          # Demo/testing page

```

### Key Components

#### 1. EMSSidebar.tsx (Production Component)

**Location:** `src/components/layout/EMSSidebar.tsx`

**Purpose:** Main sidebar component used throughout the application

**Features:**
- ✅ User profile in **header** (top)
- ✅ Logo/branding in **footer** (bottom)
- ✅ Toggle button for collapse/expand (Cmd+B / Ctrl+B)
- ✅ Role-based navigation (8 roles)
- ✅ Collapsible navigation sections
- ✅ Badge notifications
- ✅ Active route highlighting
- ✅ Mobile responsive
- ✅ Built with shadcn sidebar-02 pattern

**Usage:**
```tsx
import { EMSSidebar } from '@/components/layout/EMSSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

<SidebarProvider>
  <EMSSidebar user={currentUser} onLogout={handleLogout} />
  {/* Your content */}
</SidebarProvider>
```

#### 2. MainLayout.tsx (Layout Wrapper)

**Location:** `src/components/layout/MainLayout.tsx`

**Purpose:** Wrap pages with sidebar and standard layout

**Features:**
- Includes SidebarProvider
- Includes SidebarTrigger in header
- Includes Breadcrumb
- Includes SidebarInset for content

**Usage:**
```tsx
import { MainLayout } from '@/components/layout/MainLayout';

export function MyPage() {
  const { user, logout } = useAuth();

  const sidebarUser = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return (
    <MainLayout
      user={sidebarUser}
      onLogout={logout}
      breadcrumbTitle="My Page"
    >
      <div className="p-6">
        {/* Your page content */}
      </div>
    </MainLayout>
  );
}
```

#### 3. navigation-config.ts (Navigation Data)

**Location:** `src/lib/navigation-config.ts`

**Purpose:** Define navigation structure for all 8 roles

**Roles:**
1. ADMIN - System Administrator
2. MANAGER - Operations Manager
3. CENTER_HEAD - Branch Director
4. SUBJECT_LEADER - Curriculum Designer
5. ACADEMIC_STAFF - Giáo vụ (KEY ROLE)
6. TEACHER - Instruction Delivery
7. STUDENT - Learner
8. QA - Quality Assurance

**Example:**
```tsx
import { getNavigationForRole } from '@/lib/navigation-config';

const navigation = getNavigationForRole('ACADEMIC_STAFF');
// Returns navigation items specific to Academic Staff role
```

## File Organization (Clean)

### ✅ Production Files (Keep)

```
src/components/
├── layout/
│   ├── EMSSidebar.tsx          ✅ Main sidebar
│   └── MainLayout.tsx          ✅ Layout wrapper
├── ui/
│   ├── sidebar.tsx             ✅ shadcn primitives
│   ├── collapsible.tsx         ✅ For submenus
│   ├── dropdown-menu.tsx       ✅ For user menu
│   ├── avatar.tsx              ✅ For user profile
│   ├── badge.tsx               ✅ For notifications
│   ├── breadcrumb.tsx          ✅ For navigation
│   └── separator.tsx           ✅ For dividers
└── shared/
    └── ProtectedRoute.tsx      ✅ Auth guard
```

### ❌ Removed Files (Cleaned Up)

```
src/components/
├── layout/
│   └── AppSidebar.tsx          ❌ REMOVED (old version)
├── app-sidebar.tsx             ❌ REMOVED (shadcn example)
├── search-form.tsx             ❌ REMOVED (shadcn example)
└── version-switcher.tsx        ❌ REMOVED (shadcn example)
```

## Testing

### Demo Page

**Location:** `src/pages/SidebarDemo.tsx`

**URL:** `http://localhost:5173/sidebar-demo`

**Purpose:** Test and showcase all sidebar features

**Features:**
- Switch between all 8 roles
- See navigation changes
- Test toggle functionality
- Test mobile responsive
- View role responsibilities

### How to Test

1. **Start dev server:**
   ```bash
   pnpm run dev
   ```

2. **Navigate to demo:**
   ```
   http://localhost:5173/sidebar-demo
   ```

3. **Test features:**
   - Click hamburger icon (☰) to toggle sidebar
   - Switch roles using dropdown
   - Click navigation items to expand/collapse
   - Click user profile for dropdown menu
   - Resize browser for mobile view
   - Press Cmd+B / Ctrl+B for keyboard toggle

### Login for Testing

**URL:** `http://localhost:5173/login`

**Test Accounts:**
```
Email: admin@ems.edu       Password: any       Role: ADMIN
Email: manager@ems.edu     Password: any       Role: MANAGER
Email: director@ems.edu    Password: any       Role: CENTER_HEAD
Email: leader@ems.edu      Password: any       Role: SUBJECT_LEADER
Email: giaovu@ems.edu      Password: any       Role: ACADEMIC_STAFF
Email: teacher@ems.edu     Password: any       Role: TEACHER
Email: student@ems.edu     Password: any       Role: STUDENT
Email: qa@ems.edu          Password: any       Role: QA
```

**Note:** Password can be anything (mock authentication)

## TypeScript Types

### SidebarUser
```typescript
interface SidebarUser {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavigationSubItem[];
  badge?: string;
}
```

## Adding New Navigation Items

**Edit:** `src/lib/navigation-config.ts`

```typescript
ACADEMIC_STAFF: {
  role: 'ACADEMIC_STAFF',
  roleName: 'Academic Staff',
  navMain: [
    {
      title: 'New Feature',
      url: '/academic-staff/new-feature',
      icon: YourIcon,
      badge: '5', // Optional
      items: [
        {
          title: 'Sub Item 1',
          url: '/academic-staff/new-feature/sub1',
          badge: '2' // Optional
        },
        {
          title: 'Sub Item 2',
          url: '/academic-staff/new-feature/sub2'
        },
      ],
    },
  ],
}
```

## Consistency Rules

### ✅ DO

- Use `EMSSidebar` component for all pages
- Wrap pages with `MainLayout`
- Define navigation in `navigation-config.ts`
- Use Lucide icons from `lucide-react`
- Follow shadcn/ui component patterns
- Support both dark and light themes
- Test on mobile devices

### ❌ DON'T

- Create custom sidebar components
- Use inline navigation data
- Mix different sidebar patterns
- Use raw HTML elements
- Hardcode navigation items in components
- Skip mobile responsive testing

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari, Chrome Android

## Keyboard Shortcuts

- **Cmd+B** (Mac) / **Ctrl+B** (Windows): Toggle sidebar

## Accessibility

- ARIA labels included
- Keyboard navigation supported
- Screen reader compatible
- Focus management

## Performance

- Lazy loading for navigation items
- Memoized navigation data
- Optimized re-renders
- Smooth animations

## Related Documentation

- `CLAUDE.md` - Development guidelines
- `docs/business-context.md` - Role responsibilities
- shadcn/ui sidebar: https://ui.shadcn.com/docs/components/sidebar

## Summary

✅ **Clean Architecture:**
- Single source of truth: `EMSSidebar.tsx`
- Clear separation: layout vs UI primitives
- No duplicate components
- No confusion

✅ **Production Ready:**
- Full TypeScript support
- Role-based navigation
- Mobile responsive
- Accessible
- Performant

✅ **Easy to Maintain:**
- Centralized navigation config
- Clear component structure
- Well documented
- Easy to extend
