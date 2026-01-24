"use client";

import { useState, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isComplete?: boolean;
}

interface ProjectWizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  children: ReactNode;
  title?: string;
  description?: string;
  projectId?: string | null;
  onReview?: () => void;
}

export function ProjectWizard({
  steps,
  currentStep,
  onStepChange,
  onSave,
  isSaving = false,
  children,
  title = "Project Builder",
  description = "Complete each step to build your R&D tax incentive application",
  projectId = null,
  onReview,
}: ProjectWizardProps) {
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleReview = () => {
    if (onReview) {
      onReview();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      setAutoSaveStatus("saving");
      try {
        await onSave();
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } catch {
        setAutoSaveStatus("idle");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepChange(index)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              index === currentStep
                ? "bg-primary text-primary-foreground"
                : step.isComplete
                ? "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {step.isComplete ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/20 text-xs">
                {index + 1}
              </span>
            )}
            <span>{step.title}</span>
          </button>
        ))}
      </div>

      {/* Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep]?.title}</CardTitle>
          {steps[currentStep]?.description && (
            <CardDescription>{steps[currentStep].description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {children}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {autoSaveStatus !== "idle" && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  {autoSaveStatus === "saving" ? (
                    <>
                      <Save className="h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      Saved
                    </>
                  )}
                </span>
              )}
              
              <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-1" />
                Save Progress
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleReview}>
                  Review Application
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
