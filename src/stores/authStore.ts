
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, LoginFormData, RegisterFormData } from '@/lib/types';
import { apiLogin, apiRegister, apiFetchUserProfile } from '@/lib/mock-api-services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginFormData) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  updateUserCompanyAssociation: (companyId: string, companyName: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const userData = await apiLogin(credentials);
          set({ user: userData, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch (err: any) {
          set({ error: err.message || 'Login failed', isAuthenticated: false, isLoading: false, user: null });
          return false;
        }
      },
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const userData = await apiRegister(data);
          set({ user: userData, isAuthenticated: true, isLoading: false, error: null });
          return true;
        } catch (err: any) {
          set({ error: err.message || 'Registration failed', isAuthenticated: false, isLoading: false, user: null });
          return false;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
      },
      checkAuthStatus: async () => {
        const currentAuth = get();
        if (currentAuth.isAuthenticated && currentAuth.user?.id) {
          set({ isLoading: true });
          try {
            const userData = await apiFetchUserProfile(currentAuth.user!.id);
            if (userData) {
              set({ user: userData, isLoading: false, isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false, error: "User not found during auth check."});
            }
          } catch (err: any) {
            console.error("Failed to re-fetch user on auth check:", err);
            set({ isLoading: false, error: "Session refresh failed.", user: null, isAuthenticated: false });
          }
        } else if (currentAuth.user || currentAuth.isAuthenticated) {
           set({ user: null, isAuthenticated: false, error: null, isLoading: false });
        }
      },
      updateUserCompanyAssociation: (companyId: string, companyName: string) => {
        set((state) => ({
          user: state.user ? { ...state.user, companyId, companyName, role: 'recruiter' } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          id: state.user.id,
          role: state.user.role,
          fullName: state.user.fullName,
          email: state.user.email,
          avatarUrl: state.user.avatarUrl,
          companyId: state.user.companyId,
          companyName: state.user.companyName
        } : null
      }),
    }
  )
);
