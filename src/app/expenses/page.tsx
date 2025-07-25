'use client';

import { useFurFinanceStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Filter,
  Calendar,
  PawPrint,
  ArrowLeft,
  Repeat,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ExpensesPage() {
  const { expenses, pets, categories, deleteExpense } = useFurFinanceStore();
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleDeleteExpense = async (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setDeletingExpenseId(expenseId);
      try {
        deleteExpense(expenseId);
      } finally {
        setDeletingExpenseId(null);
      }
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    if (selectedPet !== 'all' && expense.petId !== selectedPet) return false;
    if (selectedCategory !== 'all' && expense.categoryId !== selectedCategory) return false;
    return true;
  });

  const totalFilteredAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const exportToCSV = (specificPetId?: string) => {
    let expensesToExport = filteredExpenses;
    let fileName = 'pet-expenses';
    
    if (specificPetId && specificPetId !== 'all') {
      expensesToExport = expenses.filter(expense => expense.petId === specificPetId);
      const pet = pets.find(p => p.id === specificPetId);
      fileName = `${pet?.name?.toLowerCase().replace(/\s+/g, '-')}-expenses`;
    }
    
    if (expensesToExport.length === 0) {
      alert('No expenses to export!');
      return;
    }

    // Create CSV headers
    const headers = [
      'Date',
      'Pet',
      'Category', 
      'Amount',
      'Currency',
      'Description',
      'Recurring Type',
      'Next Due Date'
    ];

    // Create CSV rows
    const rows = expensesToExport.map(expense => {
      const pet = pets.find(p => p.id === expense.petId);
      const category = categories.find(c => c.id === expense.categoryId);
      
      return [
        formatDate(expense.date),
        pet?.name || 'Unknown Pet',
        category?.name || 'Unknown Category',
        expense.amount.toFixed(2),
        expense.currency,
        expense.description || '',
        expense.recurringType === 'none' ? 'One-time' : expense.recurringType.charAt(0).toUpperCase() + expense.recurringType.slice(1),
        expense.nextDueDate ? formatDate(expense.nextDueDate) : ''
      ];
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">Expenses</h1>
                <p className="text-lg lg:text-xl text-muted-foreground">Track all your pet expenses</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => exportToCSV()}
                disabled={filteredExpenses.length === 0}
                className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300 px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {selectedPet === 'all' && selectedCategory === 'all' ? 'Export All' : 'Export Filtered'}
              </Button>
              {pets.length > 1 && (
                <select 
                  onChange={(e) => e.target.value && exportToCSV(e.target.value)}
                  className="h-10 px-4 sm:px-6 bg-secondary border-2 border-happy-green text-happy-green rounded-xl focus:border-happy-green focus:outline-none cursor-pointer transition-all duration-300 hover:bg-happy-green hover:text-white text-sm font-medium leading-none"
                  defaultValue=""
                >
                  <option value="" disabled>Export Pet...</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      Export {pet.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <Link href="/expenses/new" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Add Expense
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0 shadow-xl mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-happy-blue" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Pet</label>
              <select 
                value={selectedPet} 
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full p-2 bg-secondary border border-border rounded-lg focus:border-happy-green focus:outline-none"
              >
                <option value="all">All Pets</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-secondary border border-border rounded-lg focus:border-happy-green focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <div className="w-full p-3 bg-happy-green/10 rounded-lg border border-happy-green/20">
                <span className="text-sm text-muted-foreground">Total:</span>
                <div className="text-lg sm:text-xl font-bold text-happy-green">{formatCurrency(totalFilteredAmount)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-happy-green/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-10 w-10 text-happy-green" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No expenses found</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              {expenses.length === 0 
                ? "Start tracking your pet expenses to see them here"
                : "Try adjusting your filters to see more results"
              }
            </p>
            {expenses.length === 0 && (
              <Link href="/expenses/new">
                <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Expense
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredExpenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => {
              const pet = pets.find(p => p.id === expense.petId);
              const category = categories.find(c => c.id === expense.categoryId);
              
              return (
                <Card key={expense.id} className="bg-gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                          style={{ backgroundColor: category?.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold break-words">
                            {expense.description || `${category?.name} Expense`}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <PawPrint className="h-3 w-3" />
                              {pet?.name}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>{category?.name}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(expense.date)}
                            </span>
                            {expense.recurringType !== 'none' && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1 text-happy-blue">
                                  <Repeat className="h-3 w-3" />
                                  {expense.recurringType.charAt(0).toUpperCase() + expense.recurringType.slice(1)}
                                </span>
                              </>
                            )}
                          </div>
                          {expense.recurringType !== 'none' && expense.nextDueDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Next due: {formatDate(expense.nextDueDate)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-right">
                          <div className="text-lg sm:text-xl font-bold text-happy-green">{formatCurrency(expense.amount, expense.currency)}</div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/expenses/${expense.id}/edit`}>
                            <Button size="sm" variant="outline" className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteExpense(expense.id)}
                            disabled={deletingExpenseId === expense.id}
                            className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all duration-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
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