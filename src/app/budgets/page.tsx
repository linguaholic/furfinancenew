'use client';

import { useFurFinanceStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { 
  Plus,
  Edit,
  Trash2,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PawPrint,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Budget } from '@/types';

export default function BudgetsPage() {
  const { budgets, pets, categories, deleteBudget, getMonthlyExpenses } = useFurFinanceStore();
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);

  const handleDeleteBudget = async (budgetId: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setDeletingBudgetId(budgetId);
      try {
        deleteBudget(budgetId);
      } finally {
        setDeletingBudgetId(null);
      }
    }
  };

  const getBudgetStatus = (budget: Budget) => {
    const pet = pets.find(p => p.id === budget.petId);
    const monthlyExpenses = getMonthlyExpenses(budget.petId);
    const budgetAmount = budget.period === 'monthly' ? budget.amount : budget.amount / 12;
    
    if (monthlyExpenses >= budgetAmount) {
      return { status: 'exceeded', color: 'destructive', icon: AlertTriangle };
    } else if (monthlyExpenses >= budgetAmount * 0.8) {
      return { status: 'warning', color: 'yellow', icon: TrendingUp };
    } else {
      return { status: 'good', color: 'green', icon: CheckCircle };
    }
  };

  const getBudgetProgress = (budget: Budget) => {
    const monthlyExpenses = getMonthlyExpenses(budget.petId);
    const budgetAmount = budget.period === 'monthly' ? budget.amount : budget.amount / 12;
    return Math.min((monthlyExpenses / budgetAmount) * 100, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Budgets</h1>
                <p className="text-xl text-muted-foreground">Track spending limits for your pets</p>
              </div>
            </div>
          </div>
          <Link href="/budgets/new">
            <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-5 w-5 mr-2" />
              Set Budget
            </Button>
          </Link>
        </div>
      </div>

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-happy-green/10 rounded-full flex items-center justify-center">
              <Target className="h-10 w-10 text-happy-green" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No budgets set</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Set spending limits to track your pet expenses against budgets
            </p>
            <Link href="/budgets/new">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Set Your First Budget
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {budgets.map((budget) => {
            const pet = pets.find(p => p.id === budget.petId);
            const category = categories.find(c => c.id === budget.categoryId);
            const status = getBudgetStatus(budget);
            const progress = getBudgetProgress(budget);
            const StatusIcon = status.icon;
            const monthlyExpenses = getMonthlyExpenses(budget.petId);
            const budgetAmount = budget.period === 'monthly' ? budget.amount : budget.amount / 12;

            return (
              <Card key={budget.id} className="bg-gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{category?.name} Budget</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <PawPrint className="h-3 w-3" />
                            {pet?.name}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {budget.period === 'monthly' ? 'Monthly' : 'Yearly'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold text-happy-green">
                          {formatCurrency(budgetAmount, budget.currency)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {budget.period === 'monthly' ? 'per month' : 'per year'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/budgets/${budget.id}/edit`}>
                          <Button size="sm" variant="outline" className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteBudget(budget.id)}
                          disabled={deletingBudgetId === budget.id}
                          className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all duration-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {formatCurrency(monthlyExpenses, budget.currency)} / {formatCurrency(budgetAmount, budget.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status.status === 'exceeded' ? 'bg-destructive' :
                          status.status === 'warning' ? 'bg-yellow-500' : 'bg-happy-green'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${
                      status.status === 'exceeded' ? 'text-destructive' :
                      status.status === 'warning' ? 'text-yellow-500' : 'text-happy-green'
                    }`} />
                    <span className={`text-sm font-medium ${
                      status.status === 'exceeded' ? 'text-destructive' :
                      status.status === 'warning' ? 'text-yellow-500' : 'text-happy-green'
                    }`}>
                      {status.status === 'exceeded' ? 'Budget exceeded' :
                       status.status === 'warning' ? 'Approaching limit' : 'Within budget'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 