'use client';

import { BudgetForm } from '@/components/forms/BudgetForm';
import { useRouter } from 'next/navigation';

export default function NewBudgetPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/budgets');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BudgetForm onSuccess={handleSuccess} />
    </div>
  );
} 