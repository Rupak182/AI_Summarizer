'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function deleteSummary(summaryId: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect('/login');
  }

  const userId = userData.user.id;

  const { error } = await supabase
    .from('summary')
    .delete()
    .eq('id', summaryId)
    .eq('user_id', userId); // Ensure the summary belongs to the authenticated user

  if (error) {
    console.error("Error deleting summary:", error);
    // Handle error, maybe return an error status or message
    return { success: false, error: error.message };
  }

  // Redirect to the dashboard after successful deletion
  redirect('/dashboard');
}

export async function updateSummary(summaryId: string, newText: string) {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect('/login');
  }

  const userId = userData.user.id;

  const { error } = await supabase
    .from('summary')
    .update({ text: newText })
    .eq('id', summaryId)
    .eq('user_id', userId); // Ensure the summary belongs to the authenticated user

  if (error) {
    console.error("Error updating summary:", error);
    // Handle error, maybe return an error status or message
    return { success: false, error: error.message };
  }

  return { success: true };
}
