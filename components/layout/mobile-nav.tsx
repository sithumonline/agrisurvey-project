import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

interface MobileNavProps {
  navItems: NavItem[]
  pathname: string
}

export default function MobileNav({ navItems, pathname }: MobileNavProps) {
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Only show the first 5 items in the mobile nav
  const mobileNavItems = navItems.slice(0, 5)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {mobileNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 text-xs ${
              isActive(item.href) ? "text-green-600" : "text-gray-600"
            }`}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
