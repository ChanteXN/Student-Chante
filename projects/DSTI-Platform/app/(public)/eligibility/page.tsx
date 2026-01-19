"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, ArrowRight, BookOpen, FileText, Menu, X } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex justify-between items-center">
            <a href="/" className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition">
              DSTI R&D Platform
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
              <a href="/how-it-works" className="text-gray-600 hover:text-blue-600 transition">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Eligibility Screener</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Answer 7 quick questions to check if your project qualifies for the R&D Tax Incentive (Section 11D).
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <Badge variant="outline">Takes 2-3 minutes</Badge>
                <Badge variant="outline">Instant results</Badge>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {questions.map((q, index) => (
                <Card key={q.id} className="border-2 hover:border-blue-200 transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          {q.required && <Badge variant="destructive">Required</Badge>}
                        </div>
                        <CardTitle className="text-xl">{q.question}</CardTitle>
                        <CardDescription className="text-base mt-2">{q.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button
                        variant={answers[q.id] === "yes" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleAnswer(q.id, "yes")}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Yes
                      </Button>
                      <Button
                        variant={answers[q.id] === "no" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleAnswer(q.id, "no")}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        No
                      </Button>
                      <Button
                        variant={answers[q.id] === "unsure" ? "default" : "outline"}
                        className="flex-1"
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
                className="px-12 py-6 text-lg"
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
              <Button variant="ghost" onClick={() => setCurrentStep("questions")} className="mb-4">
                ← Back to Questions
              </Button>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Results</h1>
              <p className="text-gray-600">Eligibility Assessment Complete</p>
            </div>

            {/* Outcome Card */}
            <Card className={`border-2 ${config.borderColor} ${config.bgColor} mb-8`}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <config.icon className={`w-8 h-8 ${config.color}`} />
                  </div>
                  <div className="text-center sm:text-left">
                    <CardTitle className={`text-2xl sm:text-3xl ${config.color}`}>{config.title}</CardTitle>
                    <CardDescription className="text-base sm:text-lg mt-2">{config.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 border">
                  <p className="text-sm text-gray-600 mb-2">Qualification Score</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          outcome === "eligible"
                            ? "bg-green-500"
                            : outcome === "borderline"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{score}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility Checklist */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Eligibility Checklist</CardTitle>
                <CardDescription>Review the key requirements for the R&D Tax Incentive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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

                    return (
                      <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <Icon className={`w-6 h-6 ${colorClass} flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{q.question}</p>
                          <p className="text-sm text-gray-600 mt-1">{q.description}</p>
                        </div>
                        {q.required && <Badge variant="outline">Required</Badge>}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {outcome === "eligible" && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Review Detailed Guidelines</p>
                        <p className="text-blue-100">
                          Learn more about evidence requirements and application best practices.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Create Your Account</p>
                        <p className="text-blue-100">
                          Set up your secure profile and begin the guided application process.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Complete Project Builder</p>
                        <p className="text-blue-100">
                          Use our AI-assisted wizard to build a strong, compliant application.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <a href="/register" className="flex-1">
                        <Button size="lg" variant="secondary" className="w-full">
                          Start Application
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </a>
                      <a href="/guidelines" className="flex-1">
                        <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Read Guidelines
                        </Button>
                      </a>
                    </div>
                  </>
                )}

                {outcome === "borderline" && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Study the Guidelines Carefully</p>
                        <p className="text-blue-100">
                          Understand what makes a strong R&D project and how to improve your approach.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Strengthen Your Project Documentation</p>
                        <p className="text-blue-100">
                          Focus on clearly defining uncertainty, systematic investigation, and advancement.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Use Our AI Co-Pilot for Guidance</p>
                        <p className="text-blue-100">
                          Get personalized suggestions to improve your application quality.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <a href="/guidelines" className="flex-1">
                        <Button size="lg" variant="secondary" className="w-full">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Read Guidelines
                        </Button>
                      </a>
                      <a href="/register" className="flex-1">
                        <Button size="lg" variant="outline" className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20">
                          Start Application
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </>
                )}

                {outcome === "not-eligible" && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Review Core Requirements</p>
                        <p className="text-blue-100">
                          Make sure your project meets all mandatory criteria (SA registration, uncertainty, etc.).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Explore Guidelines & Examples</p>
                        <p className="text-blue-100">
                          Learn what qualifies as R&D and see examples of successful applications.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-lg">Re-assess After Adjustments</p>
                        <p className="text-blue-100">
                          If you make changes to your project approach, retake this screener.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <a href="/guidelines" className="flex-1">
                        <Button size="lg" variant="secondary" className="w-full">
                          <BookOpen className="w-5 h-5 mr-2" />
                          Read Guidelines
                        </Button>
                      </a>
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex-1 bg-white/10 text-white border-white/30 hover:bg-white/20"
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
                Modern, secure, audit-ready application system for South Africa's R&D Tax Incentive Programme.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/" className="hover:text-white transition">
                    Home
                  </a>
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
