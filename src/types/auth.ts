export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'CENTER_HEAD'
  | 'SUBJECT_LEADER'
  | 'ACADEMIC_STAFF'
  | 'TEACHER'
  | 'STUDENT'
  | 'QA';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  centerId?: string;
  branchId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
