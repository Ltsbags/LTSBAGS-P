'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser } from './types';

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
  authenticated: boolean;
  expiresAt: string | null;
}

export function useAdminAuth(options: { requireAuth?: boolean; requiredRole?: AdminUser['role'] } = { requireAuth: true }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
    expiresAt: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth/me', {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setState({
            user: data.user,
            loading: false,
            authenticated: true,
            expiresAt: data.session?.expiresAt || null,
          });

          // Check role requirements if specified
          if (options.requiredRole && data.user.role !== options.requiredRole && data.user.role !== 'SUPER_ADMIN') {
            router.push('/admin/dashboard?error=unauthorized_role');
          }
          return;
        }
      }

      // Not authenticated
      setState({
        user: null,
        loading: false,
        authenticated: false,
        expiresAt: null,
      });

      if (options.requireAuth) {
        localStorage.removeItem('apex_admin_logged_in');
        localStorage.removeItem('apex_admin_email');
        router.push('/admin/login');
      }
    } catch (err) {
      console.error('Auth verification error:', err);
      setState({
        user: null,
        loading: false,
        authenticated: false,
        expiresAt: null,
      });
      if (options.requireAuth) {
        router.push('/admin/login');
      }
    }
  }, [options.requireAuth, options.requiredRole, router]);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/auth/me', { method: 'GET', headers: { 'Cache-Control': 'no-cache' } })
      .then(async (res) => {
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setState({
              user: data.user,
              loading: false,
              authenticated: true,
              expiresAt: data.session?.expiresAt || null,
            });
            if (options.requiredRole && data.user.role !== options.requiredRole && data.user.role !== 'SUPER_ADMIN') {
              router.push('/admin/dashboard?error=unauthorized_role');
            }
            return;
          }
        }
        setState({
          user: null,
          loading: false,
          authenticated: false,
          expiresAt: null,
        });
        if (options.requireAuth) {
          localStorage.removeItem('apex_admin_logged_in');
          localStorage.removeItem('apex_admin_email');
          router.push('/admin/login');
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error(err);
        setState({
          user: null,
          loading: false,
          authenticated: false,
          expiresAt: null,
        });
        if (options.requireAuth) {
          router.push('/admin/login');
        }
      });

    return () => {
      active = false;
    };
  }, [options.requireAuth, options.requiredRole, router]);

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('apex_admin_logged_in');
      localStorage.removeItem('apex_admin_email');
      setState({
        user: null,
        loading: false,
        authenticated: false,
        expiresAt: null,
      });
      router.push('/admin/login');
    }
  };

  return {
    ...state,
    logout,
    refetch: checkAuth,
  };
}
