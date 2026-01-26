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
  {
    id: "methodology",
    title: "Methodology & Innovation",
    description: "Explain your research approach and innovation",
  },
  {
    id: "team",
    title: "Team & Expertise",
    description: "Describe your R&D team and their qualifications",
  },
  {
    id: "expenditure",
    title: "Budget & Expenditure",
    description: "Provide details about your R&D costs",
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

interface MethodologyData {
  researchApproach: string;
  innovationDescription: string;
  challengesOvercome: string;
  experimentsPlanned: string;
}

interface TeamData {
  teamSize: string;
  keyPersonnel: string;
  qualifications: string;
  rolesResponsibilities: string;
}

interface ExpenditureData {
  totalBudget: string;
  rdCostsBreakdown: string;
  expenditureTimeline: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlProjectId = searchParams.get('id');
  const urlStep = searchParams.get('step');
  
  // Priority: URL parameter > Session storage
  // If URL has ID, use it. Otherwise check session storage. If neither, create new.
  const storedProjectId = typeof window !== 'undefined' ? sessionStorage.getItem('currentProjectId') : null;
  const initialProjectId = urlProjectId || storedProjectId;
  
  // Clear session storage ONLY if explicitly going to /new without any ID
  if (typeof window !== 'undefined' && !urlProjectId && !storedProjectId) {
    sessionStorage.removeItem('currentProjectId');
  }
  
  const { data: session } = useSession();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(urlStep ? parseInt(urlStep) : 0);
  const [projectId, setProjectId] = useState<string | null>(initialProjectId);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Track last saved data to prevent unnecessary saves
  const lastSavedData = useRef<{
    basics: ProjectBasicsData;
    uncertainty: UncertaintyData;
    methodology: MethodologyData;
    team: TeamData;
    expenditure: ExpenditureData;
  }>({
    basics: { title: "", sector: "", startDate: "", endDate: "", location: "" },
    uncertainty: { uncertainty: "", objectives: "" },
    methodology: { researchApproach: "", innovationDescription: "", challengesOvercome: "", experimentsPlanned: "" },
    team: { teamSize: "", keyPersonnel: "", qualifications: "", rolesResponsibilities: "" },
    expenditure: { totalBudget: "", rdCostsBreakdown: "", expenditureTimeline: "" },
  });

  // Track if user has made changes
  const hasUnsavedChanges = useRef(false);
  
  // Track if project initialization has been attempted to prevent duplicates
  const initializationAttempted = useRef(false);

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

  const [methodologyData, setMethodologyData] = useState<MethodologyData>({
    researchApproach: "",
    innovationDescription: "",
    challengesOvercome: "",
    experimentsPlanned: "",
  });

  const [teamData, setTeamData] = useState<TeamData>({
    teamSize: "",
    keyPersonnel: "",
    qualifications: "",
    rolesResponsibilities: "",
  });

  const [expenditureData, setExpenditureData] = useState<ExpenditureData>({
    totalBudget: "",
    rdCostsBreakdown: "",
    expenditureTimeline: "",
  });

  // Create or load project on mount
  useEffect(() => {
    const initializeProject = async () => {
      if (!session?.user?.email) return;
      
      // Prevent duplicate initialization
      if (initializationAttempted.current) {
        console.log("Initialization already attempted, skipping");
        return;
      }
      initializationAttempted.current = true;

      setIsLoading(true);
      try {
        // If we have a project ID in URL or session storage, load that project
        if (initialProjectId) {
          console.log("Loading existing project:", initialProjectId);
          const response = await fetch(`/api/projects/${initialProjectId}`);
          
          // If project doesn't exist, clear storage and create new one
          if (!response.ok) {
            console.warn(`Project ${initialProjectId} not found, creating new project`);
            sessionStorage.removeItem('currentProjectId');
            window.history.replaceState({}, '', '/portal/projects/new');
            // Create new project instead
            const newResponse = await fetch("/api/projects", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: "Untitled Project",
              }),
            });
            if (!newResponse.ok) throw new Error("Failed to create project");
            const newProject = await newResponse.json();
            setProjectId(newProject.id);
            sessionStorage.setItem('currentProjectId', newProject.id);
            
            // Update URL to include project ID
            window.history.replaceState({}, '', `/portal/projects/new?id=${newProject.id}`);
            
            setIsLoading(false);
            toast({
              title: "Project created",
              description: "Your new project is ready to be filled out.",
            });
            return;
          }

          const project = await response.json();
          setProjectId(project.id);
          sessionStorage.setItem('currentProjectId', project.id);
          
          console.log("Loading project:", project.id);
          console.log("Project sections:", project.sections);
          
          // Load existing data into form - merge with project-level fields first
          const loadedBasicsData = {
            title: project.title || "",
            sector: project.sector || "",
            startDate: project.startDate || "",
            endDate: project.endDate || "",
            location: project.location || "",
          };
          
          // Load section data and merge with project-level data
          project.sections?.forEach((section: { sectionKey: string; sectionData: unknown }) => {
            console.log(`Loading section: ${section.sectionKey}`, section.sectionData);
            
            // Parse sectionData if it's a string (JSON)
            const data = typeof section.sectionData === 'string' 
              ? JSON.parse(section.sectionData) 
              : section.sectionData;
            
            if (section.sectionKey === 'basics') {
              Object.assign(loadedBasicsData, data);
              lastSavedData.current.basics = { ...loadedBasicsData, ...data } as ProjectBasicsData;
            } else if (section.sectionKey === 'uncertainty') {
              setUncertaintyData(data as UncertaintyData);
              lastSavedData.current.uncertainty = data as UncertaintyData;
            } else if (section.sectionKey === 'methodology') {
              setMethodologyData(data as MethodologyData);
              lastSavedData.current.methodology = data as MethodologyData;
            } else if (section.sectionKey === 'team') {
              setTeamData(data as TeamData);
              lastSavedData.current.team = data as TeamData;
            } else if (section.sectionKey === 'expenditure') {
              setExpenditureData(data as ExpenditureData);
              lastSavedData.current.expenditure = data as ExpenditureData;
            }
          });
          
          // Set basics data after all sections are loaded
          setBasicsData(loadedBasicsData);
          console.log("Loaded basics data:", loadedBasicsData);

          toast({
            title: "Project loaded",
            description: "Your existing project has been loaded.",
          });
        } else {
          // Create new project only if no ID in URL
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
          sessionStorage.setItem('currentProjectId', project.id);
          
          // Update URL to include project ID so it persists on page refresh
          window.history.replaceState({}, '', `/portal/projects/new?id=${project.id}`);
          
          toast({
            title: "Project created",
            description: "Your new application has been created.",
          });
        }
      } catch (error) {
        console.error("Project initialization error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to initialize project. Please ensure you have an organisation set up.",
          variant: "destructive",
        });
        router.push("/portal");
      } finally {
        setIsLoading(false);
      }
    };

    initializeProject();
  }, [session, router, toast, initialProjectId]);
  
  // Clear session storage when navigating away from wizard
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Keep session storage if still on the wizard page
      if (!window.location.pathname.includes('/portal/projects/new')) {
        sessionStorage.removeItem('currentProjectId');
      }
    };
    
    return () => {
      handleBeforeUnload();
    };
  }, []);

  // Auto-save function - saves ALL sections with changes
  const saveProgress = useCallback(async () => {
    if (!projectId || !hasUnsavedChanges.current) return;

    setIsSaving(true);
    try {
      const sectionsToSave = [];
      
      // Build project-level updates from basics data
      const projectUpdates: Record<string, string> = {};
      if (basicsData.title) projectUpdates.title = basicsData.title;
      if (basicsData.sector) projectUpdates.sector = basicsData.sector;
      if (basicsData.startDate) projectUpdates.startDate = new Date(basicsData.startDate).toISOString();
      if (basicsData.endDate) projectUpdates.endDate = new Date(basicsData.endDate).toISOString();
      if (basicsData.location) projectUpdates.location = basicsData.location;
      
      console.log("Saving basics data:", basicsData);
      console.log("Project updates to save:", projectUpdates);

      // Check basics data
      if (basicsData.title || basicsData.sector || basicsData.startDate || 
          basicsData.endDate || basicsData.location) {
        const dataChanged = JSON.stringify(basicsData) !== JSON.stringify(lastSavedData.current.basics);
        if (dataChanged) {
          sectionsToSave.push({
            sectionKey: "basics",
            sectionData: basicsData,
          });
          lastSavedData.current.basics = { ...basicsData };
        }
      }

      // Check uncertainty data
      if (uncertaintyData.uncertainty || uncertaintyData.objectives) {
        const dataChanged = JSON.stringify(uncertaintyData) !== JSON.stringify(lastSavedData.current.uncertainty);
        if (dataChanged) {
          sectionsToSave.push({
            sectionKey: "uncertainty",
            sectionData: uncertaintyData,
          });
          lastSavedData.current.uncertainty = { ...uncertaintyData };
        }
      }

      // Check methodology data
      if (methodologyData.researchApproach || methodologyData.innovationDescription || 
          methodologyData.challengesOvercome || methodologyData.experimentsPlanned) {
        const dataChanged = JSON.stringify(methodologyData) !== JSON.stringify(lastSavedData.current.methodology);
        if (dataChanged) {
          sectionsToSave.push({
            sectionKey: "methodology",
            sectionData: methodologyData,
          });
          lastSavedData.current.methodology = { ...methodologyData };
        }
      }

      // Check team data
      if (teamData.teamSize || teamData.keyPersonnel || 
          teamData.qualifications || teamData.rolesResponsibilities) {
        const dataChanged = JSON.stringify(teamData) !== JSON.stringify(lastSavedData.current.team);
        if (dataChanged) {
          sectionsToSave.push({
            sectionKey: "team",
            sectionData: teamData,
          });
          lastSavedData.current.team = { ...teamData };
        }
      }

      // Check expenditure data
      if (expenditureData.totalBudget || expenditureData.rdCostsBreakdown || 
          expenditureData.expenditureTimeline) {
        const dataChanged = JSON.stringify(expenditureData) !== JSON.stringify(lastSavedData.current.expenditure);
        if (dataChanged) {
          sectionsToSave.push({
            sectionKey: "expenditure",
            sectionData: expenditureData,
          });
          lastSavedData.current.expenditure = { ...expenditureData };
        }
      }

      // If no sections changed, don't save
      if (sectionsToSave.length === 0 && Object.keys(projectUpdates).length === 0) {
        setIsSaving(false);
        return;
      }

      // First, update project-level fields if there are any
      if (Object.keys(projectUpdates).length > 0) {
        console.log("Sending project update request:", projectUpdates);
        const projectResponse = await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectUpdates),
        });
        if (!projectResponse.ok) {
          const error = await projectResponse.text();
          console.error("Failed to save project fields:", error);
          throw new Error("Failed to save project fields");
        }
        console.log("Project fields saved successfully");
      }

      // Then save all changed sections
      for (const section of sectionsToSave) {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionKey: section.sectionKey,
            sectionData: section.sectionData,
          }),
        });

        if (!response.ok) throw new Error("Failed to save section");
      }

      hasUnsavedChanges.current = false;
      toast({
        title: "Saved",
        description: `${sectionsToSave.length} section(s) saved successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [projectId, basicsData, uncertaintyData, methodologyData, teamData, expenditureData, toast]);

  // Auto-save on data change (debounced)
  useEffect(() => {
    if (!projectId) return;

    // Mark that changes have been made
    hasUnsavedChanges.current = true;

    const timer = setTimeout(() => {
      saveProgress();
    }, 5000); // Save after 5 seconds of inactivity (reduced from 30)

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    basicsData.title, basicsData.sector, basicsData.startDate, basicsData.endDate, basicsData.location, 
    uncertaintyData.uncertainty, uncertaintyData.objectives,
    methodologyData.researchApproach, methodologyData.innovationDescription, methodologyData.challengesOvercome, methodologyData.experimentsPlanned,
    teamData.teamSize, teamData.keyPersonnel, teamData.qualifications, teamData.rolesResponsibilities,
    expenditureData.totalBudget, expenditureData.rdCostsBreakdown, expenditureData.expenditureTimeline,
    projectId
  ]);
  
  // Handle step changes - save before changing
  const handleStepChange = async (newStep: number) => {
    // Save current progress before changing steps
    if (hasUnsavedChanges.current) {
      await saveProgress();
    }
    setCurrentStep(newStep);
  };

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

  const handleReview = () => {
    if (projectId) {
      router.push(`/portal/projects/${projectId}/review` as never);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ProjectWizard
        steps={WIZARD_STEPS}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        onSave={saveProgress}
        isSaving={isSaving}
        projectId={projectId}
        onReview={handleReview}
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

        {/* Step 3: Methodology & Innovation */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="researchApproach">Research Approach *</Label>
              <p className="text-sm text-muted-foreground">
                Describe the systematic approach you took to resolve the technical uncertainty.
              </p>
              <Textarea
                id="researchApproach"
                placeholder="e.g., We employed an iterative machine learning development approach with controlled experiments..."
                rows={6}
                value={methodologyData.researchApproach}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMethodologyData({
                    ...methodologyData,
                    researchApproach: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="innovationDescription">Innovation Description *</Label>
              <p className="text-sm text-muted-foreground">
                What makes your approach novel or innovative? How does it differ from existing solutions?
              </p>
              <Textarea
                id="innovationDescription"
                placeholder="e.g., Our innovation lies in the development of a hybrid neural network architecture that combines..."
                rows={6}
                value={methodologyData.innovationDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMethodologyData({
                    ...methodologyData,
                    innovationDescription: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challengesOvercome">Challenges Overcome *</Label>
              <p className="text-sm text-muted-foreground">
                What specific technical challenges did you encounter and how did you resolve them?
              </p>
              <Textarea
                id="challengesOvercome"
                placeholder="e.g., Challenge 1: Data quality issues - Resolved by implementing advanced data cleaning algorithms&#10;Challenge 2: Model overfitting - Resolved by developing custom regularization techniques"
                rows={6}
                value={methodologyData.challengesOvercome}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMethodologyData({
                    ...methodologyData,
                    challengesOvercome: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experimentsPlanned">Experiments Planned/Conducted *</Label>
              <p className="text-sm text-muted-foreground">
                Describe the experiments or trials you conducted to test your hypotheses.
              </p>
              <Textarea
                id="experimentsPlanned"
                placeholder="e.g., 1. Baseline model testing with existing algorithms&#10;2. Temperature sensitivity experiments (0-100°C range)&#10;3. A/B testing of different model architectures&#10;4. Real-world deployment pilot study"
                rows={6}
                value={methodologyData.experimentsPlanned}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMethodologyData({
                    ...methodologyData,
                    experimentsPlanned: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Step 4: Team & Expertise */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size *</Label>
              <p className="text-sm text-muted-foreground">
                How many people were directly involved in the R&D activities?
              </p>
              <Input
                id="teamSize"
                placeholder="e.g., 5 core team members, 2 part-time consultants"
                value={teamData.teamSize}
                onChange={(e) =>
                  setTeamData({ ...teamData, teamSize: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPersonnel">Key Personnel *</Label>
              <p className="text-sm text-muted-foreground">
                List the key R&D team members and their roles (names optional for MVP).
              </p>
              <Textarea
                id="keyPersonnel"
                placeholder="e.g., Lead Data Scientist - 10 years experience in ML&#10;Senior Software Engineer - AI systems specialist&#10;Research Engineer - PhD in Computer Science&#10;Project Manager - R&D coordination"
                rows={6}
                value={teamData.keyPersonnel}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTeamData({
                    ...teamData,
                    keyPersonnel: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Relevant Qualifications *</Label>
              <p className="text-sm text-muted-foreground">
                Describe the technical qualifications and expertise that enabled this R&D work.
              </p>
              <Textarea
                id="qualifications"
                placeholder="e.g., Team qualifications include:&#10;- 3 team members with advanced degrees (MSc/PhD) in AI/ML&#10;- Combined 40+ years of industry experience&#10;- Publications in peer-reviewed journals&#10;- Previous successful R&D projects in predictive analytics"
                rows={6}
                value={teamData.qualifications}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTeamData({
                    ...teamData,
                    qualifications: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rolesResponsibilities">Roles & Responsibilities *</Label>
              <p className="text-sm text-muted-foreground">
                Define how R&D responsibilities were distributed across the team.
              </p>
              <Textarea
                id="rolesResponsibilities"
                placeholder="e.g., Data Scientists: Model development and testing&#10;Engineers: System integration and deployment&#10;Research Lead: Hypothesis formulation and validation&#10;Project Manager: Coordination and documentation"
                rows={6}
                value={teamData.rolesResponsibilities}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTeamData({
                    ...teamData,
                    rolesResponsibilities: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Step 5: Budget & Expenditure */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total R&D Budget *</Label>
              <p className="text-sm text-muted-foreground">
                What is the total budget allocated for this R&D project? (ZAR)
              </p>
              <Input
                id="totalBudget"
                placeholder="e.g., R 2,500,000"
                value={expenditureData.totalBudget}
                onChange={(e) =>
                  setExpenditureData({ ...expenditureData, totalBudget: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rdCostsBreakdown">R&D Costs Breakdown *</Label>
              <p className="text-sm text-muted-foreground">
                Provide a breakdown of major cost categories (personnel, equipment, materials, etc.).
              </p>
              <Textarea
                id="rdCostsBreakdown"
                placeholder="e.g., Personnel Costs: R 1,500,000 (60%)&#10;Equipment & Software: R 500,000 (20%)&#10;Cloud Computing & Infrastructure: R 300,000 (12%)&#10;Materials & Supplies: R 150,000 (6%)&#10;Other R&D Costs: R 50,000 (2%)"
                rows={8}
                value={expenditureData.rdCostsBreakdown}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setExpenditureData({
                    ...expenditureData,
                    rdCostsBreakdown: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenditureTimeline">Expenditure Timeline *</Label>
              <p className="text-sm text-muted-foreground">
                Describe when costs will be incurred over the project period.
              </p>
              <Textarea
                id="expenditureTimeline"
                placeholder="e.g., Q1 2026: R 800,000 (initial setup, personnel onboarding)&#10;Q2 2026: R 600,000 (development phase, equipment procurement)&#10;Q3 2026: R 700,000 (testing, experimentation)&#10;Q4 2026: R 400,000 (refinement, documentation)"
                rows={6}
                value={expenditureData.expenditureTimeline}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setExpenditureData({
                    ...expenditureData,
                    expenditureTimeline: e.target.value,
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
