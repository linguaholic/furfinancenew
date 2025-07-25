'use client';

import { BudgetForm } from '@/components/forms/BudgetForm';
import { useFurFinanceStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Budget } from '@/types';

interface EditBudgetPageClientProps {
  budgetId: string;
}

export function EditBudgetPageClient({ budgetId }: EditBudgetPageClientProps) {
  const { budgets } = useFurFinanceStore();
  const router = useRouter();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundBudget = budgets.find(b => b.id === budgetId);
    if (foundBudget) {
      setBudget(foundBudget);
    } else {
      // Budget not found, redirect to budgets page
      router.push('/budgets');
    }
    setLoading(false);
  }, [budgetId, budgets, router]);

  const handleSuccess = () => {
    router.push('/budgets');
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardContent className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-happy-green" />
            <span className="text-lg">Loading budget...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!budget) {
    return null; // Will redirect in useEffect
  }

  return <BudgetForm budget={budget} onSuccess={handleSuccess} />;
} 