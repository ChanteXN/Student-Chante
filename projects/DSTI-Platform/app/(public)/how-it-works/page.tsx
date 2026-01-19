"use client";

import { useState } from "react";
import { CheckCircle2, FileText, Search, Send, UserCheck, Menu, X } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              DSTI R&D Platform
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition">
                Home
              </a>
              <a href="/how-it-works" className="text-blue-600 font-semibold">
                How It Works
              </a>
              <a href="/guidelines" className="text-gray-600 hover:text-blue-600 transition">
                Guidelines
              </a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition">
                Sign In
              </a>
              <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Register
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              suppressHydrationWarning
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3">
              <a
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/how-it-works"
                className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="/guidelines"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Guidelines
              </a>
              <a
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes applying for the R&D Tax Incentive simple, 
            secure, and guided every step of the way.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex items-start gap-8">
                {/* Icon Circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold">
                        {step.number}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-lg">
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
        <div className="mt-20 text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Check if your project qualifies in just 2 minutes, or dive straight into your application.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/eligibility"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-lg"
            >
              Check Eligibility
            </a>
            <a
              href="/portal"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold"
            >
              Start Application
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DSTI R&D Platform</h3>
              <p className="text-gray-400">
                Modern, secure, audit-ready application system for South Africa's R&D Tax Incentive Programme.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="/guidelines" className="hover:text-white transition">Guidelines</a></li>
                <li><a href="/eligibility" className="hover:text-white transition">Check Eligibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                <li><a href="mailto:support@dsti.gov.za" className="hover:text-white transition">Contact Support</a></li>
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
