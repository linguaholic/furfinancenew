'use client';

import { BudgetForm } from '@/components/forms/BudgetForm';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

export default function NewBudgetPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/budgets');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
      <BudgetForm onSuccess={handleSuccess} />
      </Suspense>
    </div>
  );
} 