'use client';

import { useState, useEffect } from 'react';
import { authApi } from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'enumerator';
  first_name?: string;
  last_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.getCurrentUser();
        setUser(response.data);
      } catch (err: any) {
        console.error('Failed to fetch user:', err);
        setError('Failed to fetch user information');
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a token
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  const isAdmin = user?.role === 'admin';
  const isEnumerator = user?.role === 'enumerator';

  return {
    user,
    isLoading,
    error,
    isAdmin,
    isEnumerator,
  };
} 