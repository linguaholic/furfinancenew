'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFurFinanceStore } from '@/store';
import { Budget } from '@/types';
import { ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const budgetSchema = z.object({
  petId: z.string().min(1, 'Please select a pet'),
  categoryId: z.string().min(1, 'Please select a category'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Please select a currency'),
  period: z.enum(['monthly', 'yearly']),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  budget?: Budget;
  onSuccess?: () => void;
}

export function BudgetForm({ budget, onSuccess }: BudgetFormProps) {
  const { addBudget, updateBudget, pets, categories, settings } = useFurFinanceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const defaultPetId = searchParams.get('petId') || '';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budget ? {
      petId: budget.petId,
      categoryId: budget.categoryId,
      amount: budget.amount,
      currency: budget.currency,
      period: budget.period,
    } : {
      petId: defaultPetId,
      categoryId: '',
      amount: 0,
      currency: settings.defaultCurrency,
      period: 'monthly',
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    setIsSubmitting(true);
    try {
      if (budget) {
        updateBudget(budget.id, data);
        toast.success('Budget updated successfully! 🎯');
      } else {
        addBudget(data);
        toast.success('Budget set successfully! 🎯');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: Record<string, { message: string }>) => {
    const errorMessages = Object.values(errors).map((error: { message: string }) => error.message);
    toast.error(`Please fill in all required fields: ${errorMessages.join(', ')}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/budgets" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Budgets
        </Link>
      </div>

      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {budget ? 'Edit Budget' : 'Set Budget'}
              </CardTitle>
              <CardDescription className="text-lg">
                {budget ? 'Update your pet budget settings' : 'Set spending limits for your furry friend'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pet Selection */}
              <div className="space-y-2">
                <Label htmlFor="petId" className="text-foreground">Pet *</Label>
                <Controller
                  name="petId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary border-border focus:border-happy-green">
                        <SelectValue placeholder="Select a pet" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#000000', border: '1px solid #333333' }}>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id} style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                            {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.petId && (
                  <p className="text-sm text-destructive mt-1">{errors.petId.message}</p>
                )}
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-foreground">Category *</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary border-border focus:border-happy-green">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#000000', border: '1px solid #333333' }}>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">Amount *</Label>
                <Input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="bg-secondary border-border focus:border-happy-green"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
                )}
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-foreground">Currency *</Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary border-border focus:border-happy-green">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#000000', border: '1px solid #333333' }}>
                        {settings.availableCurrencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code} style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{currency.symbol}</span>
                              <span>{currency.code}</span>
                              <span className="text-muted-foreground">({currency.name})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currency && (
                  <p className="text-sm text-destructive mt-1">{errors.currency.message}</p>
                )}
              </div>

              {/* Period */}
              <div className="space-y-2">
                <Label htmlFor="period" className="text-foreground">Period *</Label>
                <Controller
                  name="period"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary border-border focus:border-happy-green">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#000000', border: '1px solid #333333' }}>
                        <SelectItem value="monthly" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                          Monthly
                        </SelectItem>
                        <SelectItem value="yearly" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                          Yearly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.period && (
                  <p className="text-sm text-destructive mt-1">{errors.period.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
              >
                {isSubmitting ? 'Saving...' : (budget ? 'Update Budget' : 'Set Budget')}
              </Button>
              <Link href="/budgets">
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300 px-8 py-3 rounded-xl"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 