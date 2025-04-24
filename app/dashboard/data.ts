import { createClient } from '@/utils/supabase/client';

export async function fetchUserSummaries() {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    // Handle the case where the user is not logged in
    // Depending on your application flow, you might throw an error,
    // return null, or redirect. For now, we'll return null.
    console.error("Error fetching user or user not logged in:", userError);
    return null;
  }

  const userId = userData.user.id;

  const { data: summaries, error: summariesError } = await supabase
    .from('summary')
    .select('id, text, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (summariesError) {
    console.error("Error fetching summaries:", summariesError);
    throw summariesError; // Throw the error to be caught by React Query
  }

  return summaries;
}
