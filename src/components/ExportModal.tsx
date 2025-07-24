'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Calendar, PawPrint, Tag, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ExportModalProps {
  pets: any[];
  categories: any[];
  expenses: any[];
  trigger: React.ReactNode;
}

export default function ExportModal({ pets, categories, expenses, trigger }: ExportModalProps) {
  const [exportType, setExportType] = useState<'all' | 'pet' | 'category' | 'dateRange'>('all');
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const getFilteredExpenses = () => {
    let filtered = expenses;

    switch (exportType) {
      case 'pet':
        if (selectedPet) {
          filtered = expenses.filter(expense => expense.petId === selectedPet);
        }
        break;
      case 'category':
        if (selectedCategory) {
          filtered = expenses.filter(expense => expense.categoryId === selectedCategory);
        }
        break;
      case 'dateRange':
        if (startDate && endDate) {
          filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return expenseDate >= start && expenseDate <= end;
          });
        }
        break;
      default:
        // 'all' - no filtering
        break;
    }

    return filtered;
  };

  const exportToCSV = () => {
    const filteredExpenses = getFilteredExpenses();
    
    if (filteredExpenses.length === 0) {
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
    const rows = filteredExpenses.map(expense => {
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

    // Generate filename
    let fileName = 'pet-expenses';
    switch (exportType) {
      case 'pet':
        const pet = pets.find(p => p.id === selectedPet);
        fileName = `${pet?.name?.toLowerCase().replace(/\s+/g, '-')}-expenses`;
        break;
      case 'category':
        const category = categories.find(c => c.id === selectedCategory);
        fileName = `${category?.name?.toLowerCase().replace(/\s+/g, '-')}-expenses`;
        break;
      case 'dateRange':
        fileName = `expenses-${startDate}-to-${endDate}`;
        break;
      default:
        fileName = 'all-pet-expenses';
    }

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

    setIsOpen(false);
  };

  const getExportPreview = () => {
    const filteredExpenses = getFilteredExpenses();
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      count: filteredExpenses.length,
      totalAmount,
      currency: expenses[0]?.currency || 'USD'
    };
  };

  const preview = getExportPreview();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Download className="h-5 w-5 text-happy-blue" />
            Export Expenses
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Type</Label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as any)}
              className="w-full p-3 bg-secondary border border-border rounded-lg focus:border-happy-blue focus:outline-none"
            >
              <option value="all">📄 All Expenses</option>
              <option value="pet">🐾 By Pet</option>
              <option value="category">🏷️ By Category</option>
              <option value="dateRange">📅 By Date Range</option>
            </select>
          </div>

          {/* Conditional Options */}
          {exportType === 'pet' && (
            <div className="space-y-2">
              <Label htmlFor="pet-select">Select Pet</Label>
              <select
                id="pet-select"
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full p-2 bg-secondary border border-border rounded-lg focus:border-happy-blue focus:outline-none"
              >
                <option value="">Choose a pet...</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
            </div>
          )}

          {exportType === 'category' && (
            <div className="space-y-2">
              <Label htmlFor="category-select">Select Category</Label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 bg-secondary border border-border rounded-lg focus:border-happy-blue focus:outline-none"
              >
                <option value="">Choose a category...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          )}

          {exportType === 'dateRange' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 bg-secondary border border-border rounded-lg focus:border-happy-blue focus:outline-none"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 bg-secondary border border-border rounded-lg focus:border-happy-blue focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Export Preview:</div>
            <div className="text-sm">
              {preview.count} expenses • ${preview.totalAmount.toFixed(2)} {preview.currency}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={exportToCSV}
              disabled={preview.count === 0}
              className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-2 border-border hover:bg-secondary"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 