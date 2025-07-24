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
  Repeat,
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
  const [monthlyChartType, setMonthlyChartType] = useState<'area' | 'bar'>('area');

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
  }, [budgets, categories, selectedPet, filteredExpenses]);

  // Get currency for display (use first expense currency or default to USD)
  const displayCurrency = filteredExpenses.length > 0 ? filteredExpenses[0].currency : 'USD';

  // Export analytics report function
  const exportAnalyticsReport = () => {
    if (filteredExpenses.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV content
    const headers = [
      'Date',
      'Description', 
      'Category',
      'Pet',
      'Amount',
      'Currency',
      'Recurring Type'
    ];

    const csvData = filteredExpenses.map(expense => {
      const pet = pets.find(p => p.id === expense.petId);
      const category = categories.find(c => c.id === expense.categoryId);
      
      return [
        new Date(expense.date).toLocaleDateString(),
        expense.description || 'No description',
        category?.name || 'Unknown',
        pet?.name || 'Unknown',
        expense.amount.toString(),
        expense.currency,
        expense.recurringType
      ];
    });

    // Add summary data
    const summaryData = [
      [],
      ['ANALYTICS SUMMARY'],
      ['Total Expenses', formatCurrency(totalExpenses, displayCurrency)],
      ['Average Expense', formatCurrency(averageExpense, displayCurrency)],
      ['Total Transactions', filteredExpenses.length.toString()],
      ['Categories Used', expensesByCategory.length.toString()],
      ['Period', selectedPeriod === 'month' ? 'This Month' : 'This Year'],
      ['Pet Filter', selectedPet === 'all' ? 'All Pets' : pets.find(p => p.id === selectedPet)?.name || 'Unknown'],
      [],
      ['CATEGORY BREAKDOWN'],
      ['Category', 'Amount', 'Percentage'],
      ...expensesByCategory.map(category => [
        category.name,
        formatCurrency(category.amount, displayCurrency),
        `${((category.amount / totalExpenses) * 100).toFixed(1)}%`
      ]),
      [],
      ['PET BREAKDOWN'],
      ['Pet', 'Amount', 'Percentage'],
      ...expensesByPet.map(pet => [
        pet.name,
        formatCurrency(pet.amount, displayCurrency),
        `${((pet.amount / totalExpenses) * 100).toFixed(1)}%`
      ]),
      [],
      ['DETAILED EXPENSES'],
      headers,
      ...csvData
    ];

    const csvContent = summaryData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `fur-finance-analytics-${selectedPeriod}-${selectedPet === 'all' ? 'all-pets' : pets.find(p => p.id === selectedPet)?.name || 'unknown'}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate spending insights
  const spendingInsights = useMemo(() => {
    if (filteredExpenses.length === 0) return null;

    const sortedExpenses = [...filteredExpenses].sort((a, b) => b.amount - a.amount);
    const highestExpense = sortedExpenses[0];
    const lowestExpense = sortedExpenses[sortedExpenses.length - 1];
    
    const recurringExpenses = filteredExpenses.filter(expense => expense.recurringType !== 'none');
    const oneTimeExpenses = filteredExpenses.filter(expense => expense.recurringType === 'none');
    
    const totalRecurring = recurringExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalOneTime = oneTimeExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      highestExpense,
      lowestExpense,
      recurringExpenses: recurringExpenses.length,
      oneTimeExpenses: oneTimeExpenses.length,
      totalRecurring,
      totalOneTime,
      recurringPercentage: totalExpenses > 0 ? (totalRecurring / totalExpenses) * 100 : 0
    };
  }, [filteredExpenses, totalExpenses]);

  // Calculate category breakdown for pie chart
  const categoryPieData = useMemo(() => {
    return expensesByCategory.map((category, index) => ({
      name: category.name,
      value: category.amount,
      color: COLORS[index % COLORS.length]
    }));
  }, [expensesByCategory]);

  // Calculate pet breakdown for pie chart
  const petPieData = useMemo(() => {
    return expensesByPet.map((pet, index) => ({
      name: pet.name,
      value: pet.amount,
      color: COLORS[index % COLORS.length]
    }));
  }, [expensesByPet]);

  // Calculate budget performance
  const budgetPerformance = useMemo(() => {
    if (selectedPet === 'all') return null;
    
    const petBudgets = budgets.filter(budget => budget.petId === selectedPet);
    const totalBudget = petBudgets.reduce((sum, budget) => {
      const budgetAmount = budget.period === 'monthly' ? budget.amount : budget.amount / 12;
      return sum + budgetAmount;
    }, 0);
    
    const totalActual = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
    
    return {
      totalBudget,
      totalActual,
      percentage,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  }, [budgets, selectedPet, filteredExpenses]);

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

          <Button 
            variant="outline" 
            size="sm" 
            className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white"
            onClick={exportAnalyticsReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

        {/* Budget Summary Card */}
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Status</p>
                {budgetPerformance ? (
                  <div>
                    <p className="text-2xl font-bold text-happy-orange">
                      {budgetPerformance.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {budgetPerformance.status === 'over' ? 'Over Budget' : 
                       budgetPerformance.status === 'warning' ? 'Near Limit' : 'Within Budget'}
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-muted-foreground">N/A</p>
                )}
              </div>
              <div className="p-3 bg-happy-orange/20 rounded-lg">
                <Target className="h-6 w-6 text-happy-orange" />
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
            {/* Chart Type Tabs */}
            <div className="flex space-x-1 mb-4 p-1 bg-secondary rounded-lg w-fit">
              <button
                onClick={() => setMonthlyChartType('area')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  monthlyChartType === 'area'
                    ? 'bg-happy-green text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Area Chart
              </button>
              <button
                onClick={() => setMonthlyChartType('bar')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  monthlyChartType === 'bar'
                    ? 'bg-happy-green text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Bar Chart
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              {monthlyChartType === 'area' ? (
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
              ) : (
                <BarChart data={monthlyTrends}>
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
                  <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '2px solid #10B981',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                      color: '#1F2937',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 16px'
                    }}
                    formatter={(value: number) => [formatCurrency(value, displayCurrency), 'Amount']}
                    labelStyle={{
                      color: '#1F2937',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Category Legend */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm mb-3">Category Breakdown</h4>
                {categoryPieData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(category.value, displayCurrency)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((category.value / totalExpenses) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={petPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {petPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '2px solid #10B981',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                      color: '#1F2937',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 16px'
                    }}
                    formatter={(value: number) => [formatCurrency(value, displayCurrency), 'Amount']}
                    labelStyle={{
                      color: '#1F2937',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Pet Legend */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm mb-3">Pet Breakdown</h4>
                {petPieData.map((pet, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pet.color }}
                      />
                      <span className="text-sm font-medium">{pet.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(pet.value, displayCurrency)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((pet.value / totalExpenses) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

      {/* Enhanced Analytics - Spending Insights */}
      {spendingInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Spending Insights */}
          <Card className="bg-gradient-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-happy-green" />
                Spending Insights
              </CardTitle>
              <CardDescription>Key insights about your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Highest Expense</span>
                  <span className="font-semibold text-red-500">
                    {formatCurrency(spendingInsights.highestExpense.amount, displayCurrency)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Lowest Expense</span>
                  <span className="font-semibold text-green-500">
                    {formatCurrency(spendingInsights.lowestExpense.amount, displayCurrency)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Recurring Expenses</span>
                  <span className="font-semibold text-blue-500">
                    {spendingInsights.recurringExpenses} ({spendingInsights.recurringPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">One-time Expenses</span>
                  <span className="font-semibold text-purple-500">
                    {spendingInsights.oneTimeExpenses}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Performance Dashboard */}
          <Card className="bg-gradient-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-happy-orange" />
                Budget Performance
              </CardTitle>
              <CardDescription>Overall budget tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {budgetPerformance ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                    <span className="font-semibold">{formatCurrency(budgetPerformance.totalBudget, displayCurrency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Actual Spending</span>
                    <span className="font-semibold">{formatCurrency(budgetPerformance.totalActual, displayCurrency)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        budgetPerformance.status === 'over' ? 'bg-red-500' : 
                        budgetPerformance.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budgetPerformance.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Budget Usage</span>
                    <span className={`font-semibold ${
                      budgetPerformance.status === 'over' ? 'text-red-500' : 
                      budgetPerformance.status === 'warning' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {budgetPerformance.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-secondary rounded-lg">
                    <div className="flex items-center gap-2">
                      {budgetPerformance.status === 'over' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : budgetPerformance.status === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm">
                        {budgetPerformance.status === 'over' ? 'Over budget' : 
                         budgetPerformance.status === 'warning' ? 'Approaching budget limit' : 
                         'Within budget'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a specific pet to view budget performance</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

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

      {/* Recent Expenses Table */}
      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-happy-green" />
            Recent Expenses
          </CardTitle>
          <CardDescription>Your most recent transactions with detailed breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Pet</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((expense) => {
                    const pet = pets.find(p => p.id === expense.petId);
                    const category = categories.find(c => c.id === expense.categoryId);
                    
                    return (
                      <tr key={expense.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-sm">
                            {expense.description || 'No description'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category?.color }}
                            />
                            <span className="text-sm">{category?.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {pet?.name}
                        </td>
                        <td className="py-3 px-4">
                          {expense.recurringType !== 'none' ? (
                            <Badge variant="secondary" className="text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              {expense.recurringType}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">One-time</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-bold text-happy-green">
                            {formatCurrency(expense.amount, expense.currency)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {filteredExpenses.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No expenses found for the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 