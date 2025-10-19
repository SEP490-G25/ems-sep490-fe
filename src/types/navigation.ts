import type { LucideIcon } from 'lucide-react';

/**
 * User role types in EMS system
 * Based on business-context.md section 2.1
 */
export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'CENTER_HEAD'
  | 'SUBJECT_LEADER'
  | 'ACADEMIC_STAFF'
  | 'TEACHER'
  | 'STUDENT'
  | 'QA';

/**
 * Navigation item structure
 * Supports nested submenus for complex navigation hierarchies
 */
export interface NavigationItem {
  /** Display title */
  title: string;
  /** Navigation URL path */
  url: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Is this the active/current page */
  isActive?: boolean;
  /** Nested submenu items */
  items?: NavigationSubItem[];
  /** Badge text (e.g., "New", "5") */
  badge?: string;
}

/**
 * Submenu item structure
 */
export interface NavigationSubItem {
  /** Display title */
  title: string;
  /** Navigation URL path */
  url: string;
  /** Is this the active/current page */
  isActive?: boolean;
  /** Badge text */
  badge?: string;
}

/**
 * Navigation configuration for a specific role
 */
export interface RoleNavigation {
  /** User role */
  role: UserRole;
  /** Display name for the role */
  roleName: string;
  /** Main navigation items */
  navMain: NavigationItem[];
}

/**
 * User data for sidebar display
 */
export interface SidebarUser {
  /** User's full name */
  name: string;
  /** User's email */
  email: string;
  /** User's role */
  role: UserRole;
  /** User's avatar URL (optional) */
  avatar?: string;
}
