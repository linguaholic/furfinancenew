'use client';

import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function NewExpensePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/expenses');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
      <ExpenseForm onSuccess={handleSuccess} />
      </Suspense>
    </div>
  );
} 