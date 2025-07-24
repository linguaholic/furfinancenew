'use client';

import { useState } from 'react';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFurFinanceStore } from '@/store';
import { Expense, Currency } from '@/types';
import { getCurrencySymbol } from '@/lib/utils';
import { ArrowLeft, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const expenseSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'] as const),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  receipt: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const { addExpense, updateExpense, pets, categories, settings } = useFurFinanceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const defaultPetId = searchParams.get('petId') || '';

  const {
    register,
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense ? {
      petId: expense.petId,
      categoryId: expense.categoryId,
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description,
      date: expense.date.split('T')[0],
      receipt: expense.receipt || '',
    } : {
      petId: defaultPetId,
      categoryId: '',
      amount: 0,
      currency: settings.defaultCurrency,
      description: '',
      date: new Date().toISOString().split('T')[0],
      receipt: '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      if (expense) {
        updateExpense(expense.id, data);
        toast.success('Expense updated successfully! 🎉');
      } else {
        addExpense(data);
        toast.success('Expense added successfully! 🎉');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<ExpenseFormData>) => {
    const errorMessages = Object.values(errors).map((error) => error?.message || 'Invalid field').filter(Boolean);
    toast.error(`Please fill in all required fields: ${errorMessages.join(', ')}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/expenses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Expenses
        </Link>
      </div>

      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{expense ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
              <CardDescription>
                {expense ? 'Update expense details' : 'Track a new expense for your pet'}
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
                      <SelectContent className="bg-black border border-gray-700 z-50">
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id} className="bg-black text-white hover:bg-gray-800 focus:bg-gray-800">
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
                      <SelectContent className="bg-black border border-gray-700 z-50">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="bg-black text-white hover:bg-gray-800 focus:bg-gray-800">
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
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="0.00"
                  className="bg-secondary border-border focus:border-happy-green"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
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
                      <SelectContent className="bg-black border border-gray-700 z-50">
                        {settings.availableCurrencies.map((currency) => (
                          <SelectItem key={currency} value={currency} className="bg-black text-white hover:bg-gray-800 focus:bg-gray-800">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{getCurrencySymbol(currency)}</span>
                              <span>{currency}</span>
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

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="bg-secondary border-border focus:border-happy-green"
                />
                {errors.date && (
                  <p className="text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="What was this expense for?"
                className="bg-secondary border-border focus:border-happy-green min-h-[100px]"
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Receipt URL */}
            <div className="space-y-2">
              <Label htmlFor="receipt" className="text-foreground">Receipt URL</Label>
              <Input
                id="receipt"
                {...register('receipt')}
                placeholder="https://example.com/receipt.jpg"
                className="bg-secondary border-border focus:border-happy-green"
              />
              <p className="text-sm text-muted-foreground">
                Optional: Add a URL to your receipt image
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                {isSubmitting ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
              </Button>
              <Link href="/expenses">
                <Button type="button" variant="outline" className="border-2 border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-background px-8 py-3 rounded-xl transition-all duration-300">
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