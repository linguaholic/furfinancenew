'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFurFinanceStore } from '@/store';
import { Pet } from '@/types';
import { ArrowLeft, PawPrint } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const petSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['dog', 'cat', 'bird', 'fish', 'reptile', 'small_animal', 'other']),
  breed: z.string().optional(),
  birthDate: z.string().optional(),
  photo: z.string().optional(),
});

type PetFormData = z.infer<typeof petSchema>;

interface PetFormProps {
  pet?: Pet;
  onSuccess?: () => void;
}

export function PetForm({ pet, onSuccess }: PetFormProps) {
  const { addPet, updatePet } = useFurFinanceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: pet ? {
      name: pet.name,
      type: pet.type,
      breed: pet.breed || '',
      birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : '',
      photo: pet.photo || '',
    } : {
      name: '',
      type: 'dog',
      breed: '',
      birthDate: '',
      photo: '',
    },
  });

  const onSubmit = async (data: PetFormData) => {
    setIsSubmitting(true);
    try {
      if (pet) {
        updatePet(pet.id, data);
        toast.success('Pet updated successfully! 🐾');
      } else {
        addPet(data);
        toast.success('Pet added successfully! 🐾');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error('Failed to save pet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: Record<string, { message: string }>) => {
    const errorMessages = Object.values(errors).map((error: { message: string }) => error.message);
    toast.error(`Please fill in all required fields: ${errorMessages.join(', ')}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/pets" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Pets
        </Link>
      </div>

      <Card className="bg-gradient-card border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{pet ? 'Edit Pet' : 'Add New Pet'}</CardTitle>
              <CardDescription>
                {pet ? 'Update your pet\'s information' : 'Add a new furry friend to track expenses'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
                              <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Pet Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter pet name"
                  className="bg-secondary border-border focus:border-happy-green"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">Pet Type *</Label>
                <Select
                  value={watch('type')}
                  onValueChange={(value) => setValue('type', value as 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'small_animal' | 'other')}
                >
                  <SelectTrigger className="bg-secondary border-border focus:border-happy-green">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                    <SelectItem value="reptile">Reptile</SelectItem>
                    <SelectItem value="small_animal">Small Animal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>

              {/* Breed */}
              <div className="space-y-2">
                <Label htmlFor="breed" className="text-foreground">Breed</Label>
                <Input
                  id="breed"
                  {...register('breed')}
                  placeholder="Enter breed (optional)"
                  className="bg-secondary border-border focus:border-happy-green"
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-foreground">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                  className="bg-secondary border-border focus:border-happy-green"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="text-foreground">Photo URL</Label>
              <Input
                id="photo"
                {...register('photo')}
                placeholder="https://example.com/pet-photo.jpg"
                className="bg-secondary border-border focus:border-happy-green"
              />
                              <p className="text-sm text-muted-foreground">
                  Optional: Add a URL to your pet&apos;s photo
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary hover:bg-gradient-primary/90 text-white border-0 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                {isSubmitting ? 'Saving...' : (pet ? 'Update Pet' : 'Add Pet')}
              </Button>
              <Link href="/pets">
                <Button type="button" variant="outline" className="border-2 border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-background px-8 py-3 rounded-xl transition-all duration-300">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 