"use client";

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Cookie names
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

// Cookie options
const cookieOptions = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Token management utilities
export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
    ...cookieOptions,
    expires: 1 / 96,
  });

  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    ...cookieOptions,
    expires: 7,
  });
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
};

// Track if we're currently refreshing
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Refresh tokens function
const refreshTokens = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    if (response.data.success) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      setTokens(accessToken, newRefreshToken);
      return accessToken;
    }
  } catch {
    clearTokens();
  }

  return null;
};

// Create singleton axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Request interceptor - add access token or refresh if missing
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      let token: string | undefined = getAccessToken();

      if (!token) {
        const refreshToken = getRefreshToken();
        if (refreshToken && !config.url?.includes("/auth/refresh")) {
          if (!isRefreshing) {
            isRefreshing = true;
            const newToken = await refreshTokens();
            isRefreshing = false;
            if (newToken) {
              token = newToken;
              onRefreshed(newToken);
            }
          } else {
            token = await new Promise<string>((resolve) => {
              subscribeTokenRefresh((newToken) => {
                resolve(newToken);
              });
            });
          }
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshTokens();
          isRefreshing = false;

          if (newToken) {
            onRefreshed(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          } else {
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(error);
          }
        } else {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            });
          });
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();

export const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
