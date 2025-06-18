'use client';

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Map, Leaf, Droplets, Bug, User, Shield, FileSpreadsheet } from "lucide-react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useAuth } from "@/hooks/use-auth"

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Routes", href: "/routes", icon: Map },
  { name: "Farms", href: "/farms", icon: Leaf },
  { name: "Sampling", href: "/sampling", icon: Droplets },
  { name: "Pests & Diseases", href: "/pests", icon: Bug },
  { name: "Profile", href: "/profile", icon: User },
]

const adminNavigation = [
  { name: "Admin Dashboard", href: "/admin/dashboard", icon: Shield },
  { name: "Reports", href: "/reports", icon: FileSpreadsheet },
]

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const pathname = usePathname()
  const { isAdmin, isLoading } = useAuth()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-semibold">AgriSurvey</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
              )}
            >
              <item.icon
                className={cn(
                  isActive ? "text-green-700" : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 h-5 w-5 flex-shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
        
        {/* Admin Section - Only show when loaded and user is admin */}
        {!isLoading && isAdmin && (
          <>
            <div className="my-4 border-t pt-4">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin
              </p>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-green-700" : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </>
        )}
      </nav>
    </div>
  )

  // Desktop sidebar
  if (!isOpen && !onClose) {
    return (
      <div className={cn("hidden lg:flex lg:flex-shrink-0", className)}>
        <div className="flex w-64 flex-col border-r bg-white">
          <SidebarContent />
        </div>
      </div>
    )
  }

  // Mobile sidebar
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0">
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  )
} 