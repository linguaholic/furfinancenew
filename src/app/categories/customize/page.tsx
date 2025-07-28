'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Check, 
  Sparkles,
  Blocks,
  ArrowLeft,
  Save
} from 'lucide-react';
import { CATEGORY_BUILDING_BLOCKS } from '@/types';
import { useFurFinanceStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CategoryCustomizationPage() {
  const { getUserSelectedCategories, updateUserCategoryPreferences } = useFurFinanceStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'default' | 'custom'>('all');
  const [isSaving, setIsSaving] = useState(false);

  // Get current user categories
  const userCategories = getUserSelectedCategories();

  useEffect(() => {
    console.log('User categories:', userCategories);
    let categoryNames: string[];
    
    if (userCategories.length > 0) {
      // Use user's selected categories
      categoryNames = userCategories.map(cat => cat.name);
    } else {
      // Fallback to default categories if no user preferences exist
      categoryNames = CATEGORY_BUILDING_BLOCKS
        .filter(block => block.isDefault)
        .map(block => block.name);
    }
    
    console.log('Setting selected blocks to:', categoryNames);
    setSelectedBlocks(categoryNames);
  }, [userCategories]);

  // Debug: Log current state
  useEffect(() => {
    console.log('Current selectedBlocks:', selectedBlocks);
  }, [selectedBlocks]);

  const getCategoryIcon = (icon: string) => {
    const iconMap: Record<string, string> = {
      'utensils': '🍽️',
      'heart-pulse': '💊',
      'scissors': '✂️',
      'gamepad-2': '🎮',
      'package': '📦',
      'graduation-cap': '🎓',
      'shield': '🛡️',
      'more-horizontal': '⋯',
      'home': '🏠',
      'tooth': '🦷',
      'alert-triangle': '⚠️',
      'pill': '💊',
      'building': '🏢',
      'car': '🚗',
      'file-text': '📄',
      'brain': '🧠',
      'leaf': '🌿',
      'heart': '❤️',
      'trophy': '🏆',
      'camera': '📸',
      'shirt': '👕',
      'smartphone': '📱',
      'flower': '🌸',
    };
    return iconMap[icon] || '❤️';
  };

  const filteredBlocks = CATEGORY_BUILDING_BLOCKS.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'default') return matchesSearch && block.isDefault;
    if (activeTab === 'custom') return matchesSearch && !block.isDefault;
    return matchesSearch;
  });

  const handleToggleBlock = (blockId: string) => {
    console.log('Toggling block:', blockId);
    console.log('Current selectedBlocks:', selectedBlocks);
    setSelectedBlocks(prev => {
      const newSelection = prev.includes(blockId) 
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId];
      console.log('New selection:', newSelection);
      return newSelection;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserCategoryPreferences(selectedBlocks);
      router.push('/categories');
    } catch (error) {
      console.error('Failed to save category preferences:', error);
      alert('Failed to save category preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    const defaultBlocks = CATEGORY_BUILDING_BLOCKS
      .filter(block => block.isDefault)
      .map(block => block.name);
    setSelectedBlocks(defaultBlocks);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Blocks className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Customize Your Categories</h1>
                  <p className="text-muted-foreground">Choose which categories you want to use for tracking your pet expenses</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleResetToDefault}
                size="sm"
              >
                Reset to Default
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                All Categories
              </Button>
              <Button
                variant={activeTab === 'default' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('default')}
              >
                Default
              </Button>
              <Button
                variant={activeTab === 'custom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('custom')}
              >
                Additional
              </Button>
            </div>
          </div>

          {/* Selected Categories Summary */}
          <div className="bg-happy-green/10 border border-happy-green/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-happy-green" />
              <span className="font-medium">Selected Categories ({selectedBlocks.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedBlocks.length === 0 ? (
                <span className="text-muted-foreground text-sm">No categories selected</span>
              ) : (
                selectedBlocks.map(blockName => {
                  const block = CATEGORY_BUILDING_BLOCKS.find(b => b.name === blockName);
                  if (!block) return null;
                  
                  return (
                    <Badge
                      key={blockName}
                      variant="secondary"
                      style={{
                        backgroundColor: `${block.color}20`,
                        color: block.color,
                        borderColor: `${block.color}30`
                      }}
                    >
                      {getCategoryIcon(block.icon)} {block.name}
                    </Badge>
                  );
                })
              )}
            </div>
          </div>

          {/* Building Blocks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBlocks.map((block) => {
              const isSelected = selectedBlocks.includes(block.name);
              
              return (
                <div
                  key={block.name}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'border-happy-blue bg-happy-blue/5'
                      : 'border-border hover:border-happy-blue/50'
                  }`}
                  onClick={() => {
                    console.log('Card clicked for:', block.name);
                    handleToggleBlock(block.name);
                  }}
                >
                  {/* Selection Indicator */}
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected
                      ? 'bg-happy-blue text-white'
                      : 'bg-secondary border border-border'
                  }`}>
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>

                  {/* Category Content */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${block.color}20` }}
                    >
                      {getCategoryIcon(block.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">
                        {block.name}
                      </h3>
                      {block.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {block.description}
                        </p>
                      )}
                      {block.isDefault && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No categories found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 