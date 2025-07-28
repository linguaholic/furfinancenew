'use client';

import { useState } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useFurFinanceStore } from '@/store';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().min(1, 'Color is required'),
  icon: z.string().min(1, 'Icon is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormInlineProps {
  onSuccess: (categoryName: string) => void;
  onCancel: () => void;
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

export function CategoryFormInline({ onSuccess, onCancel }: CategoryFormInlineProps) {
  const { addCategory } = useFurFinanceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#10b981');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: '#10b981',
      icon: 'heart',
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const newCategory = await addCategory(data);
      toast.success('Custom category created successfully! 🎨');
      onSuccess(newCategory.name);
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category. Please try again.');
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
    <Card className="bg-gradient-card border-0 shadow-xl mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create Custom Category</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Category Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Pet Photography"
                className="bg-secondary border-border focus:border-happy-green"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category Color *</Label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                      selectedColor === color 
                        ? 'border-white shadow-lg scale-110' 
                        : 'border-border hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category Icon *</Label>
            <div className="grid grid-cols-8 gap-2 p-3 bg-secondary rounded-lg border border-border">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setValue('icon', icon.value)}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all duration-200
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
            <Label className="text-sm font-medium">Preview</Label>
            <div className="p-3 bg-secondary rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: `${selectedColor}20` }}
                >
                  {AVAILABLE_ICONS.find(icon => icon.value === watch('icon'))?.emoji || '❤️'}
                </div>
                <span className="font-medium">
                  {watch('name') || 'Category Name'}
                </span>
                <Badge variant="secondary" className="text-xs">Custom</Badge>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-2 border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-background px-6 py-2 rounded-lg transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 