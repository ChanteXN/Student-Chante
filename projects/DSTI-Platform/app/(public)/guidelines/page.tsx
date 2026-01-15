"use client";

import { useState } from "react";
import { Search, FileText, BookOpen, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GuidelinesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const guidelines = [
    {
      id: 1,
      title: "Section 11D R&D Tax Incentive Overview",
      category: "Getting Started",
      description: "Comprehensive overview of the R&D Tax Incentive programme, eligibility criteria, and benefits.",
      tags: ["Eligibility", "Overview", "Benefits"],
      lastUpdated: "January 2026",
      icon: BookOpen,
    },
    {
      id: 2,
      title: "Defining R&D Activities",
      category: "Core Concepts",
      description: "What qualifies as R&D under Section 11D: uncertainty, experimentation, and systematic investigation.",
      tags: ["R&D Definition", "Eligibility", "Technical"],
      lastUpdated: "December 2025",
      icon: FileText,
    },
    {
      id: 3,
      title: "Eligible Expenditure Categories",
      category: "Financial",
      description: "Detailed breakdown of qualifying costs: salaries, consumables, depreciation, and overheads.",
      tags: ["Expenditure", "Finance", "Claims"],
      lastUpdated: "January 2026",
      icon: CheckCircle,
    },
    {
      id: 4,
      title: "Evidence Requirements & Best Practices",
      category: "Compliance",
      description: "Required documentation: R&D plans, timesheets, experiment logs, literature reviews, and audit trails.",
      tags: ["Evidence", "Documentation", "Audit"],
      lastUpdated: "November 2025",
      icon: AlertCircle,
    },
    {
      id: 5,
      title: "Application Process & Timeline",
      category: "Process",
      description: "Step-by-step guide: submission deadlines, review process, decision timelines, and progress reporting.",
      tags: ["Process", "Timeline", "Submission"],
      lastUpdated: "January 2026",
      icon: Clock,
    },
    {
      id: 6,
      title: "Common Rejection Reasons & How to Avoid Them",
      category: "Tips & Tricks",
      description: "Learn from past applications: weak uncertainty statements, insufficient evidence, and scope creep.",
      tags: ["Rejections", "Best Practices", "Tips"],
      lastUpdated: "December 2025",
      icon: AlertCircle,
    },
  ];

  const filteredGuidelines = guidelines.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">
              DSTI R&D Platform
            </a>
            <nav className="flex gap-6">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition">
                Home
              </a>
              <a href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition">
                How It Works
              </a>
              <a href="/guidelines" className="text-blue-600 font-semibold">
                Guidelines
              </a>
              <a href="/login" className="text-gray-600 hover:text-blue-600 transition">
                Sign In
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Guidelines Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Searchable knowledge base to help you understand R&D Tax Incentive requirements, 
            best practices, and compliance standards.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search guidelines, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg rounded-xl shadow-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-600">
              {filteredGuidelines.length} result{filteredGuidelines.length !== 1 ? 's' : ''} found for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Guidelines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuidelines.map((guide) => (
            <Card key={guide.id} className="hover:shadow-xl transition cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <guide.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <Badge variant="outline">{guide.category}</Badge>
                  </div>
                </div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
                <CardDescription className="text-base">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Last updated: {guide.lastUpdated}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGuidelines.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No guidelines found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        {/* AI Assistant CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Understanding the Guidelines?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Our AI Co-Pilot can answer your questions and guide you through the application process.
          </p>
          <a
            href="/portal"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg font-semibold shadow-lg"
          >
            Start Your Application
          </a>
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
