"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, Search, Send, UserCheck, Menu, X, Building2, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const steps = [
    {
      number: 1,
      title: "Check Eligibility",
      description: "Answer a few quick questions to see if your R&D project qualifies for the tax incentive.",
      icon: Search,
      color: "bg-blue-100 text-blue-600",
    },
    {
      number: 2,
      title: "Create Your Profile",
      description: "Register your organisation and authorised representatives securely.",
      icon: UserCheck,
      color: "bg-purple-100 text-purple-600",
    },
    {
      number: 3,
      title: "Complete Project Builder",
      description: "Use our guided wizard to document your R&D activities, methodology, and team.",
      icon: FileText,
      color: "bg-green-100 text-green-600",
    },
    {
      number: 4,
      title: "Upload Evidence",
      description: "Securely upload supporting documents: R&D plans, timesheets, experiment logs, and more.",
      icon: CheckCircle2,
      color: "bg-orange-100 text-orange-600",
    },
    {
      number: 5,
      title: "Submit Application",
      description: "Review your readiness score, generate your application pack, and submit to DSTI.",
      icon: Send,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DSTI R&D Platform
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <a href="/how-it-works" className="text-blue-600 font-semibold">
                How It Works
              </a>
              <a href="/guidelines" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Guidelines
              </a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Sign In
              </a>
              <a href="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold">
                Register
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              suppressHydrationWarning
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <a
                href="/how-it-works"
                className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="/guidelines"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guidelines
              </a>
              <a
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-center font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium mb-4 shadow-sm text-sm">
            <FileText className="w-4 h-4" />
            <span>5-Step Process</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our streamlined process makes applying for the R&D Tax Incentive simple, 
            secure, and guided every step of the way.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-blue-300 rounded-full hidden md:block" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="relative flex items-start gap-8">
                {/* Icon Circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div className={`w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg">
                        {step.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl p-12 sm:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium mb-4 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Start Your Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Check if your project qualifies in just 2 minutes, or dive straight into your application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/eligibility"
                className="group px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105 duration-300 inline-flex items-center justify-center gap-2"
              >
                Check Eligibility
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/register"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105 duration-300"
              >
                Start Application
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">DSTI R&D Platform</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Modern, secure, audit-ready application system for South Africa&apos;s R&D Tax Incentive Programme.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Home</Link></li>
                <li><a href="/how-it-works" className="hover:text-white transition-colors hover:translate-x-1 inline-block">How It Works</a></li>
                <li><a href="/guidelines" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Guidelines</a></li>
                <li><a href="/eligibility" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Check Eligibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Sign In</a></li>
                <li><a href="mailto:support@dsti.gov.za" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Department of Science, Technology and Innovation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
