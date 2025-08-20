'use client';

import { useEffect, useState } from 'react';
import { useFurFinanceStore } from '@/store';
import { Expense } from '@/types';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { useRouter, notFound } from 'next/navigation';

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default function EditExpensePage({ params }: EditExpensePageProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <ExpenseFormWrapper params={params} />
    </div>
  );
}

function ExpenseFormWrapper({ params }: EditExpensePageProps) {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const { expenses } = useFurFinanceStore();
  const router = useRouter();

  useEffect(() => {
    const loadExpense = async () => {
      const { id } = await params;
      const foundExpense = expenses.find(e => e.id === id) || null;
      setExpense(foundExpense);
      setLoading(false);
    };

    loadExpense();
  }, [params, expenses]);

  const handleSuccess = () => {
    router.push('/expenses');
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!expense) {
    notFound();
  }

  return <ExpenseForm expense={expense!} onSuccess={handleSuccess} />;
}


