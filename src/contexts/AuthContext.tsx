import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, LoginCredentials, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // TODO: Replace with actual API call
      // For now, mock authentication with different roles based on email

      // Mock user database - cho phép login với các email khác nhau để test role
      const mockUsers: Record<string, User> = {
        'admin@ems.edu': {
          id: '1',
          email: 'admin@ems.edu',
          name: 'Admin User',
          role: 'ADMIN',
        },
        'manager@ems.edu': {
          id: '2',
          email: 'manager@ems.edu',
          name: 'Nguyễn Văn Manager',
          role: 'MANAGER',
        },
        'director@ems.edu': {
          id: '3',
          email: 'director@ems.edu',
          name: 'Trần Thị Director',
          role: 'CENTER_HEAD',
        },
        'leader@ems.edu': {
          id: '4',
          email: 'leader@ems.edu',
          name: 'Lê Văn Leader',
          role: 'SUBJECT_LEADER',
        },
        'giaovu@ems.edu': {
          id: '5',
          email: 'giaovu@ems.edu',
          name: 'Phạm Thị Giáo Vụ',
          role: 'ACADEMIC_STAFF',
        },
        'teacher@ems.edu': {
          id: '6',
          email: 'teacher@ems.edu',
          name: 'Hoàng Văn Teacher',
          role: 'TEACHER',
        },
        'student@ems.edu': {
          id: '7',
          email: 'student@ems.edu',
          name: 'Nguyễn Thị Student',
          role: 'STUDENT',
        },
        'qa@ems.edu': {
          id: '8',
          email: 'qa@ems.edu',
          name: 'QA Specialist',
          role: 'QA',
        },
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Tìm user dựa vào email, nếu không có thì default là ADMIN
      const mockUser = mockUsers[credentials.email] || {
        id: '99',
        email: credentials.email,
        name: 'Test User',
        role: 'ADMIN' as const,
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Store token in localStorage
      localStorage.setItem('auth_token', 'mock_token');
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
