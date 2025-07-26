'use client';

import { useState, useRef } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFurFinanceStore } from '@/store';
import { Pet } from '@/types';
import { ArrowLeft, PawPrint, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { petCreationLimiter, generateRateLimitKey } from '@/lib/rate-limiter';

const petSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .refine(name => !name.includes(';') && !name.includes('--') && !name.includes('/*'), {
      message: 'Name contains invalid characters'
    }),
  type: z.enum(['dog', 'cat', 'bird', 'fish', 'reptile', 'chicken', 'other']),
  breed: z.string()
    .max(100, 'Breed must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-']*$/, 'Breed can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),
  birthDate: z.string()
    .refine(date => {
      if (!date) return true; // Optional field
      const birthDate = new Date(date);
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 30, 0, 1); // 30 years ago
      const maxDate = new Date(now.getFullYear() + 1, 11, 31); // 1 year in future
      return birthDate >= minDate && birthDate <= maxDate;
    }, 'Birth date must be within the last 30 years and not in the future')
    .optional(),
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(pet?.photo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Rate limiting check for new pet creation
    if (!pet) {
      const rateLimitKey = generateRateLimitKey();
      if (!petCreationLimiter.isAllowed(rateLimitKey)) {
        const remainingTime = petCreationLimiter.getResetTime(rateLimitKey);
        const secondsLeft = remainingTime ? Math.ceil((remainingTime - Date.now()) / 1000) : 0;
        toast.error(`Too many pet creations. Please wait ${secondsLeft} seconds before trying again.`);
        return;
      }
    }

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

  const onError = (errors: FieldErrors<PetFormData>) => {
    const errorMessages = Object.values(errors).map((error) => error?.message || 'Invalid field').filter(Boolean);
    toast.error(`Please fill in all required fields: ${errorMessages.join(', ')}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setValue('photo', result);
      toast.success('Image uploaded successfully! 📸');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setValue('photo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                  onValueChange={(value) => setValue('type', value as 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'chicken' | 'other')}
                >
                  <SelectTrigger className="bg-secondary border-border focus:border-happy-green">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: '#000000', border: '1px solid #333333' }}>
                    <SelectItem value="dog" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Dog</SelectItem>
                    <SelectItem value="cat" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Cat</SelectItem>
                    <SelectItem value="bird" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Bird</SelectItem>
                    <SelectItem value="fish" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Fish</SelectItem>
                    <SelectItem value="reptile" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Reptile</SelectItem>
                    <SelectItem value="chicken" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Chicken</SelectItem>
                    <SelectItem value="other" style={{ backgroundColor: '#000000', color: '#ffffff' }}>Other</SelectItem>
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

            {/* Photo Upload */}
            <div className="space-y-4">
              <Label className="text-foreground">Pet Photo</Label>
              
              {uploadedImage ? (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Pet preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 h-6 w-6 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-happy-green transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload a photo of your pet
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-secondary border-border hover:bg-happy-green hover:text-white"
                  >
                    Choose Image
                  </Button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <p className="text-sm text-muted-foreground">
                Optional: Upload a photo of your pet (max 5MB)
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