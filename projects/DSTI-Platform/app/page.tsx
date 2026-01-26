"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Building2, FileCheck, Menu, X, Users, TrendingUp, Award, Clock } from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DSTI R&D Platform
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How It Works
              </a>
              <a href="/guidelines" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Guidelines
              </a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Sign In
              </a>
              <a href="/register" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium">
                Get Started
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
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <a
                href="/how-it-works"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
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
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center mb-12 sm:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            <span>Government Certified Platform</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transform Your R&D
            </span>
            <br />
            Tax Incentive Journey
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamlined, secure, and intelligent platform for Section 11D applications.
            Join innovative companies maximizing their R&D tax benefits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/eligibility"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all text-base font-semibold shadow-xl hover:shadow-2xl flex items-center gap-2 group"
            >
              Check Eligibility
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/how-it-works"
              className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all text-base font-semibold shadow-lg"
            >
              Learn More
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>DSTI Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>500+ Companies Trust Us</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Guided Wizard</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Step-by-step project builder with intelligent autosave and real-time validation
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">AI Co-Pilot</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Intelligent assistance for compliance checking and quality improvement
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Secure & Auditable</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Bank-grade security with complete audit trails and compliance tracking
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">Readiness Score</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Real-time feedback on application completeness and submission readiness
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-10 sm:p-14 mb-16 border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-900">
            Why Companies Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">3x Faster</div>
              <p className="text-gray-600 text-base">Application completion time</p>
            </div>
            <div className="group">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">90%</div>
              <p className="text-gray-600 text-base">First-time approval rate</p>
            </div>
            <div className="group">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">500+</div>
              <p className="text-gray-600 text-base">Companies using our platform</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl p-10 sm:p-16 text-white text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-5">Ready to Transform Your R&D Journey?</h2>
            <p className="text-base sm:text-lg mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Join innovative companies already using our platform to secure their R&D tax benefits
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Start Free Application
              </a>
              <a
                href="/how-it-works"
                className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-blue-500/30 transition-all text-base font-semibold"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">DSTI R&D Platform</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Modern, secure, audit-ready application system for South Africa&apos;s R&D Tax Incentive Programme (Section 11D).
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Home</Link></li>
                <li><a href="/how-it-works" className="hover:text-white transition-colors hover:translate-x-1 inline-block">How It Works</a></li>
                <li><a href="/guidelines" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Guidelines</a></li>
                <li><a href="/eligibility" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Check Eligibility</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Get Started</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/register" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Register</a></li>
                <li><a href="/login" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Sign In</a></li>
                <li><a href="mailto:support@dsti.gov.za" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2026 Department of Science, Technology and Innovation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
