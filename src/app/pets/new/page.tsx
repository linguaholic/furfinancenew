'use client';

import { PetForm } from '@/components/forms/PetForm';
import { useRouter } from 'next/navigation';

export default function NewPetPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/pets');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PetForm onSuccess={handleSuccess} />
    </div>
  );
} 