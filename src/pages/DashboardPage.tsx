import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import type { SidebarUser } from '@/types/navigation';
import type { UserRole } from '@/types/auth';

export const DashboardPage = () => {
  const { user, logout } = useAuth();

  // Redirect to role-specific dashboard based on user role
  // Based on uiux-design.md section 1.2 User Dashboard Landing
  if (user?.roles && user.roles.length > 0) {
    const primaryRole = user.roles[0] as UserRole;

    const roleDashboardMap: Record<UserRole, string> = {
      ADMIN: '/dashboards/admin',
      MANAGER: '/dashboards/manager',
      CENTER_HEAD: '/dashboards/center-head',
      SUBJECT_LEADER: '/dashboards/subject-leader',
      ACADEMIC_STAFF: '/dashboards/academic-staff',
      TEACHER: '/dashboards/teacher',
      STUDENT: '/dashboards/student',
      QA: '/dashboards/qa',
    };

    const targetDashboard = roleDashboardMap[primaryRole];

    if (targetDashboard) {
      return <Navigate to={targetDashboard} replace />;
    }
  }

  // Convert auth user to sidebar user
  const sidebarUser: SidebarUser = {
    name: user?.fullName || 'User',
    email: user?.email || '',
    role: user?.roles?.[0] || 'STUDENT',
    // Pass primary branch (first branch) if available
    primaryBranch: user?.branches?.[0]
      ? {
          id: user.branches[0].id,
          code: user.branches[0].code,
          name: user.branches[0].name,
        }
      : undefined,
  };

  return (
    <MainLayout user={sidebarUser} onLogout={logout}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.fullName}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{user?.roles?.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium">{user?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Branches</p>
                  <p className="font-medium">
                    {user?.branches && user.branches.length > 0
                      ? user.branches.map((b) => `${b.name} (${b.code})`).join(', ')
                      : 'No branches assigned'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quick actions will be added here based on your role and permissions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Activity feed will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
