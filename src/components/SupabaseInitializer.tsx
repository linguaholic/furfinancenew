'use client';

import { useEffect } from 'react';
import { useFurFinanceStore } from '@/store';
import { testSupabaseConnection } from '@/lib/supabase-service';

export function SupabaseInitializer() {
  const initialize = useFurFinanceStore((state) => state.initialize);

  const error = useFurFinanceStore((state) => state.error);

  useEffect(() => {
    // Test connection first
    testSupabaseConnection().then((result) => {
      console.log('Supabase connection test result:', result);
      if (result.success) {
        initialize();
      } else {
        console.error('Supabase connection failed, not initializing store');
      }
    });
  }, [initialize]);

  // Show loading state or error if needed
  if (error) {
    console.error('Supabase initialization error:', error);
  }

  return null; // This component doesn't render anything
} 