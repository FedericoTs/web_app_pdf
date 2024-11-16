'use client'

import { FileText, Upload, History, Settings, LogOut, ChevronLeft, ChevronRight, BarChart3, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Upload",
    icon: Upload,
    href: "/dashboard/upload",
  },
  {
    title: "History",
    icon: History,
    href: "/dashboard/history",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsExpanded(false)
      }
    }
    
    // Initial check
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link href="/" className="flex items-center space-x-2">
                <FileText className="w-6 h-6" />
                <span className="text-xl font-bold">PDF Extract</span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                  onClick={() => {
                    // Implement logout functionality
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content wrapper - starts below navbar */}
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        {/* Sidebar & Main Content */}
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
              isExpanded ? "w-64" : "w-16"
            }`}
          >
            {/* Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute right-0 top-2 transform translate-x-1/2 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50"
            >
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            <div className="flex flex-col h-full">
              <nav className="flex-1 space-y-1 px-2 py-4">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center ${
                        isExpanded ? "px-3" : "justify-center px-2"
                      } py-2 text-sm font-medium rounded-md transition-all duration-200 group hover:bg-gray-100 ${
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "text-gray-600"
                      }`}
                    >
                      <item.icon className={`${
                        isExpanded ? "mr-3" : ""
                      } h-5 w-5 ${
                        isActive ? "text-primary-foreground" : "text-gray-400 group-hover:text-gray-600"
                      }`} />
                      {isExpanded && (
                        <span className="transition-opacity duration-200">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main 
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isExpanded ? "ml-64" : "ml-16"
            }`}
          >
            <div className="p-6">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
