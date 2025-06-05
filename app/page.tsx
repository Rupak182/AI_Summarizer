import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { signOut } from "./dashboard/action"


export default async function LandingPage() {


  const supabase = await createClient ()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    redirect('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">NoteSummarizer</span>
          </div>
          <div className="flex items-center gap-4">
            {
              !userData.user.id?
              <>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
            </>:
           <div className="flex gap-2">
              <form action={signOut}>
             <Button
               variant="ghost"
               className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
               type="submit"
             >
               <LogOut className="h-5 w-5" />
               Logout
             </Button>
             </form>
             <Link href="/dashboard">
               <Button >Dashboard</Button>
             </Link>
           </div>
             
            }
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Summarize Your Notes <span className="text-primary">Instantly</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
              Upload your text files and get concise, AI-powered summaries in seconds. No more manual reading through
              lengthy documents.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Start Summarizing <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Hero Image */}
        {/* <section className="container mb-20">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img
              src="/placeholder.svg?height=600&width=1200"
              alt="AI Note Summarizer Dashboard"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </section> */}

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Your Files</h3>
                <p className="text-gray-600">
                  Simply drag and drop your pdf file into the upload area.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="10" x2="10" y1="15" y2="9"></line>
                    <line x1="14" x2="14" y1="15" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
                <p className="text-gray-600">
                  Our advanced AI analyzes your document and extracts the key information.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Your Summary</h3>
                <p className="text-gray-600">
                  Receive a concise, well-structured summary that captures the essence of your document.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to save hours of reading time?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of students, researchers, and professionals who use NoteSummarizer daily.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started for Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">© 2024 NoteSummarizer. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-primary">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-primary">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-primary">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
