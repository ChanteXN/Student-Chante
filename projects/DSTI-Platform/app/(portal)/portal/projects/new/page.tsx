"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectWizard, WizardStep } from "@/components/project-wizard";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const WIZARD_STEPS: WizardStep[] = [
  {
    id: "basics",
    title: "Project Basics",
    description: "Tell us about your R&D project",
  },
  {
    id: "uncertainty",
    title: "R&D Uncertainty",
    description: "Describe the technical or scientific challenges",
  },
];

interface ProjectBasicsData {
  title: string;
  sector: string;
  startDate: string;
  endDate: string;
  location: string;
}

interface UncertaintyData {
  uncertainty: string;
  objectives: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Track last saved data to prevent unnecessary saves
  const lastSavedData = useRef<{
    basics: ProjectBasicsData;
    uncertainty: UncertaintyData;
  }>({
    basics: { title: "", sector: "", startDate: "", endDate: "", location: "" },
    uncertainty: { uncertainty: "", objectives: "" },
  });

  // Track if user has made changes
  const hasUnsavedChanges = useRef(false);

  // Form data
  const [basicsData, setBasicsData] = useState<ProjectBasicsData>({
    title: "",
    sector: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  const [uncertaintyData, setUncertaintyData] = useState<UncertaintyData>({
    uncertainty: "",
    objectives: "",
  });

  // Create project on mount
  useEffect(() => {
    const createProject = async () => {
      if (!session?.user?.email) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Untitled Project",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create project");
        }

        const project = await response.json();
        setProjectId(project.id);
      } catch (error) {
        console.error("Project creation error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create project. Please ensure you have an organisation set up.",
          variant: "destructive",
        });
        router.push("/portal");
      } finally {
        setIsLoading(false);
      }
    };

    createProject();
  }, [session, router, toast]);

  // Auto-save function
  const saveProgress = useCallback(async () => {
    if (!projectId || !hasUnsavedChanges.current) return;

    setIsSaving(true);
    try {
      let sectionData = {};
      let sectionKey = "";
      let projectUpdates = {};

      if (currentStep === 0) {
        // Only save if there's actual data
        if (!basicsData.title && !basicsData.sector && !basicsData.startDate && 
            !basicsData.endDate && !basicsData.location) {
          setIsSaving(false);
          return;
        }

        // Check if data actually changed
        const dataChanged = JSON.stringify(basicsData) !== JSON.stringify(lastSavedData.current.basics);
        if (!dataChanged) {
          setIsSaving(false);
          return;
        }

        sectionKey = "basics";
        sectionData = basicsData;
        projectUpdates = {
          ...(basicsData.title && { title: basicsData.title }),
          ...(basicsData.sector && { sector: basicsData.sector }),
          ...(basicsData.startDate && { startDate: basicsData.startDate }),
          ...(basicsData.endDate && { endDate: basicsData.endDate }),
          ...(basicsData.location && { location: basicsData.location }),
        };

        lastSavedData.current.basics = { ...basicsData };
      } else if (currentStep === 1) {
        // Only save if there's actual data
        if (!uncertaintyData.uncertainty && !uncertaintyData.objectives) {
          setIsSaving(false);
          return;
        }

        // Check if data actually changed
        const dataChanged = JSON.stringify(uncertaintyData) !== JSON.stringify(lastSavedData.current.uncertainty);
        if (!dataChanged) {
          setIsSaving(false);
          return;
        }

        sectionKey = "uncertainty";
        sectionData = uncertaintyData;

        lastSavedData.current.uncertainty = { ...uncertaintyData };
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectUpdates,
          sectionKey,
          sectionData,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      hasUnsavedChanges.current = false;
      toast({
        title: "Saved",
        description: "Your progress has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [projectId, currentStep, basicsData, uncertaintyData, toast]);

  // Auto-save on data change (debounced)
  useEffect(() => {
    if (!projectId) return;

    // Mark that changes have been made
    hasUnsavedChanges.current = true;

    const timer = setTimeout(() => {
      saveProgress();
    }, 30000); // Save after 30 seconds of inactivity

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicsData.title, basicsData.sector, basicsData.startDate, basicsData.endDate, basicsData.location, 
      uncertaintyData.uncertainty, uncertaintyData.objectives, projectId]);

  if (isLoading || !projectId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Setting up your project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ProjectWizard
        steps={WIZARD_STEPS}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSave={saveProgress}
        isSaving={isSaving}
      >
        {/* Step 1: Project Basics */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="e.g., AI-Powered Predictive Maintenance System"
                value={basicsData.title}
                onChange={(e) =>
                  setBasicsData({ ...basicsData, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Industry Sector *</Label>
              <Select
                value={basicsData.sector}
                onValueChange={(value: string) =>
                  setBasicsData({ ...basicsData, sector: value })
                }
              >
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Select a sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="software">Software & IT</SelectItem>
                  <SelectItem value="biotechnology">Biotechnology</SelectItem>
                  <SelectItem value="energy">Energy & Environment</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={basicsData.startDate}
                  onChange={(e) =>
                    setBasicsData({ ...basicsData, startDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={basicsData.endDate}
                  onChange={(e) =>
                    setBasicsData({ ...basicsData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Primary Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Cape Town, South Africa"
                value={basicsData.location}
                onChange={(e) =>
                  setBasicsData({ ...basicsData, location: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Step 2: R&D Uncertainty */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="uncertainty">
                Technical or Scientific Uncertainty *
              </Label>
              <p className="text-sm text-muted-foreground">
                Describe the core technical challenge that couldn&apos;t be solved
                using existing knowledge or standard practice.
              </p>
              <Textarea
                id="uncertainty"
                placeholder="e.g., Existing predictive maintenance algorithms cannot accurately predict equipment failures in environments with high temperature variability..."
                rows={6}
                value={uncertaintyData.uncertainty}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setUncertaintyData({
                    ...uncertaintyData,
                    uncertainty: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">R&D Objectives *</Label>
              <p className="text-sm text-muted-foreground">
                What were you trying to achieve through your R&D work?
              </p>
              <Textarea
                id="objectives"
                placeholder="e.g., 1. Develop a novel machine learning model that adapts to temperature variability&#10;2. Achieve 90% prediction accuracy in high-temp environments&#10;3. Reduce false positives by 50%"
                rows={6}
                value={uncertaintyData.objectives}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setUncertaintyData({
                    ...uncertaintyData,
                    objectives: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </ProjectWizard>
    </div>
  );
}
