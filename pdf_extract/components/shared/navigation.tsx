import { FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

interface NavigationProps {
  showAuthButtons?: boolean
  showSections?: boolean
  onSectionClick?: (section: string) => void
}

export default function Navigation({ 
  showAuthButtons = true, 
  showSections = false,
  onSectionClick 
}: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="font-bold">PDF Extract</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {showSections && (
            <>
              <button 
                onClick={() => onSectionClick?.('features')} 
                className="transition-colors hover:text-foreground/80"
              >
                Features
              </button>
              <button 
                onClick={() => onSectionClick?.('services')} 
                className="transition-colors hover:text-foreground/80"
              >
                Services
              </button>
              <button 
                onClick={() => onSectionClick?.('pricing')} 
                className="transition-colors hover:text-foreground/80"
              >
                Pricing
              </button>
            </>
          )}
          {showAuthButtons && (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
