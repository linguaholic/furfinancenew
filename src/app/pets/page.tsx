'use client';

import { useFurFinanceStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      small_animal: '🐹',
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
      small_animal: 'Small Animal',
      other: 'Other'
    };
    return labels[type] || 'Other';
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
                <PawPrint className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">My Furry Family</h1>
                <p className="text-xl text-muted-foreground">Manage your beloved pets</p>
              </div>
            </div>
          </div>
          <Link href="/pets/new">
            <Button size="lg" className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-5 w-5 mr-2" />
              Add Pet
            </Button>
          </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => {
            const petExpenses = getPetExpenses(pet.id);
            const totalSpent = petExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            const recentExpenses = petExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3);

            return (
              <Card key={pet.id} className="bg-gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {getPetTypeIcon(pet.type)}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{pet.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-happy-purple/20 text-happy-purple border-happy-purple/30">
                            {getPetTypeLabel(pet.type)}
                          </Badge>
                          {pet.breed && (
                            <span className="text-sm text-muted-foreground">
                              {pet.breed}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
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
                <CardContent>
                  <div className="space-y-6">
                    {/* Total Spent */}
                    <div className="flex items-center justify-between p-4 bg-happy-green/10 rounded-xl border border-happy-green/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-happy-green/20 rounded-lg">
                          <DollarSign className="h-4 w-4 text-happy-green" />
                        </div>
                        <span className="font-medium">Total Spent</span>
                      </div>
                      <span className="font-bold text-xl text-happy-green">
                        {formatCurrency(totalSpent)}
                      </span>
                    </div>

                    {/* Recent Expenses */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-4 w-4 text-happy-purple" />
                        <h4 className="font-medium text-sm">Recent Expenses</h4>
                      </div>
                      {recentExpenses.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No expenses yet</p>
                          <p className="text-xs text-muted-foreground">Start tracking expenses for {pet.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {recentExpenses.map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30">
                              <span className="truncate text-sm font-medium">{expense.description}</span>
                              <span className="font-semibold text-happy-green">{formatCurrency(expense.amount)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Link href={`/expenses/new?petId=${pet.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Expense
                        </Button>
                      </Link>
                      <Link href={`/pets/${pet.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-2 border-happy-purple text-happy-purple hover:bg-happy-purple hover:text-white transition-all duration-300">
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