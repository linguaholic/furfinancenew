'use client';

import { useEffect, useState } from 'react';
import { useFurFinanceStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { formatCurrency } from '@/lib/utils';
import { 
  PawPrint, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Target,
  Calendar,
  Users,
  Heart,
  Star,
  Download,
  Calculator
} from 'lucide-react';
import Link from 'next/link';
import ExportModal from '@/components/ExportModal';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const { 
    pets, 
    expenses, 
    categories, 
    settings,
    getTotalExpenses, 
    getMonthlyExpenses 
  } = useFurFinanceStore();

  useEffect(() => {
    setIsClient(true);
  }, []);


  const totalExpenses = isClient ? getTotalExpenses() : 0;
  const monthlyExpenses = isClient ? getMonthlyExpenses() : 0;
  const totalPets = isClient ? pets.length : 0;
  const totalCategories = isClient ? categories.length : 0;

  const recentExpenses = isClient 
    ? expenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-4">
          <div className="mb-1">
            <img 
              src="/images/Fur Finance Logo New.png" 
              alt="Fur Finance Logo" 
              className="h-30 w-30 sm:h-108 sm:w-108 object-contain mx-auto"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Track your pet expenses with love and care. Every penny spent on your furry friends, 
            beautifully organized and analyzed.
          </p>
        </div>

      {/* Quick Actions */}
      <div className="mb-12 flex justify-center gap-4 flex-wrap">
        <Link href="/pets/new">
          <Button size="lg" className="bg-gradient-to-r from-happy-green to-happy-purple hover:from-happy-green/90 hover:to-happy-purple/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            Add Pet
          </Button>
        </Link>
        <Link href="/expenses/new">
          <Button size="lg" className="bg-gradient-to-r from-happy-blue to-happy-green hover:from-happy-blue/90 hover:to-happy-green/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <DollarSign className="h-5 w-5 mr-2" />
            Add Expense
          </Button>
        </Link>
        <Link href="/budgets">
          <Button size="lg" className="bg-gradient-to-r from-happy-purple to-happy-orange hover:from-happy-purple/90 hover:to-happy-orange/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <TrendingUp className="h-5 w-5 mr-2" />
            Set Budget
          </Button>
        </Link>
        <ExportModal 
          pets={pets}
          categories={categories}
          expenses={expenses}
          trigger={
            <Button 
              size="lg" 
              disabled={!isClient || expenses.length === 0}
              className="bg-gradient-to-r from-happy-orange to-happy-pink hover:from-happy-orange/90 hover:to-happy-pink/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Expenses</CardTitle>
            <div className="p-2 bg-happy-green/20 rounded-lg group-hover:bg-happy-green/30 transition-colors">
              <DollarSign className="h-4 w-4 text-happy-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-happy-green">{formatCurrency(totalExpenses, settings.defaultCurrency)}</div>
            <p className="text-xs text-gray-400 mt-1">
              All time spending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">This Month</CardTitle>
            <div className="p-2 bg-happy-blue/20 rounded-lg group-hover:bg-happy-blue/30 transition-colors">
              <Calendar className="h-4 w-4 text-happy-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-happy-blue">{formatCurrency(monthlyExpenses, settings.defaultCurrency)}</div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Furry Friends</CardTitle>
            <div className="p-2 bg-happy-purple/20 rounded-lg group-hover:bg-happy-purple/30 transition-colors">
              <PawPrint className="h-4 w-4 text-happy-purple" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-happy-purple">{totalPets}</div>
            <p className="text-xs text-gray-400 mt-1">
              {totalPets === 1 ? 'Pet' : 'Pets'} in your family
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Categories</CardTitle>
            <div className="p-2 bg-happy-orange/20 rounded-lg group-hover:bg-happy-orange/30 transition-colors">
              <Users className="h-4 w-4 text-happy-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-happy-orange">{totalCategories}</div>
            <p className="text-xs text-gray-400 mt-1">
              Expense categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Expenses */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-happy-green/20 rounded-lg">
                <Heart className="h-5 w-5 text-happy-green" />
              </div>
              <div>
                <CardTitle className="text-white">Recent Expenses</CardTitle>
                <CardDescription className="text-gray-400">
                  Your latest pet expenses and updates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentExpenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-happy-green/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-happy-green" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">No expenses yet</h3>
                <p className="text-gray-400 mb-6">Start tracking your pet expenses to see them here</p>
                <Link href="/expenses/new">
                  <Button className="bg-gradient-to-r from-happy-green to-happy-purple hover:from-happy-green/90 hover:to-happy-purple/90 text-white border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Expense
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map((expense) => {
                  const pet = pets.find(p => p.id === expense.petId);
                  const category = categories.find(c => c.id === expense.categoryId);
                  
                  return (
                    <div key={expense.id} className="p-4 bg-gray-700/50 rounded-xl border border-gray-600/50 hover:border-gray-500 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category?.color }}
                          />
                          <div>
                            <p className="font-medium text-white">{expense.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <PawPrint className="h-3 w-3" />
                                {pet?.name}
                              </span>
                              <span>•</span>
                              <span>{category?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-happy-green">{formatCurrency(expense.amount, expense.currency)}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4">
                  <Link href="/expenses">
                    <Button size="sm" className="w-full bg-gradient-to-r from-happy-green to-happy-blue hover:from-happy-green/90 hover:to-happy-blue/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      View All Expenses
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-happy-blue/20 rounded-lg">
                <Star className="h-5 w-5 text-happy-blue" />
              </div>
              <div>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">
                  Everything you need to manage your pet finances
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/pets">
                <Button className="w-full justify-start h-12 bg-gradient-to-r from-happy-purple to-happy-pink hover:from-happy-purple/90 hover:to-happy-pink/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <PawPrint className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Pets</div>
                    <div className="text-xs opacity-75">View and edit your furry friends</div>
                  </div>
                </Button>
              </Link>
              <Link href="/expenses">
                <Button className="w-full justify-start h-12 bg-gradient-to-r from-happy-green to-happy-blue hover:from-happy-green/90 hover:to-happy-blue/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <DollarSign className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View All Expenses</div>
                    <div className="text-xs opacity-75">See your complete spending history</div>
                  </div>
                </Button>
              </Link>
              <Link href="/analytics">
                <Button className="w-full justify-start h-12 bg-gradient-to-r from-happy-blue to-happy-purple hover:from-happy-blue/90 hover:to-happy-purple/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Analytics & Reports</div>
                    <div className="text-xs opacity-75">Insights and spending patterns</div>
                  </div>
                </Button>
              </Link>
              <Link href="/categories">
                <Button className="w-full justify-start h-12 bg-gradient-to-r from-happy-orange to-happy-green hover:from-happy-orange/90 hover:to-happy-green/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Users className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Categories</div>
                    <div className="text-xs opacity-75">Customize expense categories</div>
                  </div>
                </Button>
              </Link>
              <Link href="/budgets">
                <Button className="w-full justify-start h-12 bg-gradient-to-r from-happy-yellow to-happy-orange hover:from-happy-yellow/90 hover:to-happy-orange/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Target className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Set Budgets</div>
                    <div className="text-xs opacity-75">Track spending limits</div>
                  </div>
                </Button>
              </Link>
              <Link href="/estimator">
                <Button className="w-full justify-start h-12 bg-gradient-to-r from-happy-pink to-happy-purple hover:from-happy-pink/90 hover:to-happy-purple/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Calculator className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Pet Cost Estimator</div>
                    <div className="text-xs opacity-75">Calculate pet ownership costs</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Section - Full Width */}
      <div className="w-full px-4 py-8">
          <Card className="bg-gray-800 border-gray-700 shadow-xl overflow-hidden rounded-xl">
            <div className="bg-gradient-to-r from-happy-green/10 to-happy-blue/10 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-happy-green to-happy-blue rounded-full mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-white">We&apos;d Love Your Feedback!</h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Help us make Fur Finance even better for pet parents like you. Share your thoughts, suggestions, or report any issues.
                </p>
              </div>
              
              <form 
                action="https://formspree.io/f/xjkowkyv" 
                method="POST"
                className="w-full space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-happy-green focus:outline-none transition-colors text-white placeholder-gray-400"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-happy-green focus:outline-none transition-colors text-white placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="feedback-type" className="block text-sm font-medium mb-2 text-white">
                    Feedback Type
                  </label>
                  <select
                    id="feedback-type"
                    name="feedbackType"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-happy-green focus:outline-none transition-colors text-white"
                    required
                  >
                    <option value="">Select feedback type</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="general-feedback">General Feedback</option>
                    <option value="praise">Praise</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-happy-green focus:outline-none transition-colors resize-none text-white placeholder-gray-400"
                    placeholder="Tell us what you think about Fur Finance, what features you&apos;d like to see, or any issues you&apos;ve encountered..."
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-happy-green to-happy-blue text-white font-semibold rounded-lg hover:from-happy-green/90 hover:to-happy-blue/90 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Heart className="h-5 w-5" />
                    Send Feedback
                  </button>
                </div>
                
                <p className="text-center text-sm text-gray-400">
                  Your feedback helps us improve Fur Finance for all pet parents. Thank you! 🐾
                </p>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
