"use client"

import type React from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, FileText, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useChat } from "@ai-sdk/react"
import { createClient } from "@/utils/supabase/client"

export default function SummarizePage() {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length) {
      validateAndSetFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    // Reset states
    setError(null)
    setSummary(null)

    // Check file type
    const validTypes = [".pdf"]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!validTypes.includes(fileExtension)) {
      setError(`Invalid file type. Please upload a ${validTypes.join(", ")}  {
      setError(\`Invalid file type. Please upload a ${validTypes.join(", ")} file.`)
      return
    }

    // Set the file
    setFile(file)
    toast({
      title: "File uploaded",
      description: `${file.name} is ready to be summarized.`,
    })
  }

  const handleSubmit = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)

    let generatedSummary = null;

    try {
      // Simulate API call to summarize the file
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would send the file to your API
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log("data:", data)

      
      generatedSummary = data.summary;
      setSummary(generatedSummary);

      // Save summary to Supabase
      const { data: userData, error: userError } = await supabase.auth.getSession();
      if (userError || !userData?.session?.user) {
        console.error("Error getting user session:", userError);
        // Optionally show a toast or set an error state for the user
      } else if (generatedSummary) {
        const { data: insertData, error: insertError } = await supabase.from('summary').insert([{ user_id: userData.session.user.id, text: generatedSummary }]);
        if (insertError) {
          console.error("Error saving summary to Supabase:", insertError);
        } else {
          console.log("Summary saved to Supabase:", insertData);
          toast({
            title: "Summary Saved",
            description: "Your summary has been saved to your notes.",
          });
        }
      }
    } catch (error) {
      setError("An error occurred while summarizing your document. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setSummary(null)
    setError(null)
  }

  function cleanMarkdown(md: string) {
    // Remove all triple backtick code fences (with optional language)
    md = md.replace(/^```[\w]*\n?/gm, "");
    md = md.replace(/```$/gm, "");
    // Remove ALL leading whitespace from every line
    md = md.replace(/^\s+/gm, "");
    return md.trim();
  }
  return (
    <div className="w-full mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Summarize Document</CardTitle>
          <CardDescription>Upload a text file to generate an AI-powered summary</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!summary && (
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border"
                } ${file ? "bg-muted/50" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">{file ? file.name : "Drag & drop your file here"}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {file ? `${(file.size / 1024).toFixed(2)} KB` : "Supports .txt, .pdf, and .docx files"}
                  </p>
                </div>
                {!file && (
                  <div>
                    <label htmlFor="file-upload">
                      <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                        Select File
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {summary && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Summary</h3>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  Summarize Another Document
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-4 prose max-w-screen-xl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summary ? cleanMarkdown(summary) : ""}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {file && !summary && (
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                "Summarize Document"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
