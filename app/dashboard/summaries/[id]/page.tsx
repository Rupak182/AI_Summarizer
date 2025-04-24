import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SummaryDetails from "./SummaryDetails";
import Link from 'next/link';

interface SummaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SummaryPage({ params }: SummaryPageProps) {
  const awaitedParams = await params;
  const summaryId = awaitedParams.id;

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect('/login');
  }

  const userId = userData.user.id;

  // Fetch the specific summary for the authenticated user
  const { data: summary, error: summaryError } = await supabase
    .from('summary')
    .select('id, text, created_at')
    .eq('id', summaryId)
    .eq('user_id', userId) // Ensure the summary belongs to the authenticated user
    .single(); // Expecting a single result

  if (summaryError || !summary) {
    console.error("Error fetching summary:", summaryError);
    redirect('/dashboard'); // Redirect back to dashboard if summary not found
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard">
        <Button variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
      <SummaryDetails summaryId={summary.id} summaryText={summary.text} createdAt={summary.created_at} />
    </div>
  );
}
