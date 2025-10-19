# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

**UI Framework**: shadcn/ui components + Tailwind CSS
**Icons**: Lucide React
**Theme**: Dark/Light mode support required
**Responsive**: Mobile-first design (375px → 768px → 1280px+)
**TypeScript**: Strict mode enabled
**Components**: Functional + Hooks only
**Import Alias**: `@` → `src/`

**Key Rules:**
- ✅ Always use shadcn/ui components (never raw HTML)
- ✅ Always define TypeScript interfaces for props
- ✅ Always support both dark and light themes
- ✅ Always design mobile-first, then desktop
- ✅ Always use Lucide icons for visual elements
- ❌ Never use `any` type
- ❌ Never use class components
- ❌ Never use inline styles or custom HTML elements

## Project Overview

**EMS (Education Management System) - Frontend**

This is the frontend application for a comprehensive Education Management System designed for multi-branch language training centers. The system manages the complete lifecycle of educational operations from curriculum design to class delivery, attendance tracking, and quality assurance.

**Key Domain Concepts:**
- Multi-tenant operations across multiple branches
- Complex scheduling coordination (teachers, rooms, Zoom platforms, students)
- Dynamic change management (schedule changes, teacher absences, student make-ups/transfers)
- Curriculum integrity and standardized delivery
- Quality tracking via PLO/CLO, attendance rates, and teaching quality metrics

See `docs/business-context.md` for comprehensive business domain details.

## Technology Stack

- **React 19.1.1** with TypeScript
- **Vite 7.1.7** as build tool
- **SWC** for Fast Refresh via `@vitejs/plugin-react-swc`
- **Redux Toolkit 2.9.1** with RTK Query for state management
- **React Router 7.9.4** for routing
- **ESLint** with TypeScript and React plugins
- **shadcn/ui** + **Tailwind CSS 4** for UI components
- **pnpm** as package manager

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server with HMR
pnpm dev

# Build for production (runs TypeScript compiler + Vite build)
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview

# Type-check specific files without building
pnpm exec tsc --noEmit [file paths]

# Add shadcn/ui components
pnpm dlx shadcn@latest add [component-name]
```

## TypeScript Configuration

The project uses a split TypeScript configuration:
- `tsconfig.json` - References both app and node configs
- `tsconfig.app.json` - Main app configuration (strict mode enabled)
- `tsconfig.node.json` - Vite configuration files

**Strict TypeScript settings enabled:**
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedSideEffectImports: true`

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── features/        # Feature-specific components
│   │   ├── attendance/  # Attendance management components
│   │   ├── schedule/    # Schedule and session components
│   │   ├── curriculum/  # Course and subject components
│   │   ├── enrollment/  # Student enrollment components
│   │   └── requests/    # Request handling components
│   ├── layout/          # Layout components (Sidebar, MainLayout)
│   └── shared/          # Shared/common components
├── pages/               # Page components (one per route)
├── routes/              # React Router configuration
├── store/               # Redux Toolkit state management
│   ├── api/             # RTK Query API definitions
│   │   ├── baseApi.ts   # Base API configuration
│   │   ├── authApi.ts   # Auth endpoints
│   │   └── apiUtils.ts  # API utilities
│   ├── slices/          # Redux slices
│   │   └── authSlice.ts # Auth state slice
│   ├── store.ts         # Store configuration
│   ├── hooks.ts         # Typed Redux hooks (useAppDispatch, useAppSelector)
│   └── index.ts         # Store exports
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and helpers
├── types/               # TypeScript type definitions
├── services/            # Non-RTK Query API services (if needed)
├── assets/              # Static assets (images, icons)
├── styles/              # Global styles
│   └── globals.css      # Global CSS with typography and theme definitions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point (with Redux Provider)

docs/
├── business-context.md  # Comprehensive business domain documentation
├── api-design.md        # API design and endpoints
├── uiux-design.md       # UI/UX design guidelines
└── sidebar-*.md         # Sidebar implementation guides
```

### Folder Organization Rules
- **components/ui/**: Only shadcn/ui components, DO NOT modify structure
- **components/features/**: Organize by business domain (attendance, schedule, etc.)
- **components/layout/**: Layout components (Sidebar, MainLayout)
- **components/shared/**: Only truly shared components used across multiple features
- **pages/**: Page-level components, typically one per route
- **routes/**: React Router configuration and route definitions
- **store/**: Redux Toolkit state management
  - **store/api/**: RTK Query API endpoints (use `baseApi.injectEndpoints()`)
  - **store/slices/**: Redux slices for client-side state
  - Use typed hooks from `store/hooks.ts` (`useAppDispatch`, `useAppSelector`)
- **hooks/**: Custom React hooks following `use*` naming convention
- **types/**: Shared TypeScript interfaces and types, organized by domain
- **services/**: Non-RTK Query services (prefer RTK Query for API calls)

## Key Business Roles (User Types)

When implementing features, be aware of these user roles and their permissions:

1. **ADMIN** - System-wide access and configuration
2. **MANAGER** - Cross-branch strategic oversight, approves courses
3. **CENTER HEAD** - Single branch operations, approves classes
4. **SUBJECT LEADER** - Curriculum design (subjects, courses, sessions)
5. **ACADEMIC STAFF** - Day-to-day class operations, scheduling, enrollment
6. **TEACHER** - Session delivery, attendance, grading
7. **STUDENT** - Attend classes, submit requests (absence, make-up, transfer)
8. **QA** - Quality monitoring and reporting

## Core Entities & Relationships

Understanding these relationships is critical for frontend implementation:

**Organizational Hierarchy:**
- Organization → Center → Branch → Resources (Rooms/Zoom) → Time Slots

**Curriculum Structure:**
- Subject → Level → Course → Phase → Course Session (template)

**Operational Structure:**
- Class → Session (actual meeting) → Teaching Slot → Session Resource
- Class → Enrollment → Student Session

**Request Flows:**
- Student Requests: absence, make-up, transfer
- Teacher Requests: leave, OT (overtime), reschedule

## Important Business Rules for UI

### Approval Workflows
- **Course creation**: Subject Leader designs → Manager approves
- **Class creation**: Academic Staff creates → Center Head/Manager approves
- **Student requests**: Student submits → Academic Staff approves

### Capacity & Constraints
- Classes have max_capacity limits
- OFFLINE classes: hard room capacity limits (fire safety)
- ONLINE classes: flexible Zoom capacity
- Make-up sessions must check target session capacity

### Conflict Detection
Frontend should validate:
- Resource conflicts (room/Zoom double-booking)
- Teacher conflicts (same teacher, overlapping times)
- Student conflicts (student in two classes at same time)

### Transfer Rules
- Student transfers only allowed between classes with **same course_id**
- System must map remaining sessions by `course_session_id` for content continuity
- Original class enrollment marked `transferred`, not deleted (audit trail)

### Attendance Lock
- Attendance locks T hours after session ends (configurable)
- Prevents retroactive changes for data integrity
- Only Admin/Manager can unlock with audit log

## ESLint Configuration

Using modern ESLint flat config (`eslint.config.js`):
- TypeScript ESLint rules
- React Hooks rules (recommended-latest)
- React Refresh rules for Vite
- Browser globals
- `dist/` directory ignored

## Path Aliases

Path alias `@` → `src/` is configured in:
- `vite.config.ts` - `resolve.alias`
- `tsconfig.app.json` - `paths` mapping

Use `@/` prefix for all imports from src directory (e.g., `import { Button } from '@/components/ui/button'`)

## State Management with Redux Toolkit

This project uses **Redux Toolkit** (RTK) and **RTK Query** for state management:

### Redux Store Structure
- **Store**: Configured in `src/store/store.ts`
- **API Layer**: RTK Query base API in `src/store/api/baseApi.ts`
- **Slices**: Redux slices in `src/store/slices/`
- **Typed Hooks**: Use `useAppDispatch` and `useAppSelector` from `src/store/hooks.ts`

### RTK Query Pattern
RTK Query is the preferred method for all API calls:

```typescript
// Define API endpoints by injecting into baseApi
// Example: src/store/api/authApi.ts
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    // More endpoints...
  }),
});

export const { useLoginMutation } = authApi;
```

### Usage in Components
```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLoginMutation } from '@/store/api/authApi';

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const user = useAppSelector(state => state.auth.user);

  // Component logic...
};
```

### When to Use Redux Slices vs RTK Query
- **RTK Query**: For all server state (API data fetching, caching, mutations)
- **Redux Slices**: For client-side state (UI state, theme, current user session)
- **React State**: For local component state (form inputs, toggles)

### Adding New API Endpoints
1. Create new API file in `src/store/api/` (e.g., `courseApi.ts`)
2. Use `baseApi.injectEndpoints()` pattern
3. Export auto-generated hooks
4. API endpoints are automatically added to the store

### Adding New Redux Slices
1. Create slice in `src/store/slices/`
2. Add reducer to store in `src/store/store.ts`
3. Use typed hooks for accessing state

## Routing with React Router

This project uses **React Router v7** for navigation:

### Routing Structure
- Route configuration in `src/routes/`
- Page components in `src/pages/`
- One page component per route (e.g., `LoginPage.tsx`, `DashboardPage.tsx`)

### Route Patterns
- Use React Router's latest features (v7+)
- Implement role-based route protection for user permissions
- Consider nested routes for complex layouts (e.g., dashboard with sidebar)

### Navigation
```typescript
import { useNavigate, Link } from 'react-router-dom';

// Programmatic navigation
const navigate = useNavigate();
navigate('/dashboard');

// Declarative navigation
<Link to="/courses">View Courses</Link>
```

## UI/UX Guidelines

### shadcn/ui Components
This project uses **shadcn/ui** as the primary component library:
- Components are copied into the project (not imported from npm)
- Typically stored in `src/components/ui/`
- Can be customized directly in the codebase
- **Always use shadcn/ui components** instead of custom HTML elements:
  - Use `Button` instead of `<button>`
  - Use `Card`, `CardHeader`, `CardContent` instead of `<div>` wrappers
  - Use `Input`, `Textarea`, `Select` for form controls
  - Use `Dialog`, `Sheet`, `Popover` for overlays
  - Use `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` for data tables

### Typography & Styling
- **Font family**: Use Tailwind's `font-sans` (defined in `/styles/globals.css`)
- **Font weights and sizes**: Follow definitions in `/styles/globals.css`
- **Tailwind utilities**: Use Tailwind classes for all styling
- Maintain **consistent spacing** using Tailwind's spacing scale (p-4, m-6, space-y-4, etc.)
- Create **strong visual hierarchy** through font sizes, weights, and spacing

### Design System
- **Design philosophy**: Modern minimal design
- **Layout**: Clean, uncluttered layouts with proper whitespace
- **Visual hierarchy**: Clear distinction between primary, secondary, and tertiary elements
- **Consistency**: Maintain consistent spacing, sizing, and styling across all pages

### Icons
- Use **Lucide icons** consistently for all visual semantics
- Import from `lucide-react` package
- Choose icons that clearly communicate their purpose
- Examples: `ChevronRight`, `Calendar`, `Users`, `Settings`, `AlertCircle`

### Theme Support
- Support **both dark and light themes**
- Use Tailwind's theme variants: `dark:bg-gray-800`, `dark:text-white`
- Ensure all components work in both themes
- Test color contrast in both modes for accessibility

### Responsiveness
- **Mobile-first approach**: Design for mobile screens first
- Use Tailwind's responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Common patterns:
  - Stack vertically on mobile, horizontal on desktop
  - Hide/show elements based on screen size
  - Adjust padding/spacing for different viewports
  - Use responsive grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Test on multiple screen sizes (mobile: 375px, tablet: 768px, desktop: 1280px+)

### Component Patterns
- Use shadcn/ui composition patterns
- Prefer declarative component APIs
- Keep components accessible (ARIA attributes included in shadcn/ui)
- Example structure:
  ```tsx
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Content */}
    </CardContent>
  </Card>
  ```

### Brand & UX Consistency

**Visual Identity:**
- Clean, professional, education-focused design
- Modern minimal aesthetic - avoid clutter
- Consistent use of whitespace for readability
- Strong hierarchy: titles → subtitles → body text → metadata

**Color Usage:**
- Use shadcn/ui default color palette (customizable in `globals.css`)
- Primary: Main actions and key elements
- Secondary: Supporting actions
- Destructive: Delete, cancel, reject actions
- Muted: Disabled states and background elements
- Success/Warning/Error: Status indicators and alerts

**Spacing Scale (Tailwind):**
- Compact spacing: `space-y-2` or `gap-2` (8px)
- Default spacing: `space-y-4` or `gap-4` (16px)
- Generous spacing: `space-y-6` or `gap-6` (24px)
- Section breaks: `space-y-8` or `gap-8` (32px)

**Typography Hierarchy:**
```tsx
// Page Title
<h1 className="text-3xl font-bold">Page Title</h1>

// Section Heading
<h2 className="text-2xl font-semibold">Section Heading</h2>

// Subsection
<h3 className="text-xl font-medium">Subsection</h3>

// Card Title
<CardTitle className="text-lg font-semibold">Card Title</CardTitle>

// Body Text
<p className="text-base">Body text content</p>

// Metadata/Secondary
<span className="text-sm text-muted-foreground">Secondary info</span>
```

**Common UI Patterns:**
- **Data Tables**: Use shadcn `Table` with sortable headers, pagination
- **Forms**: Use shadcn `Form` components with validation feedback
- **Modals**: Use `Dialog` for confirmations, `Sheet` for side panels
- **Loading States**: Use `Skeleton` for content loading
- **Empty States**: Use centered Card with icon, message, and CTA
- **Status Badges**: Use `Badge` with appropriate variants (success, warning, error)
- **Action Buttons**: Primary action (solid), secondary (outline), destructive (red)

## Claude Code Usage

When Claude Code analyzes this repository, follow these guidelines:

### Auto-Detection & Analysis
- **Auto-detect UI patterns** based on shadcn/ui components
- Identify and flag any raw HTML elements that should use shadcn/ui components
- Recognize existing component patterns and maintain consistency
- Detect theme usage (dark/light) and ensure new code supports both

### Code Quality Suggestions
- **Suggest component refactors** when:
  - Raw HTML is found instead of shadcn/ui components
  - Redundant or inline styling is detected (should use Tailwind utilities)
  - Components are too large and should be split
  - Missing TypeScript types or interfaces
  - Non-responsive layouts are found
- Recommend extracting repeated UI patterns into reusable components
- Suggest custom hooks for repeated business logic

### UX Consistency Enforcement
- **Preserve UX consistency** when generating or modifying components:
  - Maintain consistent spacing using Tailwind scale
  - Follow established visual hierarchy patterns
  - Use the same shadcn/ui component variants throughout
  - Keep icon usage consistent (Lucide icons only)
  - Ensure dark/light theme support in all new components
  - Maintain mobile-first responsive patterns

### Scaffolding Components
- Use **shadcn CLI** via pnpm for adding new UI components:
  ```bash
  # Add single component
  pnpm dlx shadcn@latest add button

  # Add multiple components
  pnpm dlx shadcn@latest add dialog sheet popover

  # Add with auto-confirmation
  pnpm dlx shadcn@latest add card --yes

  # Add shadcn blocks (pre-built component patterns)
  pnpm dlx shadcn@latest add @shadcn/login-02 --yes
  pnpm dlx shadcn@latest add @shadcn/sidebar-02 --yes
  ```
- After adding components, customize them in `src/components/ui/` if needed
- Ensure new components follow the project's theme configuration
- Use `--overwrite` flag to replace existing components if needed

### Business Context Awareness
- Before implementing features, review `docs/business-context.md` for:
  - User roles and permissions
  - Business rules and workflows
  - Approval processes
  - Data relationships
- Ensure UI reflects business domain concepts (e.g., Class vs Session, Enrollment vs Student Session)
- Validate business rules in the UI (capacity limits, conflicts, attendance locks)

### Proactive Improvements
Claude Code should proactively:
- Identify accessibility issues (missing ARIA labels, poor color contrast)
- Suggest performance optimizations (memoization, lazy loading)
- Recommend error boundary implementations
- Flag hardcoded values that should be configuration
- Suggest adding loading states and error handling

## Development Rules

### TypeScript
- Use **TypeScript strictly** - `"strict": true` is enabled in `tsconfig.json`
- Always define **explicit types** for props, state, and function parameters
- Avoid using `any` - use `unknown` or proper type definitions instead
- Define interfaces/types for all component props:
  ```tsx
  interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }

  const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
    // implementation
  }
  ```

### React Patterns
- **Prefer functional components + hooks** over class components
- Use React 19 hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext`
- Use Redux hooks: `useAppSelector`, `useAppDispatch` (from `@/store/hooks`)
- Use RTK Query hooks for data fetching: `useLoginMutation`, `useGetCoursesQuery`, etc.
- Keep components **small and composable** - single responsibility principle
- Extract reusable logic into custom hooks
- Example of good component structure:
  ```tsx
  // ✅ Good: Small, focused, well-typed
  interface UserCardProps {
    name: string;
    email: string;
    role: UserRole;
  }

  const UserCard = ({ name, email, role }: UserCardProps) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{email}</p>
          <Badge>{role}</Badge>
        </CardContent>
      </Card>
    );
  };
  ```

### Import Conventions
- Use **alias `@` → `src`** for all imports from src directory
- Use **relative imports** for local modules in the same directory:
  ```tsx
  // ✅ Good: Alias for src paths
  import { Button } from '@/components/ui/button';
  import { useAppSelector } from '@/store/hooks';
  import { useLoginMutation } from '@/store/api/authApi';

  // ✅ Good: Relative for local modules
  import { UserCard } from './UserCard';
  import { validateForm } from './utils';

  // ❌ Avoid: Relative imports for src paths
  import { Button } from '../../../components/ui/button';
  ```

### Component Organization
- Keep components **small and composable**
- Split large components into smaller sub-components
- Extract shared logic into custom hooks
- Separate concerns: presentation vs. business logic
- Use container/presenter pattern when appropriate:
  - **Container components**: Handle data fetching (RTK Query), state management
  - **Presenter components**: Pure UI, receive data via props
- Example structure:
  ```
  pages/
  └── AttendancePage.tsx       # Route-level container

  components/
  ├── ui/                       # shadcn/ui components
  ├── features/                 # Feature-specific components
  │   └── attendance/
  │       ├── AttendanceList.tsx      # Presenter
  │       ├── AttendanceRow.tsx       # Presenter
  │       └── AttendanceFilters.tsx   # Presenter
  └── shared/                   # Shared across features

  store/
  └── api/
      └── attendanceApi.ts      # RTK Query endpoints
  ```

### Code Quality
- Follow the **ESLint rules** - no warnings in production code
- Use **descriptive variable names** - prefer clarity over brevity
- Add **JSDoc comments** for complex functions or business logic
- Keep functions **pure** when possible (no side effects)
- Use **optional chaining** and **nullish coalescing**: `user?.name ?? 'Guest'`

## Development Notes

### React 19 Specifics
- Using latest React 19.1.1 with concurrent features
- StrictMode enabled in main.tsx
- New JSX transform (`jsx: "react-jsx"`) - no need to import React

### Fast Refresh with SWC
- Using SWC instead of Babel for faster builds
- Note: React Compiler currently not compatible with SWC
- If React Compiler needed, switch to `@vitejs/plugin-react`

### Build Output
- Build artifacts go to `dist/` (gitignored)
- TypeScript build info in `node_modules/.tmp/`

## Common Workflows

### Adding a New Feature Module
1. **Research**: Check `docs/business-context.md` for business requirements
2. **Plan API Integration**:
   - Identify backend API endpoints (see `docs/api-design.md`)
   - Create RTK Query API file in `src/store/api/`
   - Define queries and mutations
3. **Create UI Components**:
   - Create page component in `src/pages/`
   - Create feature components in `src/components/features/[feature-name]/`
   - Add route in `src/routes/`
4. **Implement Business Logic**:
   - Add client-side validation matching business rules
   - Implement role-based access control
   - Handle approval workflows if applicable
5. **State Management** (if needed):
   - Create Redux slice for client state in `src/store/slices/`
   - Add reducer to store
6. **Testing**: Verify all business rules and user roles are respected

### Adding New API Endpoints
1. Create or update API file in `src/store/api/`
2. Use `baseApi.injectEndpoints()` pattern:
   ```typescript
   export const courseApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
       getCourses: builder.query<Course[], void>({
         query: () => '/courses',
       }),
       createCourse: builder.mutation<Course, CreateCourseDto>({
         query: (body) => ({
           url: '/courses',
           method: 'POST',
           body,
         }),
       }),
     }),
   });

   export const { useGetCoursesQuery, useCreateCourseMutation } = courseApi;
   ```
3. Use the auto-generated hooks in components

### Working with Schedules/Sessions
- Sessions are auto-generated from course templates
- Use time_slot_template for standardized time ranges
- Always validate conflicts before assignment
- Consider timezone handling for multi-branch operations

### Request Handling UIs
All request types follow similar patterns:
1. User initiates request with target entity + reason
2. Request goes to pending state
3. Approver reviews (Academic Staff/Center Head/Manager)
4. System executes changes upon approval
5. Audit trail preserved

## Documentation References

This project includes comprehensive documentation in the `docs/` folder:

- **[business-context.md](docs/business-context.md)**: Complete business domain documentation
  - User roles and permissions
  - Core entities and relationships
  - Business rules and workflows
  - Approval processes
  - **Read this first** before implementing any feature

- **[api-design.md](docs/api-design.md)**: Backend API design and endpoints
  - API endpoint specifications
  - Request/response formats
  - Use this when creating RTK Query endpoints

- **[uiux-design.md](docs/uiux-design.md)**: UI/UX design guidelines and patterns
  - Design system details
  - Component patterns
  - User flows

- **[sidebar-*.md](docs/)**: Sidebar implementation guides
  - Sidebar setup and customization
  - Navigation patterns

## Testing Strategy

No test framework currently configured. When adding tests, consider:
- Vitest (recommended for Vite projects)
- React Testing Library for component tests
- MSW (Mock Service Worker) for mocking RTK Query API calls
- Consider business rule validation as key test cases
- Test Redux slices and selectors
- Test RTK Query cache invalidation logic

## Future Enhancements

Based on README.md, consider upgrading ESLint config to:
- Type-aware lint rules (`recommendedTypeChecked` or `strictTypeChecked`)
- Stylistic type checking rules
- React-specific plugins (`eslint-plugin-react-x`, `eslint-plugin-react-dom`)

---

## Summary Checklist

When implementing features in this codebase, ensure:

**UI/UX:**
- [ ] Using shadcn/ui components exclusively (no raw HTML)
- [ ] Lucide icons for all visual elements
- [ ] Dark and light theme support
- [ ] Mobile-first responsive design
- [ ] Consistent spacing (Tailwind scale)
- [ ] Typography follows hierarchy rules

**Code Quality:**
- [ ] TypeScript interfaces defined for all props
- [ ] Strict TypeScript compliance (no `any`)
- [ ] Functional components with hooks
- [ ] Small, composable components
- [ ] Proper imports (`@/` for src paths, relative for local)
- [ ] ESLint rules passing
- [ ] Using RTK Query for API calls (not fetch/axios)
- [ ] Using typed Redux hooks (`useAppSelector`, `useAppDispatch`)

**Business Logic:**
- [ ] Reviewed relevant sections in `docs/business-context.md`
- [ ] User role permissions respected
- [ ] Business rules validated in UI
- [ ] Approval workflows implemented correctly
- [ ] Audit trail considerations

**Performance & Accessibility:**
- [ ] Loading states implemented
- [ ] Error boundaries in place
- [ ] ARIA labels where needed
- [ ] Color contrast meets standards
- [ ] Optimized re-renders (memo/callback where appropriate)

For questions about business requirements, always refer to `docs/business-context.md` first.
