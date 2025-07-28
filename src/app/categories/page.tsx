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
import CategoryCustomizationModal from '@/components/CategoryCustomizationModal';

export default function CategoriesPage() {
  const { categories, getCategoryExpenses, deleteCategory } = useFurFinanceStore();
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);

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

  const handleCustomizeCategories = () => {
    setIsCustomizationModalOpen(true);
  };

  const handleSaveCategoryCustomization = (selectedCategories: string[]) => {
    // TODO: Implement saving user category preferences
    console.log('Selected categories:', selectedCategories);
    // For now, just close the modal
    setIsCustomizationModalOpen(false);
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
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Expense Categories</h1>
                <p className="text-xl text-muted-foreground">Manage your expense categories</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleCustomizeCategories}
              className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
              <Settings className="h-5 w-5 mr-2" />
              Customize
            </Button>
            <Link href="/categories/new">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Category
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-happy-orange/10 rounded-full flex items-center justify-center">
              <Users className="h-10 w-10 text-happy-orange" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No categories yet</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Create your first expense category to start organizing your pet expenses
            </p>
            <Link href="/categories/new">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Category
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const categoryExpenses = getCategoryExpenses(category.id);
            const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const recentExpenses = categoryExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3);

            return (
              <Card key={category.id} className="bg-gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        {getCategoryIcon(category.icon || 'more-horizontal')}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="secondary" 
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
                    <div className="flex gap-2">
                      <Link href={`/categories/${category.id}/edit`}>
                        <Button size="sm" variant="outline" className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={deletingCategoryId === category.id}
                        className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all duration-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Total Spent */}
                    <div className="flex items-center justify-between p-3 bg-happy-green/10 rounded-xl border border-happy-green/20">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-happy-green/20 rounded">
                          <Sparkles className="h-3 w-3 text-happy-green" />
                        </div>
                        <span className="font-medium text-sm">Total Spent</span>
                      </div>
                      <span className="font-bold text-lg text-happy-green">
                        ${totalSpent.toFixed(2)}
                      </span>
                    </div>

                    {/* Recent Expenses */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Recent Expenses</h4>
                      {recentExpenses.length === 0 ? (
                        <div className="text-center py-3">
                          <p className="text-sm text-muted-foreground">No expenses yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {recentExpenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border/30">
                              <span className="truncate text-sm font-medium">{expense.description}</span>
                              <span className="font-semibold text-happy-green text-sm">${expense.amount.toFixed(2)}</span>
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

      {/* Category Customization Modal */}
      <CategoryCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        onSave={handleSaveCategoryCustomization}
        currentCategories={categories.map(cat => cat.name)}
      />
    </div>
  );
} 