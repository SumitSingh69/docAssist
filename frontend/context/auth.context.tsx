"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  useAxios,
  setTokens,
  clearTokens,
  getAccessToken,
} from "@/hooks/use-axios";
import { AxiosError } from "axios";

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image?: string;
  age?: number;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details?: unknown;
  };
}

interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface SignupResponseData {
  user: User;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const axios = useAxios();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const response = await axios.get<ApiResponse<User>>("/user/me");
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch {
          // Token invalid or expired
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [axios]);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await axios.post<ApiResponse<LoginData>>(
          "/auth/login",
          {
            email,
            password,
          }
        );

        if (response.data.success) {
          const { user, accessToken, refreshToken } = response.data.data;

          // Store tokens in cookies
          setTokens(accessToken, refreshToken);

          // Set user state
          setUser(user);

          return { success: true, message: "Login successful" };
        }

        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message =
          axiosError.response?.data?.message ||
          "An error occurred during login";
        return { success: false, message };
      }
    },
    [axios]
  );

  // Signup function
  const signup = useCallback(
    async (data: SignupData) => {
      try {
        const response = await axios.post<ApiResponse<SignupResponseData>>(
          "/auth/register",
          data
        );

        if (response.data.success) {
          return { success: true, message: "Account created successfully" };
        }

        return {
          success: false,
          message: response.data.message || "Registration failed",
        };
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<null>>;
        const message =
          axiosError.response?.data?.message ||
          "An error occurred during registration";
        return { success: false, message };
      }
    },
    [axios]
  );

  // Logout function
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse<User>>("/user/me");
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch {
      // Handle silently
    }
  }, [axios]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
