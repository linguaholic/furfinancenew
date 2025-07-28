'use client';

import { useFurFinanceStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Sparkles,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CategoriesPage() {
  const { categories, getCategoryExpenses, deleteCategory, getUserSelectedCategories } = useFurFinanceStore();
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  
  // Get only the categories that the user has selected
  const userCategories = getUserSelectedCategories();

  const handleDeleteCategory = async (categoryId: string) => {
    const categoryExpenses = getCategoryExpenses(categoryId);
    const category = categories.find(cat => cat.id === categoryId);
    
    if (categoryExpenses.length > 0) {
      alert(`Cannot delete "${category?.name}" because it has ${categoryExpenses.length} associated expenses. Please reassign or delete those expenses first.`);
      return;
    }

    if (confirm(`Are you sure you want to delete "${category?.name}"?`)) {
      setDeletingCategoryId(categoryId);
      try {
        deleteCategory(categoryId);
      } finally {
        setDeletingCategoryId(null);
      }
    }
  };

  const getCategoryIcon = (icon: string) => {
    // Map icon values to emojis
    const iconMap: Record<string, string> = {
      // Default categories
      'utensils': '🍽️',
      'heart-pulse': '💊',
      'scissors': '✂️',
      'gamepad-2': '🎮',
      'package': '📦',
      'graduation-cap': '🎓',
      'shield': '🛡️',
      'more-horizontal': '⋯',
      // New custom category icons
      'heart': '❤️',
      'star': '⭐',
      'gift': '🎁',
      'crown': '👑',
      'sparkles': '✨',
      'trophy': '🏆',
      'fire': '🔥',
      'diamond': '💎',
      'rainbow': '🌈',
      'rocket': '🚀',
      'magic-wand': '🪄',
      'camera': '📸',
      'music': '🎵',
      'book': '📚',
      'leaf': '🌿',
      'sun': '☀️',
      'moon': '🌙',
      'umbrella': '☔',
      'anchor': '⚓',
      'compass': '🧭',
      'target': '🎯',
      'lightning': '⚡',
      'shield-check': '🛡️',
    };
    return iconMap[icon] || '❤️';
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
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-2 sm:p-3 bg-gradient-primary rounded-xl">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Expense Categories</h1>
                <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">Manage your expense categories</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/categories/customize">
              <Button 
                size="sm"
                variant="outline"
                className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 text-xs sm:text-sm"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Customize</span>
                <span className="sm:hidden">Custom</span>
              </Button>
            </Link>
            <Link href="/categories/new">
              <Button 
                size="sm"
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-3 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Category</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {userCategories.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="text-center py-8 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-happy-orange/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-happy-orange" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">No categories yet</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-lg">
              Create your first expense category to start organizing your pet expenses
            </p>
            <Link href="/categories/new">
              <Button size="sm" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-4 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Your First Category</span>
                <span className="sm:hidden">Add First Category</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {userCategories.map((category) => {
            const categoryExpenses = getCategoryExpenses(category.id);
            const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const recentExpenses = categoryExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3);

            return (
              <Card key={category.id} className="bg-gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {getCategoryIcon(category.icon || 'more-horizontal')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl truncate">{category.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: `${category.color}20`, 
                              color: category.color,
                              borderColor: `${category.color}30`
                            }}
                          >
                            {categoryExpenses.length} expenses
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                      <Link href={`/categories/${category.id}/edit`}>
                        <Button size="sm" variant="outline" className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300 w-8 h-8 sm:w-auto sm:h-auto p-0 sm:px-3">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={deletingCategoryId === category.id}
                        className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all duration-300 w-8 h-8 sm:w-auto sm:h-auto p-0 sm:px-3"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Total Spent */}
                    <div className="flex items-center justify-between p-2 sm:p-3 bg-happy-green/10 rounded-xl border border-happy-green/20">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-happy-green/20 rounded">
                          <Sparkles className="h-3 w-3 text-happy-green" />
                        </div>
                        <span className="font-medium text-xs sm:text-sm">Total Spent</span>
                      </div>
                      <span className="font-bold text-base sm:text-lg text-happy-green">
                        ${totalSpent.toFixed(2)}
                      </span>
                    </div>

                    {/* Recent Expenses */}
                    <div>
                      <h4 className="font-medium text-xs sm:text-sm mb-2">Recent Expenses</h4>
                      {recentExpenses.length === 0 ? (
                        <div className="text-center py-2 sm:py-3">
                          <p className="text-xs sm:text-sm text-muted-foreground">No expenses yet</p>
                        </div>
                      ) : (
                        <div className="space-y-1 sm:space-y-2">
                          {recentExpenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border/30">
                              <span className="truncate text-xs sm:text-sm font-medium flex-1 mr-2">{expense.description}</span>
                              <span className="font-semibold text-happy-green text-xs sm:text-sm flex-shrink-0">${expense.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
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