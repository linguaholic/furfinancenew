'use client';

import { useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFurFinanceStore } from '@/store';
import { ExpenseCategory } from '@/types';
import { ArrowLeft, Users, Palette } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().min(1, 'Icon is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: ExpenseCategory;
  onSuccess?: () => void;
}

const AVAILABLE_ICONS = [
  { value: 'heart', emoji: '❤️' },
  { value: 'star', emoji: '⭐' },
  { value: 'gift', emoji: '🎁' },
  { value: 'crown', emoji: '👑' },
  { value: 'sparkles', emoji: '✨' },
  { value: 'trophy', emoji: '🏆' },
  { value: 'fire', emoji: '🔥' },
  { value: 'diamond', emoji: '💎' },
  { value: 'rainbow', emoji: '🌈' },
  { value: 'rocket', emoji: '🚀' },
  { value: 'magic-wand', emoji: '🪄' },
  { value: 'camera', emoji: '📸' },
  { value: 'music', emoji: '🎵' },
  { value: 'book', emoji: '📚' },
  { value: 'leaf', emoji: '🌿' },
  { value: 'sun', emoji: '☀️' },
  { value: 'moon', emoji: '🌙' },
  { value: 'umbrella', emoji: '☔' },
  { value: 'anchor', emoji: '⚓' },
  { value: 'compass', emoji: '🧭' },
  { value: 'target', emoji: '🎯' },
  { value: 'lightning', emoji: '⚡' },
  { value: 'shield-check', emoji: '🛡️' },
  { value: 'more-horizontal', emoji: '⋯' },
];

const PRESET_COLORS = [
  '#10b981', // Green
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f97316', // Orange
  '#6b7280', // Gray
  '#14b8a6', // Teal
  '#a855f7', // Violet
];

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { addCategory, updateCategory } = useFurFinanceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(category?.color || '#10b981');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      name: category.name,
      color: category.color,
      icon: category.icon || 'heart',
    } : {
      name: '',
      color: '#10b981',
      icon: 'heart',
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (category) {
        updateCategory(category.id, data);
        toast.success('Category updated successfully! 🎨');
        onSuccess?.();
        router.push('/categories');
      } else {
        const newCategory = addCategory(data);
        toast.success('Category added successfully! 🎨');
        
        // Check if user came from expense form
        const cameFromExpenseForm = sessionStorage.getItem('expenseFormData');
        if (cameFromExpenseForm) {
          // Store the new category ID to auto-select it when returning to expense form
          sessionStorage.setItem('newCategoryId', newCategory.id);
          router.push('/expenses/new');
        } else {
          onSuccess?.();
          router.push('/categories');
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<CategoryFormData>) => {
    const errorMessages = Object.values(errors).map((error) => error?.message || 'Invalid field').filter(Boolean);
    toast.error(`Please fill in all required fields: ${errorMessages.join(', ')}`);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setValue('color', color);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Link>
      </div>

      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{category ? 'Edit Category' : 'Add New Category'}</CardTitle>
              <CardDescription>
                {category ? 'Update your expense category' : 'Create a new category to organize your pet expenses'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Category Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Food & Treats, Veterinary Care"
                className="bg-secondary border-border focus:border-happy-green"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">Category Color *</Label>
              <div className="grid grid-cols-6 gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                      selectedColor === color 
                        ? 'border-white shadow-lg scale-110' 
                        : 'border-border hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Choose a color to represent this category
              </p>
            </div>


            {/* Icon Selection */}
            <div className="space-y-3">
              <Label className="text-foreground">Category Icon *</Label>
              <div className="grid grid-cols-8 gap-3 p-4 bg-secondary rounded-lg border border-border">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setValue('icon', icon.value)}
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all duration-200
                      ${watch('icon') === icon.value 
                        ? 'border-2 border-white shadow-lg scale-110' 
                        : 'bg-background hover:bg-muted hover:scale-105'
                      }
                    `}
                  >
                    {icon.emoji}
                  </button>
                ))}
              </div>
              {errors.icon && (
                <p className="text-sm text-destructive">{errors.icon.message}</p>
              )}
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-foreground">Preview</Label>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    {AVAILABLE_ICONS.find(icon => icon.value === watch('icon'))?.emoji || '❤️'}
                  </div>
                  <span className="font-medium">
                    {watch('name') || 'Category Name'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                {isSubmitting ? 'Saving...' : (category ? 'Update Category' : 'Add Category')}
              </Button>
              <Link href="/categories">
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