import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SidebarUser, UserRole } from '@/types/navigation';
import { getAllRoles } from '@/lib/navigation-config';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * SidebarDemo - Demo page showcasing role-based sidebar navigation
 *
 * Features demonstrated:
 * - Role-based navigation (8 roles)
 * - Sidebar toggle/collapse
 * - User profile in header
 * - Logo in footer
 * - Collapsible navigation sections
 * - Badge notifications
 * - Mobile responsive
 */
export default function SidebarDemo() {
  const [currentRole, setCurrentRole] = useState<UserRole>('ACADEMIC_STAFF');

  // Mock user data for different roles
  const mockUsers: Record<UserRole, SidebarUser> = {
    ADMIN: {
      name: 'Admin User',
      email: 'admin@ems.edu',
      role: 'ADMIN',
    },
    MANAGER: {
      name: 'Nguyễn Văn Manager',
      email: 'manager@ems.edu',
      role: 'MANAGER',
    },
    CENTER_HEAD: {
      name: 'Trần Thị Director',
      email: 'director@ems.edu',
      role: 'CENTER_HEAD',
    },
    SUBJECT_LEADER: {
      name: 'Lê Văn Leader',
      email: 'leader@ems.edu',
      role: 'SUBJECT_LEADER',
    },
    ACADEMIC_STAFF: {
      name: 'Phạm Thị Giáo Vụ',
      email: 'giaovu@ems.edu',
      role: 'ACADEMIC_STAFF',
    },
    TEACHER: {
      name: 'Hoàng Văn Teacher',
      email: 'teacher@ems.edu',
      role: 'TEACHER',
    },
    STUDENT: {
      name: 'Nguyễn Thị Student',
      email: 'student@ems.edu',
      role: 'STUDENT',
    },
    QA: {
      name: 'QA Specialist',
      email: 'qa@ems.edu',
      role: 'QA',
    },
  };

  const currentUser = mockUsers[currentRole];

  const handleLogout = () => {
    alert('Logout clicked!');
  };

  const roleDescriptions: Record<UserRole, string> = {
    ADMIN: 'Full system access, user management, system configuration',
    MANAGER: 'System-wide operational excellence, strategic decisions, course approval',
    CENTER_HEAD: 'Direct branch management, operational approvals, resource management',
    SUBJECT_LEADER: 'Curriculum design, course creation, learning outcomes, materials',
    ACADEMIC_STAFF:
      'Class creation, enrollment, resource assignment, request processing (KEY ROLE)',
    TEACHER: 'Teaching sessions, attendance, assessments, availability, requests',
    STUDENT: 'Personal schedule, classes, attendance, grades, requests, feedback',
    QA: 'Quality monitoring, reports, feedback analysis, CLO tracking',
  };

  return (
    <MainLayout user={currentUser} onLogout={handleLogout} breadcrumbTitle="Sidebar Demo">
      <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        {/* Header with Role Switcher */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">EMS Sidebar Demo</h1>
            <p className="mt-2 text-muted-foreground">
              Role-based navigation system for Education Management System
            </p>
          </div>

          {/* Role Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full lg:w-auto">
                Current Role: {currentRole}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Switch Role to Test</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {getAllRoles().map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={currentRole === role ? 'bg-accent' : ''}
                >
                  {currentRole === role && <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Current Role Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentRole}</CardTitle>
              <Badge variant="secondary">{mockUsers[currentRole].email}</Badge>
            </div>
            <CardDescription>{roleDescriptions[currentRole]}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Name:</span>
                <span className="text-sm">{currentUser.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Email:</span>
                <span className="text-sm">{currentUser.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Showcase Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ User in Header</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                User profile displayed at the top of sidebar with dropdown menu for
                profile, settings, and logout
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Logo in Footer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                EMS branding and logo positioned at the bottom of the sidebar for
                clean design
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Toggle Button</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click the hamburger icon (☰) in the header to collapse/expand the
                sidebar. Keyboard shortcut: Cmd+B / Ctrl+B
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Role-Based Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Navigation menu automatically adapts based on user role. Try switching
                roles above to see different menus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Collapsible Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click on navigation items with chevron icons to expand/collapse
                submenus for better organization
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Badge Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visual indicators show pending approvals, new requests, and important
                notifications (e.g., "5" pending items)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Active Route Highlighting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Current page is highlighted in the navigation menu for clear visual
                feedback of your location
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Mobile Responsive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Resize your browser to see mobile drawer navigation. Works seamlessly
                on all device sizes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✅ Shadcn Sidebar-02</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with official shadcn/ui sidebar-02 pattern with full features and
                accessibility
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test Sidebar</CardTitle>
            <CardDescription>Follow these steps to test all features</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li className="text-muted-foreground">
                <strong className="text-foreground">Toggle Sidebar:</strong> Click the
                hamburger icon (☰) in the top-left to collapse/expand the sidebar
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">Switch Roles:</strong> Use the
                dropdown above to switch between different user roles
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">Expand Menus:</strong> Click on
                navigation items with chevrons to see submenus
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">User Profile:</strong> Click on the
                user profile in sidebar header to see dropdown menu
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">Mobile View:</strong> Resize browser
                to &lt;1024px width to test mobile responsive behavior
              </li>
              <li className="text-muted-foreground">
                <strong className="text-foreground">Keyboard Shortcut:</strong> Press
                Cmd+B (Mac) or Ctrl+B (Windows) to toggle sidebar
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Business Context Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Role Responsibilities Overview</CardTitle>
            <CardDescription>Based on business-context.md</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">ADMIN</h4>
                    <Badge variant="outline">System Level</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Full system access</li>
                    <li>User & role management</li>
                    <li>System configuration</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">MANAGER</h4>
                    <Badge variant="outline">Strategic</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Cross-branch KPIs</li>
                    <li>Course approval</li>
                    <li>Executive oversight</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">CENTER_HEAD</h4>
                    <Badge variant="outline">Branch Level</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Branch operations</li>
                    <li>Class approval</li>
                    <li>Resource management</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">SUBJECT_LEADER</h4>
                    <Badge variant="outline">Curriculum</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Course design</li>
                    <li>Learning outcomes (PLO/CLO)</li>
                    <li>Materials upload</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border p-3 bg-accent/50">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">ACADEMIC_STAFF</h4>
                    <Badge>KEY ROLE</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Class creation & scheduling</li>
                    <li>Student enrollment</li>
                    <li>Request processing</li>
                    <li>Resource assignment</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">TEACHER</h4>
                    <Badge variant="outline">Instruction</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Session delivery</li>
                    <li>Attendance marking</li>
                    <li>Score entry & feedback</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">STUDENT</h4>
                    <Badge variant="outline">Learner</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Attend classes</li>
                    <li>View grades & schedule</li>
                    <li>Submit requests</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-semibold">QA</h4>
                    <Badge variant="outline">Quality</Badge>
                  </div>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Quality monitoring</li>
                    <li>QA reports</li>
                    <li>CLO tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
