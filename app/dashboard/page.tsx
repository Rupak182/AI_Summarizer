import { createClient } from '@/utils/supabase/server'


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { FileText, Upload } from "lucide-react"
import { redirect } from 'next/navigation'
import { format } from 'date-fns'; // Import date-fns for date formatting
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    redirect('/login')
  }
  console.log("user",userData)

  const userId = userData.user.id;

  // Fetch summaries for the authenticated user
  const { data: summaries, error: summariesError } = await supabase
    .from('summary')
    .select('id, text, created_at') // Select id, text, and created_at
    .eq('user_id', userId) // Filter by the authenticated user's ID
    .order('created_at', { ascending: false }); // Order by creation date

  if (summariesError) {
    console.error("Error fetching summaries:", summariesError);
    // Optionally display an error message to the user
    return (
      <div>
        <p>Error loading summaries.</p>
      </div>
    );
  }

  

  console.log("summary-data",summaries)

  return (
    <div className="space-y-6">
      <div className="">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Summaries</CardTitle>
            <CardDescription>Your summarization activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summaries?.length || 0}</div> {/* Display total summaries */}
          </CardContent>
        </Card>
       
       
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Summaries</h2>
        {summaries && summaries.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* Use grid for cards */}
            {summaries.map((summary) => (
              <Link key={summary.id} href={`/dashboard/summaries/${summary.id}`}> {/* Link to dynamic route */}
                <Card className="h-full flex flex-col justify-between"> {/* Make card clickable and fill height */}
                  <CardHeader>
                    <CardDescription>{format(new Date(summary.created_at), 'PPP')}</CardDescription> {/* Display formatted date */}
                  </CardHeader>
                  <CardContent className="flex-grow"> {/* Allow content to grow */}
                     <div className="rounded-lg border bg-card p-4 prose max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {summary.text.substring(0, 200)} 
                                      {/* fix for exactly 200 */}
                                    </ReactMarkdown>
                                  </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0">Read Full Summary</Button> {/* Button style link */}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Upload your first document to get started with AI summarization</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No summaries yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                Upload your first document and let our AI create a concise summary for you.
              </p>
              <Link href="/dashboard/summarize">
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Summarize a Document
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
