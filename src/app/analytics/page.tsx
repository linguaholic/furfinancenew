'use client';

import { useFurFinanceStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,

  Area,
  AreaChart,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
 
  DollarSign, 
  Calendar,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  PawPrint,
  Download,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

export default function AnalyticsPage() {
  const { expenses, pets, categories, budgets } = useFurFinanceStore();
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');

  // Filter expenses based on selected pet and period
  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    if (selectedPet !== 'all') {
      filtered = filtered.filter(expense => expense.petId === selectedPet);
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (selectedPeriod === 'month') {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      });
    } else {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === currentYear;
      });
    }

    return filtered;
  }, [expenses, selectedPet, selectedPeriod]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  // Calculate average expense
  const averageExpense = useMemo(() => {
    return filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;
  }, [filteredExpenses, totalExpenses]);

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map();
    
    filteredExpenses.forEach(expense => {
      const category = categories.find(c => c.id === expense.categoryId);
      if (category) {
        const current = categoryMap.get(category.id) || { name: category.name, amount: 0, color: category.color };
        current.amount += expense.amount;
        categoryMap.set(category.id, current);
      }
    });

    return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, categories]);

  // Calculate expenses by pet
  const expensesByPet = useMemo(() => {
    const petMap = new Map();
    
    filteredExpenses.forEach(expense => {
      const pet = pets.find(p => p.id === expense.petId);
      if (pet) {
        const current = petMap.get(pet.id) || { name: pet.name, amount: 0 };
        current.amount += expense.amount;
        petMap.set(pet.id, current);
      }
    });

    return Array.from(petMap.values()).sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, pets]);

  // Calculate monthly trends (last 6 months)
  const monthlyTrends = useMemo(() => {
    const trends = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === date.getMonth() && 
               expenseDate.getFullYear() === date.getFullYear() &&
               (selectedPet === 'all' || expense.petId === selectedPet);
      });
      
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      trends.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: total,
        count: monthExpenses.length
      });
    }
    
    return trends;
  }, [expenses, selectedPet]);

  // Calculate budget vs actual
  const budgetComparison = useMemo(() => {
    if (selectedPet === 'all') return [];
    
    const petBudgets = budgets.filter(budget => budget.petId === selectedPet);
    const monthlyExpenses = getMonthlyExpenses(selectedPet);
    
    return petBudgets.map(budget => {
      const category = categories.find(c => c.id === budget.categoryId);
      const budgetAmount = budget.period === 'monthly' ? budget.amount : budget.amount / 12;
      const actualAmount = filteredExpenses
        .filter(expense => expense.categoryId === budget.categoryId)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        category: category?.name || 'Unknown',
        budget: budgetAmount,
        actual: actualAmount,
        difference: actualAmount - budgetAmount,
        percentage: budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0
      };
    });
  }, [budgets, categories, selectedPet, filteredExpenses, getMonthlyExpenses]);

  // Get currency for display (use first expense currency or default to USD)
  const displayCurrency = filteredExpenses.length > 0 ? filteredExpenses[0].currency : 'USD';

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Analytics & Reports</h1>
            <p className="text-xl text-muted-foreground">Insights into your pet spending patterns</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-happy-green focus:outline-none"
          >
            <option value="all">All Pets</option>
            {pets.map(pet => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'year')}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:border-happy-green focus:outline-none"
          >
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <Button variant="outline" size="sm" className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-happy-green">
                  {formatCurrency(totalExpenses, displayCurrency)}
                </p>
              </div>
              <div className="p-3 bg-happy-green/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-happy-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Expense</p>
                <p className="text-2xl font-bold text-happy-blue">
                  {formatCurrency(averageExpense, displayCurrency)}
                </p>
              </div>
              <div className="p-3 bg-happy-blue/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-happy-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-happy-yellow">
                  {filteredExpenses.length}
                </p>
              </div>
              <div className="p-3 bg-happy-yellow/20 rounded-lg">
                <Calendar className="h-6 w-6 text-happy-yellow" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories Used</p>
                <p className="text-2xl font-bold text-purple-500">
                  {expensesByCategory.length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <PieChartIcon className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-happy-green" />
              Monthly Spending Trends
            </CardTitle>
            <CardDescription>Your spending pattern over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value, displayCurrency), 'Amount']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-purple-500" />
              Expenses by Category
            </CardTitle>
            <CardDescription>Breakdown of spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value, displayCurrency), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expenses by Pet */}
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-happy-blue" />
              Expenses by Pet
            </CardTitle>
            <CardDescription>Spending breakdown by pet</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesByPet}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [formatCurrency(value, displayCurrency), 'Amount']}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget vs Actual (only show if pet is selected) */}
        {selectedPet !== 'all' && budgetComparison.length > 0 && (
          <Card className="bg-gradient-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-happy-yellow" />
                Budget vs Actual
              </CardTitle>
              <CardDescription>How you&apos;re tracking against your budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="category" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value, displayCurrency), 'Amount']}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* If no budget comparison, show top expenses */}
        {selectedPet === 'all' && (
          <Card className="bg-gradient-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-happy-green" />
                Top Expenses
              </CardTitle>
              <CardDescription>Your highest spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expensesByCategory.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="font-bold text-happy-green">
                      {formatCurrency(category.amount, displayCurrency)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Budget Status (if pet is selected) */}
      {selectedPet !== 'all' && budgetComparison.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-happy-yellow" />
              Budget Status
            </CardTitle>
            <CardDescription>Detailed budget tracking for {pets.find(p => p.id === selectedPet)?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetComparison.map((item, index) => (
                <div key={index} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{item.category}</h4>
                    <Badge 
                      variant={item.percentage > 100 ? 'destructive' : item.percentage > 80 ? 'secondary' : 'default'}
                      className={
                        item.percentage > 100 ? 'bg-red-500' : 
                        item.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }
                    >
                      {item.percentage > 100 ? (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      ) : item.percentage > 80 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {item.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="ml-2 font-medium">{formatCurrency(item.budget, displayCurrency)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Actual:</span>
                      <span className="ml-2 font-medium">{formatCurrency(item.actual, displayCurrency)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-muted-foreground">Difference:</span>
                    <span className={`ml-2 font-medium ${item.difference > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {item.difference > 0 ? '+' : ''}{formatCurrency(item.difference, displayCurrency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent High-Value Expenses */}
      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-happy-green" />
            Recent High-Value Expenses
          </CardTitle>
          <CardDescription>Your most expensive recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 10)
              .map((expense) => {
                const pet = pets.find(p => p.id === expense.petId);
                const category = categories.find(c => c.id === expense.categoryId);
                
                return (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {pet?.name} • {category?.name} • {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-happy-green">
                        {formatCurrency(expense.amount, expense.currency)}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 