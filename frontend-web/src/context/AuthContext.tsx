import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, LoginCredentials, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';
import { ApiError } from '../config/api';

export const AUTH_STORAGE_KEY = 'aau_campus_market_auth';

interface StoredAuth {
  token: string;
  refreshToken: string;
  user: User;
}

export function loadAuthFromStorage(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.token === 'string' && parsed.user && typeof parsed.user.id === 'string') {
      return parsed as StoredAuth;
    }
    return null;
  } catch (err) {
    console.error('Failed to parse auth from localStorage, resetting:', err);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialToken?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialUser, initialToken }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    if (initialUser !== undefined) return initialUser;
    const stored = loadAuthFromStorage();
    return stored?.user ?? null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (initialToken !== undefined) return initialToken;
    const stored = loadAuthFromStorage();
    return stored?.token ?? null;
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    const stored = loadAuthFromStorage();
    return stored?.refreshToken ?? null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validate or verify session on initial load if token exists
  useEffect(() => {
    const stored = loadAuthFromStorage();
    if (stored?.token && !initialUser) {
      // Background verify session with /auth/me
      authService
        .getMe(stored.token)
        .then((latestUser) => {
          setUser(latestUser);
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              token: stored.token,
              refreshToken: stored.refreshToken,
              user: latestUser,
            })
          );
        })
        .catch((err) => {
          // If token has expired or is unauthorized, clear session
          if (err instanceof ApiError && (err.statusCode === 401 || err.code === 'INVALID_TOKEN')) {
            console.warn('Session token expired; logging out user.');
            setUser(null);
            setToken(null);
            setRefreshToken(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        });
    }
  }, [initialUser]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        })
      );

      return { success: true };
    } catch (err: any) {
      const message =
        err?.message ||
        (err instanceof ApiError ? err.message : 'Login failed. Please check your network connection.');
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      await authService.logout(token, refreshToken || undefined);
    }
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [token, refreshToken]);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes(user.role);
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
