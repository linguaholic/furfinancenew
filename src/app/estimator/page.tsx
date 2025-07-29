'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, PawPrint, DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Pet type definitions
const PET_TYPES = [
  { id: 'dog', name: 'Dog', icon: '🐕' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'bird', name: 'Bird', icon: '🐦' },
  { id: 'fish', name: 'Fish', icon: '🐠' },
  { id: 'rabbit', name: 'Rabbit', icon: '🐰' },
  { id: 'hamster', name: 'Hamster', icon: '🐹' },
];

// Dog breeds with cost multipliers
const DOG_BREEDS = [
  { id: 'golden-retriever', name: 'Golden Retriever', size: 'large', costMultiplier: 1.2 },
  { id: 'labrador', name: 'Labrador Retriever', size: 'large', costMultiplier: 1.1 },
  { id: 'german-shepherd', name: 'German Shepherd', size: 'large', costMultiplier: 1.3 },
  { id: 'bulldog', name: 'Bulldog', size: 'medium', costMultiplier: 1.4 },
  { id: 'beagle', name: 'Beagle', size: 'medium', costMultiplier: 0.9 },
  { id: 'poodle', name: 'Poodle', size: 'medium', costMultiplier: 1.2 },
  { id: 'chihuahua', name: 'Chihuahua', size: 'small', costMultiplier: 0.7 },
  { id: 'yorkie', name: 'Yorkshire Terrier', size: 'small', costMultiplier: 0.8 },
  { id: 'great-dane', name: 'Great Dane', size: 'giant', costMultiplier: 1.8 },
  { id: 'mixed', name: 'Mixed Breed', size: 'medium', costMultiplier: 0.8 },
];

// Cat breeds
const CAT_BREEDS = [
  { id: 'persian', name: 'Persian', costMultiplier: 1.3 },
  { id: 'siamese', name: 'Siamese', costMultiplier: 1.1 },
  { id: 'maine-coon', name: 'Maine Coon', costMultiplier: 1.2 },
  { id: 'british-shorthair', name: 'British Shorthair', costMultiplier: 1.0 },
  { id: 'ragdoll', name: 'Ragdoll', costMultiplier: 1.1 },
  { id: 'domestic-shorthair', name: 'Domestic Shorthair', costMultiplier: 0.8 },
  { id: 'mixed-cat', name: 'Mixed Breed', costMultiplier: 0.8 },
];

// Lifestyle options
const LIFESTYLES = [
  { id: 'budget', name: 'Budget-Friendly', description: 'Basic care, DIY grooming', costMultiplier: 0.7 },
  { id: 'standard', name: 'Standard Care', description: 'Recommended care level', costMultiplier: 1.0 },
  { id: 'premium', name: 'Premium Care', description: 'Luxury care, professional services', costMultiplier: 1.5 },
];

// Base costs (monthly)
const BASE_COSTS = {
  dog: {
    food: 60,
    vet: 40,
    grooming: 30,
    supplies: 25,
    insurance: 50,
  },
  cat: {
    food: 40,
    vet: 30,
    grooming: 15,
    supplies: 20,
    insurance: 35,
  },
  bird: {
    food: 25,
    vet: 20,
    grooming: 10,
    supplies: 15,
    insurance: 20,
  },
  fish: {
    food: 15,
    vet: 5,
    grooming: 0,
    supplies: 30,
    insurance: 10,
  },
  rabbit: {
    food: 30,
    vet: 25,
    grooming: 10,
    supplies: 20,
    insurance: 25,
  },
  hamster: {
    food: 15,
    vet: 10,
    grooming: 5,
    supplies: 10,
    insurance: 15,
  },
};

interface EstimatorState {
  petType: string;
  breed: string;
  age: number;
  lifestyle: string;
  location: string;
}

export default function PetExpenseEstimator() {
  const [state, setState] = useState<EstimatorState>({
    petType: '',
    breed: '',
    age: 1,
    lifestyle: 'standard',
    location: 'us',
  });

  const [showResults, setShowResults] = useState(false);

  const getBreeds = () => {
    switch (state.petType) {
      case 'dog':
        return DOG_BREEDS;
      case 'cat':
        return CAT_BREEDS;
      default:
        return [];
    }
  };

  const getSelectedBreed = () => {
    const breeds = getBreeds();
    return breeds.find(b => b.id === state.breed);
  };

  const getSelectedLifestyle = () => {
    return LIFESTYLES.find(l => l.id === state.lifestyle);
  };

  const calculateCosts = () => {
    if (!state.petType || !state.breed) return null;

    const baseCosts = BASE_COSTS[state.petType as keyof typeof BASE_COSTS];
    const breed = getSelectedBreed();
    const lifestyle = getSelectedLifestyle();

    if (!baseCosts || !breed || !lifestyle) return null;

    // Calculate monthly costs
    const monthlyCosts = {
      food: baseCosts.food * breed.costMultiplier * lifestyle.costMultiplier,
      vet: baseCosts.vet * breed.costMultiplier * lifestyle.costMultiplier,
      grooming: baseCosts.grooming * breed.costMultiplier * lifestyle.costMultiplier,
      supplies: baseCosts.supplies * breed.costMultiplier * lifestyle.costMultiplier,
      insurance: baseCosts.insurance * breed.costMultiplier * lifestyle.costMultiplier,
    };

    const totalMonthly = Object.values(monthlyCosts).reduce((sum, cost) => sum + cost, 0);
    const totalAnnual = totalMonthly * 12;
    const totalLifetime = totalAnnual * 15; // Assuming 15-year lifespan

    // Age adjustments
    const ageMultiplier = state.age <= 1 ? 1.3 : state.age >= 7 ? 1.5 : 1.0;

    return {
      monthly: {
        ...monthlyCosts,
        total: totalMonthly * ageMultiplier,
      },
      annual: totalAnnual * ageMultiplier,
      lifetime: totalLifetime * ageMultiplier,
      emergency: totalMonthly * 3, // 3 months emergency fund
    };
  };

  const costs = calculateCosts();

  const handleCalculate = () => {
    if (state.petType && state.breed) {
      setShowResults(true);
    }
  };

  const resetCalculator = () => {
    setState({
      petType: '',
      breed: '',
      age: 1,
      lifestyle: 'standard',
      location: 'us',
    });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fur Finance
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-primary rounded-full">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Pet Expense Estimator</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the true cost of pet ownership and plan your budget with our interactive calculator
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            /* Calculator Form */
            <Card className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <PawPrint className="h-6 w-6 text-happy-green" />
                  Build Your Pet Profile
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Answer a few questions to get an accurate cost estimate for your pet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pet Type Selection */}
                <div className="space-y-3">
                  <Label className="text-white text-lg">1. What type of pet are you considering?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PET_TYPES.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => setState({ ...state, petType: pet.id, breed: '' })}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          state.petType === pet.id
                            ? 'border-happy-green bg-happy-green/10 text-happy-green'
                            : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-2">{pet.icon}</div>
                        <div className="font-medium">{pet.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breed Selection */}
                {state.petType && (
                  <div className="space-y-3">
                    <Label className="text-white text-lg">2. Select the breed</Label>
                    <Select value={state.breed} onValueChange={(value) => setState({ ...state, breed: value })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Choose a breed" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {getBreeds().map((breed) => (
                          <SelectItem key={breed.id} value={breed.id} className="text-white hover:bg-gray-700">
                            {breed.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Age Selection */}
                {state.breed && (
                  <div className="space-y-3">
                    <Label className="text-white text-lg">3. How old is your pet? (years)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[state.age]}
                        onValueChange={([value]) => setState({ ...state, age: value })}
                        max={15}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Puppy/Kitten (0-1)</span>
                        <span>Adult (1-7)</span>
                        <span>Senior (7+)</span>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                          {state.age} {state.age === 1 ? 'year' : 'years'} old
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lifestyle Selection */}
                {state.age > 0 && (
                  <div className="space-y-3">
                    <Label className="text-white text-lg">4. What&apos;s your care style?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {LIFESTYLES.map((lifestyle) => (
                        <button
                          key={lifestyle.id}
                          onClick={() => setState({ ...state, lifestyle: lifestyle.id })}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            state.lifestyle === lifestyle.id
                              ? 'border-happy-green bg-happy-green/10 text-happy-green'
                              : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                          }`}
                        >
                          <div className="font-medium mb-1">{lifestyle.name}</div>
                          <div className="text-sm opacity-80">{lifestyle.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calculate Button */}
                {state.lifestyle && (
                  <div className="pt-6">
                    <Button
                      onClick={handleCalculate}
                      disabled={!state.petType || !state.breed}
                      className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate Pet Costs
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="bg-gray-800 border-gray-700 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-happy-green" />
                    Your Pet Cost Summary
                  </CardTitle>
                                     <CardDescription className="text-gray-400">
                     Here&apos;s what you can expect to spend on your {getSelectedBreed()?.name}
                   </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-happy-green mb-1">
                        ${costs?.monthly.total.toFixed(0)}
                      </div>
                      <div className="text-gray-400">Monthly</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-happy-green mb-1">
                        ${costs?.annual.toFixed(0)}
                      </div>
                      <div className="text-gray-400">Annually</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-happy-green mb-1">
                        ${costs?.lifetime.toFixed(0)}
                      </div>
                      <div className="text-gray-400">Lifetime (15 years)</div>
                    </div>
                  </div>

                  {/* Monthly Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Monthly Cost Breakdown</h3>
                    <div className="space-y-2">
                      {costs && Object.entries(costs.monthly).map(([category, amount]) => {
                        if (category === 'total') return null;
                        return (
                          <div key={category} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300 capitalize">{category}</span>
                            <span className="text-white font-medium">${amount.toFixed(0)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Emergency Fund Recommendation */}
                  <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-1">Emergency Fund Recommendation</h4>
                        <p className="text-gray-300 text-sm">
                          We recommend saving at least <span className="font-semibold text-white">${costs?.emergency.toFixed(0)}</span> for unexpected veterinary expenses.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-6 py-3 rounded-xl"
                >
                  Calculate Another Pet
                </Button>
                <Button
                  onClick={() => {/* TODO: Share functionality */}}
                  className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-6 py-3 rounded-xl"
                >
                  Share Results
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 