'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, PawPrint, DollarSign, AlertCircle, Zap, Trophy, Target, TrendingUp } from 'lucide-react';
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

// Bird breeds
const BIRD_BREEDS = [
  { id: 'parakeet', name: 'Parakeet', costMultiplier: 0.8 },
  { id: 'cockatiel', name: 'Cockatiel', costMultiplier: 1.0 },
  { id: 'lovebird', name: 'Lovebird', costMultiplier: 0.9 },
  { id: 'canary', name: 'Canary', costMultiplier: 0.7 },
  { id: 'finch', name: 'Finch', costMultiplier: 0.6 },
  { id: 'parrot', name: 'Parrot', costMultiplier: 1.5 },
  { id: 'mixed-bird', name: 'Mixed Breed', costMultiplier: 0.8 },
];

// Fish breeds
const FISH_BREEDS = [
  { id: 'goldfish', name: 'Goldfish', costMultiplier: 0.5 },
  { id: 'betta', name: 'Betta', costMultiplier: 0.8 },
  { id: 'tetra', name: 'Tetra', costMultiplier: 0.6 },
  { id: 'guppy', name: 'Guppy', costMultiplier: 0.4 },
  { id: 'angelfish', name: 'Angelfish', costMultiplier: 1.2 },
  { id: 'tropical', name: 'Tropical Fish', costMultiplier: 1.0 },
  { id: 'mixed-fish', name: 'Mixed Breed', costMultiplier: 0.7 },
];

// Rabbit breeds
const RABBIT_BREEDS = [
  { id: 'holland-lop', name: 'Holland Lop', costMultiplier: 1.1 },
  { id: 'netherland-dwarf', name: 'Netherland Dwarf', costMultiplier: 1.0 },
  { id: 'mini-rex', name: 'Mini Rex', costMultiplier: 1.2 },
  { id: 'lionhead', name: 'Lionhead', costMultiplier: 1.3 },
  { id: 'flemish-giant', name: 'Flemish Giant', costMultiplier: 1.5 },
  { id: 'dutch', name: 'Dutch', costMultiplier: 0.9 },
  { id: 'mixed-rabbit', name: 'Mixed Breed', costMultiplier: 0.8 },
];

// Hamster breeds
const HAMSTER_BREEDS = [
  { id: 'syrian', name: 'Syrian Hamster', costMultiplier: 1.0 },
  { id: 'dwarf', name: 'Dwarf Hamster', costMultiplier: 0.8 },
  { id: 'roborovski', name: 'Roborovski', costMultiplier: 0.9 },
  { id: 'winter-white', name: 'Winter White', costMultiplier: 0.9 },
  { id: 'chinese', name: 'Chinese Hamster', costMultiplier: 0.8 },
  { id: 'mixed-hamster', name: 'Mixed Breed', costMultiplier: 0.7 },
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

interface PetProfile {
  petType: string;
  breed: string;
  age: number;
  lifestyle: string;
  name: string;
}

interface VSState {
  pet1: PetProfile;
  pet2: PetProfile;
  showResults: boolean;
}

export default function PetVSMode() {
  const [state, setState] = useState<VSState>({
    pet1: {
      petType: '',
      breed: '',
      age: 1,
      lifestyle: 'standard',
      name: 'Pet 1',
    },
    pet2: {
      petType: '',
      breed: '',
      age: 1,
      lifestyle: 'standard',
      name: 'Pet 2',
    },
    showResults: false,
  });

  const getBreeds = (petType: string) => {
    switch (petType) {
      case 'dog':
        return DOG_BREEDS;
      case 'cat':
        return CAT_BREEDS;
      case 'bird':
        return BIRD_BREEDS;
      case 'fish':
        return FISH_BREEDS;
      case 'rabbit':
        return RABBIT_BREEDS;
      case 'hamster':
        return HAMSTER_BREEDS;
      default:
        return [];
    }
  };

  const getSelectedBreed = (petType: string, breedId: string) => {
    const breeds = getBreeds(petType);
    return breeds.find(b => b.id === breedId);
  };

  const getSelectedLifestyle = (lifestyleId: string) => {
    return LIFESTYLES.find(l => l.id === lifestyleId);
  };

  const calculateCosts = (pet: PetProfile) => {
    if (!pet.petType || !pet.breed) return null;

    const baseCosts = BASE_COSTS[pet.petType as keyof typeof BASE_COSTS];
    const breed = getSelectedBreed(pet.petType, pet.breed);
    const lifestyle = getSelectedLifestyle(pet.lifestyle);

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
    const ageMultiplier = pet.age <= 1 ? 1.3 : pet.age >= 7 ? 1.5 : 1.0;

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

  const updatePet = (petNumber: 1 | 2, updates: Partial<PetProfile>) => {
    setState(prev => ({
      ...prev,
      [`pet${petNumber}`]: { ...prev[`pet${petNumber}` as keyof Pick<VSState, 'pet1' | 'pet2'>], ...updates }
    }));
  };

  const handleBattle = () => {
    if (state.pet1.petType && state.pet1.breed && state.pet2.petType && state.pet2.breed) {
      setState(prev => ({ ...prev, showResults: true }));
    }
  };

  const resetBattle = () => {
    setState({
      pet1: {
        petType: '',
        breed: '',
        age: 1,
        lifestyle: 'standard',
        name: 'Pet 1',
      },
      pet2: {
        petType: '',
        breed: '',
        age: 1,
        lifestyle: 'standard',
        name: 'Pet 2',
      },
      showResults: false,
    });
  };

  const costs1 = calculateCosts(state.pet1);
  const costs2 = calculateCosts(state.pet2);

  const getWinner = () => {
    if (!costs1 || !costs2) return null;
    return costs1.monthly.total < costs2.monthly.total ? 1 : costs2.monthly.total < costs1.monthly.total ? 2 : 0;
  };

  const winner = getWinner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/estimator" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Estimator
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-primary rounded-full">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Pet Cost Battle</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Compare the true costs of different pets in an epic financial showdown!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {!state.showResults ? (
            /* VS Setup Form */
            <div className="space-y-8">
              {/* VS Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-happy-green to-happy-blue rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-4xl">🐾</span>
                  </div>
                  <div className="text-6xl font-bold text-white animate-pulse">VS</div>
                  <div className="w-32 h-32 bg-gradient-to-br from-happy-purple to-happy-pink rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-4xl">🐾</span>
                  </div>
                </div>
                <p className="text-gray-400">Configure your contenders below</p>
              </div>

              {/* Pet Configuration Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pet 1 Card */}
                <Card className="bg-gray-800 border-gray-700 shadow-xl border-2 border-happy-green/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-happy-green rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">1</span>
                      </div>
                      {state.pet1.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Configure your first contender
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pet Name */}
                    <div className="space-y-2">
                      <Label className="text-white">Pet Name</Label>
                      <input
                        type="text"
                        value={state.pet1.name}
                        onChange={(e) => updatePet(1, { name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-happy-green focus:outline-none"
                        placeholder="Enter pet name"
                      />
                    </div>

                    {/* Pet Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-white">Pet Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PET_TYPES.map((pet) => (
                          <button
                            key={pet.id}
                            onClick={() => updatePet(1, { petType: pet.id, breed: '' })}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                              state.pet1.petType === pet.id
                                ? 'border-happy-green bg-happy-green/10 text-happy-green'
                                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                            }`}
                          >
                            <div className="text-2xl mb-1">{pet.icon}</div>
                            <div className="text-sm font-medium">{pet.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Breed Selection */}
                    {state.pet1.petType && (
                      <div className="space-y-2">
                        <Label className="text-white">Breed</Label>
                        <Select value={state.pet1.breed} onValueChange={(value) => updatePet(1, { breed: value })}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Choose a breed" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {getBreeds(state.pet1.petType).map((breed) => (
                              <SelectItem key={breed.id} value={breed.id} className="text-white hover:bg-gray-700">
                                {breed.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Age Selection */}
                    {state.pet1.breed && (
                      <div className="space-y-2">
                        <Label className="text-white">Age (years)</Label>
                        <Slider
                          value={[state.pet1.age]}
                          onValueChange={([value]) => updatePet(1, { age: value })}
                          max={15}
                          min={0}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="text-center">
                          <Badge variant="secondary" className="text-lg px-4 py-2">
                            {state.pet1.age} {state.pet1.age === 1 ? 'year' : 'years'} old
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Lifestyle Selection */}
                    {state.pet1.age > 0 && (
                      <div className="space-y-3">
                        <Label className="text-white">Care Style</Label>
                        <div className="space-y-2">
                          {LIFESTYLES.map((lifestyle) => (
                            <button
                              key={lifestyle.id}
                              onClick={() => updatePet(1, { lifestyle: lifestyle.id })}
                              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                                state.pet1.lifestyle === lifestyle.id
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
                  </CardContent>
                </Card>

                {/* Pet 2 Card */}
                <Card className="bg-gray-800 border-gray-700 shadow-xl border-2 border-happy-purple/20">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <div className="w-8 h-8 bg-happy-purple rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      {state.pet2.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Configure your second contender
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pet Name */}
                    <div className="space-y-2">
                      <Label className="text-white">Pet Name</Label>
                      <input
                        type="text"
                        value={state.pet2.name}
                        onChange={(e) => updatePet(2, { name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-happy-purple focus:outline-none"
                        placeholder="Enter pet name"
                      />
                    </div>

                    {/* Pet Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-white">Pet Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PET_TYPES.map((pet) => (
                          <button
                            key={pet.id}
                            onClick={() => updatePet(2, { petType: pet.id, breed: '' })}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                              state.pet2.petType === pet.id
                                ? 'border-happy-purple bg-happy-purple/10 text-happy-purple'
                                : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-600'
                            }`}
                          >
                            <div className="text-2xl mb-1">{pet.icon}</div>
                            <div className="text-sm font-medium">{pet.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Breed Selection */}
                    {state.pet2.petType && (
                      <div className="space-y-2">
                        <Label className="text-white">Breed</Label>
                        <Select value={state.pet2.breed} onValueChange={(value) => updatePet(2, { breed: value })}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Choose a breed" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {getBreeds(state.pet2.petType).map((breed) => (
                              <SelectItem key={breed.id} value={breed.id} className="text-white hover:bg-gray-700">
                                {breed.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Age Selection */}
                    {state.pet2.breed && (
                      <div className="space-y-2">
                        <Label className="text-white">Age (years)</Label>
                        <Slider
                          value={[state.pet2.age]}
                          onValueChange={([value]) => updatePet(2, { age: value })}
                          max={15}
                          min={0}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="text-center">
                          <Badge variant="secondary" className="text-lg px-4 py-2">
                            {state.pet2.age} {state.pet2.age === 1 ? 'year' : 'years'} old
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Lifestyle Selection */}
                    {state.pet2.age > 0 && (
                      <div className="space-y-3">
                        <Label className="text-white">Care Style</Label>
                        <div className="space-y-2">
                          {LIFESTYLES.map((lifestyle) => (
                            <button
                              key={lifestyle.id}
                              onClick={() => updatePet(2, { lifestyle: lifestyle.id })}
                              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                                state.pet2.lifestyle === lifestyle.id
                                  ? 'border-happy-purple bg-happy-purple/10 text-happy-purple'
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
                  </CardContent>
                </Card>
              </div>

              {/* Battle Button */}
              {state.pet1.petType && state.pet1.breed && state.pet2.petType && state.pet2.breed && (
                <div className="text-center pt-8">
                  <Button
                    onClick={handleBattle}
                    className="bg-gradient-to-r from-happy-green to-happy-purple hover:from-happy-green/90 hover:to-happy-purple/90 text-white border-0 px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xl font-bold"
                  >
                    <Zap className="h-6 w-6 mr-3" />
                    Start Battle!
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Battle Results */
            <div className="space-y-8">
              {/* Battle Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-500 ${
                    winner === 1 
                      ? 'bg-gradient-to-br from-happy-green to-happy-blue border-yellow-400 scale-110' 
                      : 'bg-gradient-to-br from-happy-green to-happy-blue border-white'
                  }`}>
                    <span className="text-4xl">🐾</span>
                  </div>
                  <div className="text-6xl font-bold text-white animate-pulse">VS</div>
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-500 ${
                    winner === 2 
                      ? 'bg-gradient-to-br from-happy-purple to-happy-pink border-yellow-400 scale-110' 
                      : 'bg-gradient-to-br from-happy-purple to-happy-pink border-white'
                  }`}>
                    <span className="text-4xl">🐾</span>
                  </div>
                </div>
                {winner === 0 ? (
                  <h2 className="text-2xl font-bold text-white">It&apos;s a Tie! 🏆</h2>
                ) : (
                  <h2 className="text-2xl font-bold text-white">
                    {winner === 1 ? state.pet1.name : state.pet2.name} Wins! 🏆
                  </h2>
                )}
                <p className="text-gray-400">Cost comparison results</p>
              </div>

              {/* Results Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pet 1 Results */}
                <Card className={`bg-gray-800 border-gray-700 shadow-xl transition-all duration-500 ${
                  winner === 1 ? 'border-2 border-yellow-400 scale-105' : 'border-2 border-happy-green/20'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        winner === 1 ? 'bg-yellow-400' : 'bg-happy-green'
                      }`}>
                        {winner === 1 ? <Trophy className="h-5 w-5 text-black" /> : <span className="text-white font-bold">1</span>}
                      </div>
                      {state.pet1.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {getSelectedBreed(state.pet1.petType, state.pet1.breed)?.name} • {getSelectedLifestyle(state.pet1.lifestyle)?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {costs1 && (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-3xl font-bold text-happy-green mb-1">
                            ${costs1.monthly.total.toFixed(0)}
                          </div>
                          <div className="text-gray-400">Monthly Cost</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-happy-green">
                              ${costs1.annual.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-400">Annual</div>
                          </div>
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-happy-green">
                              ${costs1.lifetime.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-400">Lifetime</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Monthly Breakdown</h4>
                          {Object.entries(costs1.monthly).map(([category, amount]) => {
                            if (category === 'total') return null;
                            return (
                              <div key={category} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                                <span className="text-gray-300 capitalize text-sm">{category}</span>
                                <span className="text-white font-medium">${amount.toFixed(0)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pet 2 Results */}
                <Card className={`bg-gray-800 border-gray-700 shadow-xl transition-all duration-500 ${
                  winner === 2 ? 'border-2 border-yellow-400 scale-105' : 'border-2 border-happy-purple/20'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        winner === 2 ? 'bg-yellow-400' : 'bg-happy-purple'
                      }`}>
                        {winner === 2 ? <Trophy className="h-5 w-5 text-black" /> : <span className="text-white font-bold">2</span>}
                      </div>
                      {state.pet2.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {getSelectedBreed(state.pet2.petType, state.pet2.breed)?.name} • {getSelectedLifestyle(state.pet2.lifestyle)?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {costs2 && (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gray-700 rounded-lg">
                          <div className="text-3xl font-bold text-happy-purple mb-1">
                            ${costs2.monthly.total.toFixed(0)}
                          </div>
                          <div className="text-gray-400">Monthly Cost</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-happy-purple">
                              ${costs2.annual.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-400">Annual</div>
                          </div>
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-happy-purple">
                              ${costs2.lifetime.toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-400">Lifetime</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Monthly Breakdown</h4>
                          {Object.entries(costs2.monthly).map(([category, amount]) => {
                            if (category === 'total') return null;
                            return (
                              <div key={category} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                                <span className="text-gray-300 capitalize text-sm">{category}</span>
                                <span className="text-white font-medium">${amount.toFixed(0)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Cost Difference */}
              {costs1 && costs2 && (
                <Card className="bg-gray-800 border-gray-700 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-happy-green" />
                      Cost Difference Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-happy-green mb-1">
                          ${Math.abs(costs1.monthly.total - costs2.monthly.total).toFixed(0)}
                        </div>
                        <div className="text-gray-400">Monthly Difference</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-happy-blue mb-1">
                          ${Math.abs(costs1.annual - costs2.annual).toFixed(0)}
                        </div>
                        <div className="text-gray-400">Annual Difference</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-happy-purple mb-1">
                          ${Math.abs(costs1.lifetime - costs2.lifetime).toFixed(0)}
                        </div>
                        <div className="text-gray-400">Lifetime Difference</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={resetBattle}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3 rounded-xl"
                >
                  New Battle
                </Button>
                <Button
                  onClick={() => {/* TODO: Share functionality */}}
                  className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl"
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