

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearAccessToken,
  hydrateAccessToken,
  setAccessToken,
} from "@/lib/auth-token";
import { login, me, register } from "@/services/auth.service";
import {
  AuthUser,
  LoginData,
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
} from "@/types/auth";

const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthHydrating: boolean;
  isLoadingMe: boolean;
  loginPending: boolean;
  registerPending: boolean;
  login: (params: LoginParams) => Promise<LoginResponse>;
  register: (params: RegisterParams) => Promise<RegisterResponse>;
  refetchMe: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function extractToken(loginData: LoginData): string | null {
  if (typeof loginData === "string") {
    return loginData;
  }

  if (typeof loginData !== "object" || !loginData) {
    return null;
  }

  if (typeof loginData.accessToken === "string" && loginData.accessToken.length > 0) {
    return loginData.accessToken;
  }

  if (typeof loginData.token === "string" && loginData.token.length > 0) {
    return loginData.token;
  }

  return null;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isAuthHydrating, setIsAuthHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const storedToken = await hydrateAccessToken();
        if (isMounted) {
          setToken(storedToken);
        }
      } finally {
        if (isMounted) {
          setIsAuthHydrating(false);
        }
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const meQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: me,
    enabled: Boolean(token) && !isAuthHydrating,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401) {
        return false;
      }
      return failureCount < 1;
    },
  });

  useEffect(() => {
    const status = (meQuery.error as AxiosError | null)?.response?.status;
    if (status !== 401) {
      return;
    }

    const clearSession = async () => {
      await clearAccessToken();
      setToken(null);
      queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
    };

    void clearSession();
  }, [meQuery.error, queryClient]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      const parsedToken = extractToken(response.data);

      if (!parsedToken) {
        throw new Error("Token tidak ditemukan pada response login.");
      }

      await setAccessToken(parsedToken);
      setToken(parsedToken);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
  });

  const logout = async () => {
    await clearAccessToken();
    setToken(null);
    queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: meQuery.data?.data ?? null,
      isAuthenticated: Boolean(token),
      isAuthHydrating,
      isLoadingMe: meQuery.isFetching,
      loginPending: loginMutation.isPending,
      registerPending: registerMutation.isPending,
      login: loginMutation.mutateAsync,
      register: registerMutation.mutateAsync,
      refetchMe: async () => {
        await meQuery.refetch();
      },
      logout,
    }),
    [
      isAuthHydrating,
      loginMutation.isPending,
      loginMutation.mutateAsync,
      meQuery.data?.data,
      meQuery.isFetching,
      meQuery.refetch,
      registerMutation.isPending,
      registerMutation.mutateAsync,
      token,
    ],
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  }

  return context;
}
