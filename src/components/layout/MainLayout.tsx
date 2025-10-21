import type { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import type { SidebarUser } from '@/types/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface MainLayoutProps {
  /** Child components to render in main content area */
  children: ReactNode;
  /** Current user data */
  user: SidebarUser;
  /** Callback when logout is clicked */
  onLogout?: () => void;
  /** Optional breadcrumb title */
  breadcrumbTitle?: string;
}

/**
 * MainLayout - Main application layout with sidebar
 *
 * This layout uses shadcn sidebar-02 pattern with:
 * - User profile in header
 * - Logo in footer
 * - Toggle button for collapse/expand
 * - Role-based navigation
 * - Mobile responsive
 *
 * Usage:
 * ```tsx
 * <MainLayout user={currentUser} onLogout={handleLogout} breadcrumbTitle="Dashboard">
 *   <YourPageContent />
 * </MainLayout>
 * ```
 */
export function MainLayout({
  children,
  user,
  onLogout,
  breadcrumbTitle = 'Dashboard',
}: MainLayoutProps) {
  return (
    <SidebarProvider>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <AppSidebar user={user} onLogout={onLogout} />
      <SidebarInset>
        {/* Header with toggle and breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main content */}
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
