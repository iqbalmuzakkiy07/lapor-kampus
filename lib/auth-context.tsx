"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types/database";
import { db } from "./db";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = "laporkampus_current_user_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const allUsers = db.getUsers();

  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedUserId) {
        const found = allUsers.find((u) => u.id === savedUserId);
        if (found) {
          setUser(found);
          setIsLoading(false);
          return;
        }
      }
      // Default to student user Ahmad Fauzi on fresh launch
      const defaultUser = allUsers[0];
      setUser(defaultUser);
      localStorage.setItem(STORAGE_KEY_AUTH, defaultUser.id);
    } catch {
      setUser(allUsers[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string): Promise<boolean> => {
    // identifier can be email or nim/nip
    const clean = identifier.trim().toLowerCase();
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === clean || u.nim_nip.toLowerCase() === clean
    );
    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEY_AUTH, found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setUser(null);
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEY_AUTH, found.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isLoading,
        login,
        logout,
        switchUser,
        allUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

