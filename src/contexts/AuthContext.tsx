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
      // For now, mock authentication
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Test User',
        role: 'ADMIN',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

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
