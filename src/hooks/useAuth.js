import { useContext, createContext } from 'react';

// Create Auth Context
export const AuthContext = createContext();

/**
 * Custom hook to use authentication
 * @returns {Object} Authentication state and methods
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * Hook to check if user is authenticated
 * @returns {Boolean} true if user is logged in
 */
export function useIsAuthenticated() {
  const { user } = useAuth();
  return !!user;
}

/**
 * Hook to get user profile with background info
 * @returns {Object} User profile data
 */
export function useUserProfile() {
  const { user } = useAuth();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    softwareBackground: user.softwareBackground,
    hardwareBackground: user.hardwareBackground,
    experience: user.experience,
    interests: user.interests,
    joinedAt: user.joinedAt,
  };
}
