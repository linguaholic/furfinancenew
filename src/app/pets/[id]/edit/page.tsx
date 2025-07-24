'use client';

import { PetForm } from '@/components/forms/PetForm';
import { useFurFinanceStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Pet } from '@/types';

interface EditPetPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPetPage({ params }: EditPetPageProps) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const { pets } = useFurFinanceStore();
  const router = useRouter();

  useEffect(() => {
    const loadPet = async () => {
      const { id } = await params;
      const foundPet = pets.find(p => p.id === id);
      if (foundPet) {
        setPet(foundPet);
      } else {
        // Pet not found, redirect to pets list
        router.push('/pets');
      }
      setLoading(false);
    };

    loadPet();
  }, [params, pets, router]);

  const handleSuccess = () => {
    router.push('/pets');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <PetForm pet={pet} onSuccess={handleSuccess} />
    </div>
  );
} 