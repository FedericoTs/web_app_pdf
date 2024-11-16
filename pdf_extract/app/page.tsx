'use client'

import { Button } from "@/app/components/ui/button"
import { FileText, Search, Database, Zap, Shield, Clock, ChevronRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Navigation from "@/app/components/shared/navigation"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation Header */}
      <Navigation 
        showSections={true} 
        onSectionClick={scrollToSection}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container flex flex-col items-center gap-4 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-center gap-4">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Transform Your PDF Documents into Actionable Data
            </h1>
            <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
              Extract, analyze, and utilize data from your PDF documents with our powerful AI-driven platform.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/signup">
              <Button size="lg">
                Start Free Trial
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={() => scrollToSection('features')}>
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-16">
          <h2 className="text-center text-3xl font-bold mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border">
              <Search className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Smart Extraction</h3>
              <p className="text-muted-foreground">Advanced AI algorithms to accurately extract text, tables, and forms from PDFs.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border">
              <Database className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Structured Data</h3>
              <p className="text-muted-foreground">Convert unstructured PDF content into organized, usable data formats.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border">
              <Zap className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
              <p className="text-muted-foreground">Process multiple PDFs simultaneously with lightning-fast speed.</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="container py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-3xl font-bold mb-12">Our Services</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Document Processing</h3>
                  <p className="text-muted-foreground">Your documents are processed with enterprise-grade security. All data is encrypted and automatically deleted after processing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Database className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data Extraction & Analysis</h3>
                  <p className="text-muted-foreground">Extract text, tables, forms, and images from PDFs. Convert them into various formats including JSON, CSV, and Excel.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Clock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Batch Processing</h3>
                  <p className="text-muted-foreground">Process multiple documents simultaneously. Perfect for large-scale document processing needs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container py-16">
          <h2 className="text-center text-3xl font-bold mb-12">Simple, Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="flex flex-col p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-muted-foreground mb-4">Perfect for individuals and small projects</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>100 pages/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Basic OCR</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Export to JSON/CSV</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="mt-auto">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="flex flex-col p-6 bg-primary text-primary-foreground rounded-lg border border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-semibold py-1 px-3 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-primary-foreground/90 mb-4">For growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-primary-foreground/90">/month</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>500 pages/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Advanced OCR</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>All export formats</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>API access</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="mt-auto">
                <Button variant="secondary" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="flex flex-col p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-4">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited pages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Premium OCR</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="mt-auto">
                <Button className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">PDF Extract</span>
              </div>
              <p className="text-sm">
                Transform your PDF documents into actionable data with our powerful extraction platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors">
                    Pricing
                  </button>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm">
                &copy; {new Date().getFullYear()} PDF Extract. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
