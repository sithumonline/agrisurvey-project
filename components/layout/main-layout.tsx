"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Map, Leaf, Droplets, Bug, BarChart, Settings, Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useMobile } from "@/hooks/use-mobile"
import MobileNav from "./mobile-nav"
import { OfflineIndicator } from "@/components/ui/offline-indicator"

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Routes", href: "/routes", icon: Map },
    { name: "Farms", href: "/farms", icon: Leaf },
    { name: "Sampling", href: "/sampling", icon: Droplets },
    { name: "Pests & Diseases", href: "/pests", icon: Bug },
    { name: "Reports", href: "/reports", icon: BarChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top header for mobile */}
      <header className="bg-white border-b border-gray-200 lg:hidden">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-green-800">AgriSurvey</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          isActive(item.href) ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/login"
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-green-800 ml-2">AgriSurvey</h1>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-xl font-bold text-green-800">AgriSurvey</h1>
            </div>
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href) ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link href="/login" className="flex items-center text-gray-600 hover:text-gray-900">
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileNav navItems={navItems} pathname={pathname} />
      
      {/* Offline indicator */}
      <OfflineIndicator />
    </div>
  )
}
