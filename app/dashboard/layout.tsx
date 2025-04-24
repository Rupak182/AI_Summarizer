"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FileText, Home, LogOut, Menu, User } from "lucide-react"
import { signOut } from "./action"
import ReactQueryProvider from "@/components/providers/ReactQueryProvider"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
 
  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/dashboard/summarize",
      label: "Summarize",
      icon: FileText,
    },
    // {
    //   href: "/dashboard/profile",
    //   label: "Profile",
    //   icon: User,
    // },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden absolute left-4 top-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">NoteSummarizer</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">NoteSummarizer</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                pathname === route.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
        <form action={signOut} method="post">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            type="submit"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center md:px-6 px-4">
          <div className="md:hidden w-8" /> {/* Spacer for mobile menu button */}
          <h1 className="text-xl font-semibold">
            {routes.find((route) => route.href === pathname)?.label || "Dashboard"}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
