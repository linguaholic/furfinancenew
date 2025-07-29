'use client';

import { useState, useEffect } from 'react';
import { useFurFinanceStore } from '@/store';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { notFound } from 'next/navigation';
import { ExpenseCategory } from '@/types';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryFormWrapper params={params} />
    </div>
  );
}

function CategoryFormWrapper({ params }: EditCategoryPageProps) {
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const { categories } = useFurFinanceStore();

  useEffect(() => {
    const loadCategory = async () => {
      const { id } = await params;
      const foundCategory = categories.find(cat => cat.id === id);
      if (foundCategory) {
        setCategory(foundCategory);
      }
      setLoading(false);
    };

    loadCategory();
  }, [params, categories]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!category) {
    notFound();
  }

  return <CategoryForm category={category} />;
} 