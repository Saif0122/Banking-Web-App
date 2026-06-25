"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginPayload, RegisterPayload } from "@/features/auth/types/auth.types";
import { useCurrentUser, useLogin, useRegister, useLogout } from "@/features/auth/hooks/auth.hooks";
import { removeToken } from "@/services/api-client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Assume we might have a token via HttpOnly cookies. 
  // If the `/me` endpoint fails, hasToken will be set to false.
  const [hasToken, setHasToken] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(true);
  const { data: user, isLoading: isUserLoading, error } = useCurrentUser(hasToken);
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // If there's an error fetching the user (e.g. 401), we clear the token state
  useEffect(() => {
    if (error) {
      setTimeout(() => setHasToken(false), 0);
    }
  }, [error]);

  const login = async (data: LoginPayload) => {
    await loginMutation.mutateAsync(data);
    setHasToken(true);
  };

  const register = async (data: RegisterPayload) => {
    await registerMutation.mutateAsync(data);
    setHasToken(true);
  };

  const logoutMutation = useLogout();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setHasToken(false);
      router.push("/login");
    }
  };

  // Wait for initial token check and TanStack query to finish
  const isLoading = !isInitialized || (hasToken ? isUserLoading : false);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
