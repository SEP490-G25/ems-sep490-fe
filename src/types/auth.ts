export type UserRole =
  | 'ADMIN'
  | 'MANAGER'
  | 'CENTER_HEAD'
  | 'SUBJECT_LEADER'
  | 'ACADEMIC_STAFF'
  | 'TEACHER'
  | 'STUDENT'
  | 'QA';

// API Response Types (matching backend DTOs)
/**
 * Branch information from backend BranchInfoDTO
 * Adjust fields based on actual BranchInfoDTO.java structure
 */
export interface BranchInfoDTO {
  id: number;
  code: string;
  name: string;
  // TODO: Add more fields from actual BranchInfoDTO.java if needed
  // address?: string;
  // status?: string;
}

/**
 * User information from backend UserInfoDTO
 * Matches: public class UserInfoDTO {
 *   private Long id;
 *   private String email;
 *   private String fullName;
 *   private List<String> roles;
 *   private List<BranchInfoDTO> branches;
 * }
 */
export interface UserInfoDTO {
  id: number;
  email: string;
  fullName: string; // Assuming camelCase (default Spring Boot)
  roles: UserRole[];
  branches: BranchInfoDTO[];
}

export interface LoginRequestDTO {
  email?: string;
  phone?: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfoDTO;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
  expiresIn: number;
}

export interface ResponseObject<T> {
  status: number;
  message: string;
  data: T;
}

// Legacy types removed - now using Redux + RTK Query
// See: src/store/slices/authSlice.ts for new auth state management
// See: src/hooks/useAuth.ts for the replacement of AuthContext
