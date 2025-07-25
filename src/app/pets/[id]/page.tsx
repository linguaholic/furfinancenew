'use client';

import { useFurFinanceStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { 
  PawPrint, 
  Edit,
  ArrowLeft,
  DollarSign,
  Calendar,
  Heart,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pet } from '@/types';

interface PetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PetDetailPage({ params }: PetDetailPageProps) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const { pets, getPetExpenses } = useFurFinanceStore();

  useEffect(() => {
    const loadPet = async () => {
      const { id } = await params;
      const foundPet = pets.find(p => p.id === id);
      if (foundPet) {
        setPet(foundPet);
      }
      setLoading(false);
    };

    loadPet();
  }, [params, pets]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Pet not found</div>
      </div>
    );
  }

  const petExpenses = getPetExpenses(pet.id);
  const totalSpent = petExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recentExpenses = petExpenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/pets" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pets
        </Link>
      </div>

      {/* Pet Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-border flex items-center justify-center bg-secondary flex-shrink-0">
              <div className="text-3xl sm:text-4xl">
                {getPetTypeIcon(pet.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{pet.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <Badge variant="secondary" className="bg-happy-purple/20 text-happy-purple border-happy-purple/30 text-base sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
                  {getPetTypeLabel(pet.type)}
                </Badge>
                {pet.breed && (
                  <span className="text-base sm:text-lg text-muted-foreground">
                    {pet.breed}
                  </span>
                )}
              </div>
              {pet.birthDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Born {new Date(pet.birthDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Link href={`/pets/${pet.id}/edit`}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-happy-blue text-happy-blue hover:bg-happy-blue hover:text-white transition-all duration-300">
                <Edit className="h-4 w-4 mr-2" />
                Edit Pet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Financial Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-card border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-happy-green/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-happy-green" />
                </div>
                <CardTitle>Financial Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-happy-green mb-2">
                  {formatCurrency(totalSpent)}
                </div>
                <div className="text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold mb-2">
                  {petExpenses.length}
                </div>
                <div className="text-muted-foreground">Total Expenses</div>
              </div>
              <Link href={`/expenses/new?petId=${pet.id}`}>
                <Button className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-happy-purple/20 rounded-lg">
                  <Heart className="h-5 w-5 text-happy-purple" />
                </div>
                <CardTitle>Recent Expenses</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {recentExpenses.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-happy-purple/10 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-happy-purple" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">No expenses yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start tracking expenses for {pet.name} to see their spending history
                  </p>
                  <Link href={`/expenses/new?petId=${pet.id}`}>
                    <Button className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Expense
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/30 gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right sm:text-left">
                        <div className="font-bold text-lg text-happy-green">
                          {formatCurrency(expense.amount)}
                        </div>
                        {/* Category name would go here if we had the full category object */}
                      </div>
                    </div>
                  ))}
                  {petExpenses.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/expenses">
                        <Button variant="outline" className="border-happy-purple text-happy-purple hover:bg-happy-purple hover:text-white">
                          View All Expenses
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 