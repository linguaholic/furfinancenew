'use client';

import { useFurFinanceStore } from '@/store';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { notFound } from 'next/navigation';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const { categories } = useFurFinanceStore.getState();
  
  const category = categories.find(cat => cat.id === id);
  
  if (!category) {
    notFound();
  }

  return <CategoryForm category={category} />;
} 