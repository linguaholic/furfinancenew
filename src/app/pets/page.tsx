'use client';

import { useFurFinanceStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { 
  PawPrint, 
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Heart,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PetsPage() {
  const { pets, getPetExpenses, deletePet } = useFurFinanceStore();
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const handleDeletePet = async (petId: string) => {
    if (confirm('Are you sure you want to delete this pet? This will also delete all associated expenses.')) {
      setDeletingPetId(petId);
      try {
        deletePet(petId);
      } finally {
        setDeletingPetId(null);
      }
    }
  };

  const getPetTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      dog: '🐕',
      cat: '🐱',
      bird: '🐦',
      fish: '🐠',
      reptile: '🦎',
      other: '🐾'
    };
    return icons[type] || '🐾';
  };

  const getPetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dog: 'Dog',
      cat: 'Cat',
      bird: 'Bird',
      fish: 'Fish',
      reptile: 'Reptile',
      other: 'Other'
    };
    return labels[type] || 'Other';
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-gradient-primary rounded-xl flex-shrink-0">
              <PawPrint className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">My Furry Family</h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Manage your beloved pets</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link href="/pets/new">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Add Pet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {pets.length === 0 ? (
        <Card className="bg-gradient-card border-0 shadow-xl">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-happy-purple/10 rounded-full flex items-center justify-center">
              <PawPrint className="h-10 w-10 text-happy-purple" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No pets yet</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Add your first pet to start tracking expenses and building memories
            </p>
            <Link href="/pets/new">
              <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Pet
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {pets.map((pet) => {
            const petExpenses = getPetExpenses(pet.id);
            const totalSpent = petExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const recentExpenses = petExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3);

            return (
              <Card key={pet.id} className="bg-gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-border flex items-center justify-center bg-secondary flex-shrink-0">
                        {pet.photo ? (
                          <img 
                            src={pet.photo} 
                            alt={`${pet.name}`} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-xl sm:text-2xl">
                            {getPetTypeIcon(pet.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl sm:text-2xl break-words">{pet.name}</CardTitle>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-happy-purple/20 text-happy-purple border-happy-purple/30 text-xs sm:text-sm">
                            {getPetTypeLabel(pet.type)}
                          </Badge>
                          {pet.breed && (
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {pet.breed}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <Link href={`/pets/${pet.id}/edit`}>
                        <Button size="sm" variant="outline" className="border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeletePet(pet.id)}
                        disabled={deletingPetId === pet.id}
                        className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all duration-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-6 flex-1 flex flex-col">
                    {/* Total Spent */}
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-happy-green/10 rounded-xl border border-happy-green/20">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-happy-green/20 rounded-lg">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-happy-green" />
                        </div>
                        <span className="font-medium text-sm sm:text-base">Total Spent</span>
                      </div>
                      <span className="font-bold text-lg sm:text-xl text-happy-green">
                        {formatCurrency(totalSpent)}
                      </span>
                    </div>

                    {/* Recent Expenses */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-happy-purple" />
                        <h4 className="font-medium text-xs sm:text-sm">Recent Expenses</h4>
                      </div>
                      {recentExpenses.length === 0 ? (
                        <div className="text-center py-4 flex-1 flex flex-col justify-center">
                          <p className="text-xs sm:text-sm text-muted-foreground">No expenses yet</p>
                          <p className="text-xs text-muted-foreground">Start tracking expenses for {pet.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {recentExpenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-2 sm:p-3 bg-secondary/30 rounded-lg border border-border/30">
                              <span className="truncate text-xs sm:text-sm font-medium flex-1 mr-2">{expense.description}</span>
                              <span className="font-semibold text-happy-green text-xs sm:text-sm flex-shrink-0">{formatCurrency(expense.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 mt-auto">
                      <Link href={`/expenses/new?petId=${pet.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 text-xs sm:text-sm">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Expense
                        </Button>
                      </Link>
                      <Link href={`/pets/${pet.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-2 border-happy-purple text-happy-purple hover:bg-happy-purple hover:text-white transition-all duration-300 text-xs sm:text-sm">
                          <Sparkles className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </Link>
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