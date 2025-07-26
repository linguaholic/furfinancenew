'use client';

import { useState, useEffect } from 'react';
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
import { expenseCreationLimiter, generateRateLimitKey } from '@/lib/rate-limiter';

const expenseSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0').max(999999.99, 'Amount is too high'),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'] as const),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s\-.,!?()]+$/, 'Description contains invalid characters')
    .optional(),
  date: z.string().min(1, 'Date is required'),
  receipt: z.string().optional(),
  recurringType: z.enum(['none', 'monthly', 'quarterly', 'yearly']),
  nextDueDate: z.string().optional(),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense ? {
      petId: expense.petId,
      categoryId: expense.categoryId,
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description || '',
      date: expense.date.split('T')[0],
      receipt: expense.receipt || '',
      recurringType: expense.recurringType || 'none',
      nextDueDate: expense.nextDueDate || '',
    } : {
      petId: defaultPetId,
      categoryId: '',
      amount: 0,
      currency: settings?.defaultCurrency || 'USD',
      description: '',
      date: new Date().toISOString().split('T')[0],
      receipt: '',
      recurringType: 'none',
      nextDueDate: '',
    },
  });

  // Watch for changes in date and recurring type to calculate next due date
  const watchedDate = watch('date');
  const watchedRecurringType = watch('recurringType');

  // Calculate next due date when date or recurring type changes
  const calculateNextDueDate = (date: string, recurringType: string) => {
    if (recurringType === 'none' || !date) return '';
    
    const currentDate = new Date(date);
    const nextDate = new Date(currentDate);
    
    switch (recurringType) {
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        return '';
    }
    
    return nextDate.toISOString().split('T')[0];
  };

  // Update next due date when date or recurring type changes
  useEffect(() => {
    if (watchedDate && watchedRecurringType !== 'none') {
      const nextDueDate = calculateNextDueDate(watchedDate, watchedRecurringType);
      setValue('nextDueDate', nextDueDate);
    } else {
      setValue('nextDueDate', '');
    }
  }, [watchedDate, watchedRecurringType, setValue]);

  // Update form when settings are loaded
  useEffect(() => {
    if (settings && !expense) {
      setValue('currency', settings.defaultCurrency);
    }
  }, [settings, setValue, expense]);

  const onSubmit = async (data: ExpenseFormData) => {
    // Validate that required data is loaded
    if (!settings || pets.length === 0 || categories.length === 0) {
      toast.error('Please wait for data to load before submitting');
      return;
    }

    // Rate limiting check for new expense creation
    if (!expense) {
      const rateLimitKey = generateRateLimitKey();
      if (!expenseCreationLimiter.isAllowed(rateLimitKey)) {
        const remainingTime = expenseCreationLimiter.getResetTime(rateLimitKey);
        const secondsLeft = remainingTime ? Math.ceil((remainingTime - Date.now()) / 1000) : 0;
        toast.error(`Too many expense creations. Please wait ${secondsLeft} seconds before trying again.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // Clean up the data - convert empty strings to undefined for optional fields
      const cleanedData = {
        ...data,
        description: data.description?.trim() || undefined,
        receipt: data.receipt?.trim() || undefined,
        nextDueDate: data.nextDueDate || undefined,
      };
      
      if (expense) {
        updateExpense(expense.id, cleanedData);
        toast.success('Expense updated successfully! 🎉');
      } else {
        addExpense(cleanedData);
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pet Selection */}
              <div className="space-y-2">
                <Label htmlFor="petId" className="text-foreground">Pet *</Label>
                {pets.length === 0 ? (
                  <div className="p-3 bg-secondary border border-border rounded-lg text-center text-muted-foreground">
                    Loading pets...
                  </div>
                ) : (
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
                )}
                {errors.petId && (
                  <p className="text-sm text-destructive mt-1">{errors.petId.message}</p>
                )}
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-foreground">Category *</Label>
                {categories.length === 0 ? (
                  <div className="p-3 bg-secondary border border-border rounded-lg text-center text-muted-foreground">
                    Loading categories...
                  </div>
                ) : (
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
                )}
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
                {!settings ? (
                  <div className="p-3 bg-secondary border border-border rounded-lg text-center text-muted-foreground">
                    Loading settings...
                  </div>
                ) : (
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
                )}
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

              {/* Recurring Type */}
              <div className="space-y-2">
                <Label htmlFor="recurringType" className="text-foreground">Recurring</Label>
                <Controller
                  name="recurringType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-secondary border-border focus:border-happy-green">
                        <SelectValue placeholder="Select recurring type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border border-gray-700 z-50">
                        <SelectItem value="none" className="bg-black text-white hover:bg-gray-800 focus:bg-gray-800">
                          One-time expense
                        </SelectItem>
                        <SelectItem value="monthly" className="bg-black text-white hover:bg-gray-800 focus:bg-gray-800">
                          Monthly
                        </SelectItem>
                        <SelectItem value="quarterly" className="bg-black text-white hover:bg-gray-800 focus:bg-gray-800">
                          Quarterly
                        </SelectItem>
                        <SelectItem value="yearly" className="bg-black text-white hover:bg-gray-800 focus:bg-gray-800">
                          Yearly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.recurringType && (
                  <p className="text-sm text-destructive mt-1">{errors.recurringType.message}</p>
                )}
              </div>

              {/* Next Due Date (only show if recurring) */}
              {watchedRecurringType !== 'none' && (
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="nextDueDate" className="text-foreground">Next Due Date</Label>
                  <Input
                    id="nextDueDate"
                    type="date"
                    {...register('nextDueDate')}
                    className="bg-secondary border-border focus:border-happy-green"
                    readOnly
                  />
                  <p className="text-sm text-muted-foreground">
                    Automatically calculated based on your selection
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="What was this expense for? (optional)"
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
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || !settings || pets.length === 0 || categories.length === 0} 
                className="w-full sm:w-auto bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (expense ? 'Update Expense' : 'Add Expense')}
              </Button>
              <Link href="/expenses" className="w-full sm:w-auto">
                <Button type="button" variant="outline" className="w-full sm:w-auto border-2 border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-background px-6 sm:px-8 py-3 rounded-xl transition-all duration-300">
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