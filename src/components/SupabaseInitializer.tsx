'use client';

import { useEffect } from 'react';
import { useFurFinanceStore } from '@/store';

export function SupabaseInitializer() {
  const initialize = useFurFinanceStore((state) => state.initialize);
  const isLoading = useFurFinanceStore((state) => state.isLoading);
  const error = useFurFinanceStore((state) => state.error);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading state or error if needed
  if (error) {
    console.error('Supabase initialization error:', error);
  }

  return null; // This component doesn't render anything
} 