"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, AlertCircle, ArrowRight, BookOpen, Menu, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Answer = "yes" | "no" | "unsure" | null;

interface Question {
  id: string;
  question: string;
  description: string;
  weight: number;
  required: boolean;
}

type Outcome = "eligible" | "borderline" | "not-eligible";

export default function EligibilityScreenerPage() {
  const [currentStep, setCurrentStep] = useState<"questions" | "results">("questions");
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const questions: Question[] = [
    {
      id: "registered",
      question: "Is your company registered in South Africa?",
      description: "You must be a South African registered entity to qualify for the R&D Tax Incentive.",
      weight: 20,
      required: true,
    },
    {
      id: "uncertainty",
      question: "Does your project address a scientific or technological uncertainty?",
      description: "The uncertainty cannot be readily resolved by a competent professional using existing knowledge.",
      weight: 20,
      required: true,
    },
    {
      id: "systematic",
      question: "Are you following a systematic investigation or experimentation approach?",
      description: "This includes documented R&D plans, hypotheses, testing methodologies, and recorded results.",
      weight: 15,
      required: true,
    },
    {
      id: "advancement",
      question: "Are you seeking to achieve a technological or scientific advancement?",
      description: "Your project should aim to create new knowledge or capabilities, not just apply existing methods.",
      weight: 15,
      required: true,
    },
    {
      id: "location",
      question: "Will the R&D activities be conducted within South Africa?",
      description: "The qualifying R&D work must be performed in South Africa to be eligible.",
      weight: 10,
      required: true,
    },
    {
      id: "expenditure",
      question: "Do you have eligible R&D expenditure (staff costs, materials, equipment)?",
      description: "Qualifying costs include salaries, consumables, and depreciation related to R&D activities.",
      weight: 10,
      required: false,
    },
    {
      id: "documentation",
      question: "Can you maintain detailed records and evidence of your R&D activities?",
      description: "You'll need timesheets, experiment logs, literature reviews, and technical documentation.",
      weight: 10,
      required: false,
    },
  ];

  const handleAnswer = (questionId: string, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const calculateOutcome = (): { outcome: Outcome; score: number; passedRequired: boolean } => {
    let score = 0;
    let passedRequired = true;

    questions.forEach((q) => {
      const answer = answers[q.id];
      
      if (q.required && answer !== "yes") {
        passedRequired = false;
      }

      if (answer === "yes") {
        score += q.weight;
      } else if (answer === "unsure") {
        score += q.weight * 0.5;
      }
    });

    let outcome: Outcome;
    if (!passedRequired) {
      outcome = "not-eligible";
    } else if (score >= 80) {
      outcome = "eligible";
    } else if (score >= 60) {
      outcome = "borderline";
    } else {
      outcome = "not-eligible";
    }

    return { outcome, score, passedRequired };
  };

  const handleSubmit = () => {
    setCurrentStep("results");
  };

  const allQuestionsAnswered = questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== null);

  const { outcome, score } = calculateOutcome();

  const outcomeConfig = {
    eligible: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      title: "Likely Eligible! 🎉",
      description: "Based on your responses, your project appears to meet the core criteria for the R&D Tax Incentive.",
    },
    borderline: {
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      title: "Borderline Case - Further Review Needed",
      description: "Your project shows potential but may need strengthening in certain areas. We recommend consulting the guidelines.",
    },
    "not-eligible": {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      title: "May Not Qualify",
      description: "Based on your responses, your project may not currently meet the eligibility criteria. Review the requirements below.",
    },
  };

  const config = outcomeConfig[outcome];

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
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === "questions" ? (
          <>
            {/* Title Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                <span>Quick Eligibility Check</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Eligibility Screener
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Answer 7 quick questions to check if your project qualifies for the R&D Tax Incentive (Section 11D).
              </p>
              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                <Badge variant="outline" className="px-4 py-1.5">⏱️ Takes 2-3 minutes</Badge>
                <Badge variant="outline" className="px-4 py-1.5">⚡ Instant results</Badge>
                <Badge variant="outline" className="px-4 py-1.5">🎯 Free assessment</Badge>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, index) => (
                <Card key={q.id} className="border-2 hover:border-blue-300 transition-all shadow-md hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                            {index + 1}
                          </div>
                          {q.required && <Badge variant="destructive" className="shadow-sm">Required</Badge>}
                        </div>
                        <CardTitle className="text-xl mb-2">{q.question}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">{q.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button
                        variant={answers[q.id] === "yes" ? "default" : "outline"}
                        className={`flex-1 ${answers[q.id] === "yes" ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}`}
                        onClick={() => handleAnswer(q.id, "yes")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Yes
                      </Button>
                      <Button
                        variant={answers[q.id] === "no" ? "default" : "outline"}
                        className={`flex-1 ${answers[q.id] === "no" ? "bg-red-600 hover:bg-red-700" : ""}`}
                        onClick={() => handleAnswer(q.id, "no")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        No
                      </Button>
                      <Button
                        variant={answers[q.id] === "unsure" ? "default" : "outline"}
                        className={`flex-1 ${answers[q.id] === "unsure" ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                        onClick={() => handleAnswer(q.id, "unsure")}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Unsure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-10 flex justify-center">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all"
              >
                See Results
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {!allQuestionsAnswered && (
              <p className="text-center text-gray-500 mt-4 text-sm">
                Please answer all questions to see your results
              </p>
            )}
          </>
        ) : (
          <>
            {/* Results Section */}
            <div className="text-center mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep("questions")} 
                className="mb-6 hover:bg-blue-50"
              >
                ← Back to Questions
              </Button>
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your Results
                </span>
              </h1>
              <p className="text-xl text-gray-600">Eligibility Assessment Complete</p>
            </div>

            {/* Outcome Card */}
            <Card className={`border-2 ${config.borderColor} ${config.bgColor} mb-8 shadow-xl`}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className={`w-20 h-20 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <config.icon className={`w-10 h-10 ${config.color}`} />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <CardTitle className={`text-2xl sm:text-4xl ${config.color} mb-3`}>{config.title}</CardTitle>
                    <CardDescription className="text-base sm:text-lg leading-relaxed">{config.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-xl p-6 border-2 shadow-inner">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Qualification Score</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                      <div
                        className={`h-full transition-all duration-700 ${
                          outcome === "eligible"
                            ? "bg-gradient-to-r from-green-500 to-green-600"
                            : outcome === "borderline"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{score}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility Checklist */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  Eligibility Checklist
                </CardTitle>
                <CardDescription className="text-base">Review the key requirements for the R&D Tax Incentive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((q) => {
                    const answer = answers[q.id];
                    const Icon =
                      answer === "yes" ? CheckCircle : answer === "no" ? XCircle : AlertCircle;
                    const colorClass =
                      answer === "yes"
                        ? "text-green-600"
                        : answer === "no"
                        ? "text-red-600"
                        : "text-orange-600";
                    const bgClass =
                      answer === "yes"
                        ? "bg-green-50 border-green-200"
                        : answer === "no"
                        ? "bg-red-50 border-red-200"
                        : "bg-orange-50 border-orange-200";

                    return (
                      <div key={q.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 ${bgClass} transition-all`}>
                        <Icon className={`w-6 h-6 ${colorClass} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{q.question}</p>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{q.description}</p>
                        </div>
                        {q.required && <Badge variant="outline" className="shadow-sm">Required</Badge>}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white border-0 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              
              <div className="relative z-10">
                <CardHeader>
                  <CardTitle className="text-3xl text-white">Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {outcome === "eligible" && (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Review Detailed Guidelines</p>
                        <p className="text-blue-100 leading-relaxed">
                          Learn more about evidence requirements and application best practices.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Create Your Account</p>
                        <p className="text-blue-100 leading-relaxed">
                          Set up your secure profile and begin the guided application process.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Complete Project Builder</p>
                        <p className="text-blue-100 leading-relaxed">
                          Use our AI-assisted wizard to build a strong, compliant application.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <a href="/register" className="flex-1">
                        <Button size="lg" variant="secondary" className="w-full text-lg shadow-xl hover:shadow-2xl">
                          Start Application
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </a>
                      <a href="/guidelines" className="flex-1">
                        <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 text-lg">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Read Guidelines
                        </Button>
                      </a>
                    </div>
                  </>
                )}

                {outcome === "borderline" && (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Study the Guidelines Carefully</p>
                        <p className="text-blue-100 leading-relaxed">
                          Understand what makes a strong R&D project and how to improve your approach.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Strengthen Your Project Documentation</p>
                        <p className="text-blue-100 leading-relaxed">
                          Focus on clearly defining uncertainty, systematic investigation, and advancement.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Use Our AI Co-Pilot for Guidance</p>
                        <p className="text-blue-100 leading-relaxed">
                          Get personalized suggestions to improve your application quality.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <a href="/guidelines" className="flex-1">
                        <Button size="lg" variant="secondary" className="w-full text-lg shadow-xl hover:shadow-2xl">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Read Guidelines
                        </Button>
                      </a>
                      <a href="/register" className="flex-1">
                        <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 text-lg">
                          Start Application
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </>
                )}

                {outcome === "not-eligible" && (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Review Core Requirements</p>
                        <p className="text-blue-100 leading-relaxed">
                          Make sure your project meets all mandatory criteria (SA registration, uncertainty, etc.).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Explore Guidelines & Examples</p>
                        <p className="text-blue-100 leading-relaxed">
                          Learn what qualifies as R&D and see examples of successful applications.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-lg">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-xl">Re-assess After Adjustments</p>
                        <p className="text-blue-100 leading-relaxed">
                          If you make changes to your project approach, retake this screener.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <a href="/guidelines" className="flex-1">
                        <Button size="lg" variant="secondary" className="w-full text-lg shadow-xl hover:shadow-2xl">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Read Guidelines
                        </Button>
                      </a>
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 text-lg"
                        onClick={() => {
                          setAnswers({});
                          setCurrentStep("questions");
                        }}
                      >
                        Retake Screener
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DSTI R&D Platform</h3>
              <p className="text-gray-400">
                Modern, secure, audit-ready application system for South Africa&apos;s R&D Tax Incentive Programme.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="/how-it-works" className="hover:text-white transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="/guidelines" className="hover:text-white transition">
                    Guidelines
                  </a>
                </li>
                <li>
                  <a href="/eligibility" className="hover:text-white transition">
                    Check Eligibility
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/login" className="hover:text-white transition">
                    Sign In
                  </a>
                </li>
                <li>
                  <a href="mailto:support@dsti.gov.za" className="hover:text-white transition">
                    Contact Support
                  </a>
                </li>
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
