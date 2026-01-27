"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Building, FileText, Hash } from "lucide-react";

interface ProjectInfo {
  id: string;
  title: string;
  caseReference: string | null;
  organisation: {
    name: string;
  };
}

export default function RequestInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params);
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        toast({
          title: "Error",
          description: "Project not found",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: resolvedParams.id,
          subject,
          message,
        }),
      });

      if (response.ok) {
        toast({
          title: "Request Sent",
          description: "Information request has been sent to the applicant successfully",
        });
        router.push("/admin/projects" as any);
      } else {
        const data = await response.json();
        toast({
          title: "Failed to Send",
          description: data.error || "An error occurred while sending the request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast({
        title: "Network Error",
        description: "Failed to send request. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Project not found</p>
          <Button variant="outline" onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Request Additional Information
        </h1>
        <p className="text-gray-600 mt-1 text-base">
          Send an information request to the applicant regarding their submission
        </p>
      </div>

      {/* Project Details Card */}
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Project Details
          </CardTitle>
          <CardDescription>Review the project information before sending your request</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Building className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Organisation</p>
                <p className="text-base font-semibold text-gray-900">{project.organisation.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Project Title</p>
                <p className="text-base font-semibold text-gray-900">{project.title}</p>
              </div>
            </div>

            {project.caseReference && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Hash className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Case Reference</p>
                  <p className="text-base font-mono font-semibold text-gray-900">{project.caseReference}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Request Form Card */}
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Compose Information Request</CardTitle>
          <CardDescription>
            Provide clear details about what information or clarification is needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base font-semibold">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                placeholder="e.g., Additional evidence required for methodology section"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="text-base"
              />
              <p className="text-sm text-gray-500">
                A brief summary of what information is being requested
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-semibold">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Describe in detail what additional information, documentation, or clarification is needed from the applicant..."
                rows={10}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="text-base resize-none"
              />
              <p className="text-sm text-gray-500">
                Be specific about what documents or information the applicant needs to provide. 
                Include any deadlines or formatting requirements.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {submitting ? "Sending Request..." : "Send Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
