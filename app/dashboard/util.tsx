"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchUserSummaries } from './data'; // Import the client-side fetch function

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { FileText, Upload } from "lucide-react"
import { format } from 'date-fns'; // Import date-fns for date formatting
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DashboardPage() {
  const { data: summaries, isLoading, isError, error } = useQuery({
    queryKey: ['userSummaries'],
    queryFn: fetchUserSummaries,
  });

  if (isLoading) {
    return (
      <div>
        <p>Loading summaries...</p>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching summaries:", error);
    return (
      <div>
        <p>Error loading summaries.</p>
      </div>
    );
  }

  // Handle the case where fetchUserSummaries returns null (user not logged in)
  if (!summaries) {
     return (
      <div>
        <p>Please log in to view your summaries.</p>
        {/* Optionally add a login link or redirect */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Summaries</CardTitle>
            <CardDescription>Your summarization activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summaries.length || 0}</div> {/* Display total summaries */}
          </CardContent>
        </Card>


      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Summaries</h2>
        {summaries.length > 0 ? (
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
