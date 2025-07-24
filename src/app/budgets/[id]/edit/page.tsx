import { EditBudgetPageClient } from '@/components/EditBudgetPageClient';

type EditBudgetPageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBudgetPage({ params }: EditBudgetPageProps) {
  const resolvedParams = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <EditBudgetPageClient budgetId={resolvedParams.id} />
    </div>
  );
} 