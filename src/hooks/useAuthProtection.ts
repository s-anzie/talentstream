
"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/lib/types';

interface AuthProtectionOptions {
  requiredRole?: User['role'] | User['role'][]; // Allow single role or array of roles
  redirectPath?: string;
}

export function useAuthProtection(options?: AuthProtectionOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  const defaultRedirectPath = '/auth/login';
  const redirectPath = options?.redirectPath || defaultRedirectPath;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isAuthPage = pathname.startsWith('/auth');
    const isCommonPublicPage = !pathname.startsWith('/user') && !pathname.startsWith('/dashboard') && !isAuthPage;

    if (!isAuthenticated) {
      // If not on an auth page OR a common public page, redirect to login
      if (!isAuthPage && !isCommonPublicPage) {
        router.replace(`${redirectPath}?next=${encodeURIComponent(pathname)}`);
      }
      return;
    }

    // If authenticated:
    if (isAuthPage) {
      // Redirect away from auth pages if logged in
      if (user?.role === 'candidate') {
        router.replace('/jobs'); // Or /user
      } else if (user?.role === 'recruiter_unassociated') {
        router.replace('/auth/recruiter-onboarding');
      } else if (user?.role === 'recruiter' || user?.role === 'admin') {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
      return;
    }

    // Role-based protection for private areas
    if (options?.requiredRole) {
      const requiredRoles = Array.isArray(options.requiredRole) ? options.requiredRole : [options.requiredRole];
      if (!user?.role || !requiredRoles.includes(user.role)) {
        // User role doesn't match required role(s), redirect
        if (user?.role === 'candidate') {
          router.replace('/jobs');
        } else if (user?.role === 'recruiter_unassociated') {
          router.replace('/auth/recruiter-onboarding');
        } else if (user?.role === 'recruiter' || user?.role === 'admin') {
          router.replace('/dashboard');
        } else {
          router.replace('/'); // Fallback, or an 'unauthorized' page
        }
      }
    }

  }, [isAuthenticated, user, isLoading, router, pathname, redirectPath, options?.requiredRole]);

  return { isAuthenticated, user, isLoading };
}
