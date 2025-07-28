'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Check, 
  Sparkles,
  Blocks
} from 'lucide-react';
import { CATEGORY_BUILDING_BLOCKS } from '@/types';

interface CategoryCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedBlocks: string[]) => void;
  currentCategories: string[];
}

export default function CategoryCustomizationModal({
  isOpen,
  onClose,
  onSave,
  currentCategories
}: CategoryCustomizationModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(currentCategories);
  const [activeTab, setActiveTab] = useState<'all' | 'default' | 'custom'>('all');

  useEffect(() => {
    setSelectedBlocks(currentCategories);
  }, [currentCategories]);

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
    setSelectedBlocks(prev => 
      prev.includes(blockId) 
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  };

  const handleSave = () => {
    onSave(selectedBlocks);
    onClose();
  };

  const handleResetToDefault = () => {
    const defaultBlocks = CATEGORY_BUILDING_BLOCKS
      .filter(block => block.isDefault)
      .map(block => block.name);
    setSelectedBlocks(defaultBlocks);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-0 flex flex-col">
        <DialogHeader className="p-4 md:p-6 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Blocks className="h-5 w-5 md:h-6 md:w-6 text-happy-blue" />
            Customize Your Categories
          </DialogTitle>
          <p className="text-muted-foreground text-sm md:text-base">
            Choose which categories you want to use for tracking your pet expenses
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
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
                className="flex-1 md:flex-none"
              >
                All
              </Button>
              <Button
                variant={activeTab === 'default' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('default')}
                className="flex-1 md:flex-none"
              >
                Default
              </Button>
              <Button
                variant={activeTab === 'custom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('custom')}
                className="flex-1 md:flex-none"
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
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {filteredBlocks.map((block) => {
              const isSelected = selectedBlocks.includes(block.name);
              
              return (
                <div
                  key={block.name}
                  className={`relative p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? 'border-happy-blue bg-happy-blue/5'
                      : 'border-border hover:border-happy-blue/50'
                  }`}
                  onClick={() => handleToggleBlock(block.name)}
                >
                  {/* Selection Indicator */}
                  <div className={`absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                    isSelected
                      ? 'bg-happy-blue text-white'
                      : 'bg-secondary border border-border'
                  }`}>
                    {isSelected ? (
                      <Check className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>

                  {/* Category Content */}
                  <div className="flex items-start gap-2 md:gap-3">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${block.color}20` }}
                    >
                      {getCategoryIcon(block.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs md:text-sm mb-1 truncate">
                        {block.name}
                      </h3>
                      {block.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                          {block.description}
                        </p>
                      )}
                      {block.isDefault && (
                        <Badge variant="outline" className="mt-1 md:mt-2 text-xs">
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">No categories found matching your search.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 md:p-6 border-t bg-background gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleResetToDefault}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Reset to Default
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-gradient-primary hover:bg-gradient-primary/90 flex-1 sm:flex-none"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 