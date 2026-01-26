"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  FileIcon,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

interface EvidenceFile {
  id: string;
  projectId: string;
  category: string;
  fileName: string;
  fileSize: number;
  filePath: string;
  mimeType: string | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  status: string;
}

const EVIDENCE_CATEGORIES = [
  { value: "RD_PLAN", label: "R&D Plan", description: "Project plan and research strategy" },
  { value: "LITERATURE_SEARCH", label: "Literature Search", description: "Patent searches, academic papers, prior art" },
  { value: "TIMESHEETS", label: "Timesheets", description: "Staff time allocation records" },
  { value: "EXPERIMENTS", label: "Experiments", description: "Test results, lab notes, experiment logs" },
  { value: "OUTPUTS", label: "Outputs", description: "Prototypes, publications, patents" },
  { value: "FINANCIAL_RECORDS", label: "Financial Records", description: "Invoices, receipts, cost breakdowns" },
  { value: "OTHER", label: "Other", description: "Supporting documentation" },
];

export default function EvidenceVaultPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    }
  }, [projectId, toast]);

  const fetchEvidenceFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}/evidence`);
      if (!response.ok) throw new Error("Failed to fetch evidence files");
      const data = await response.json();
      setEvidenceFiles(data);
    } catch (error) {
      console.error("Error fetching evidence files:", error);
      toast({
        title: "Error",
        description: "Failed to load evidence files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchEvidenceFiles();
    }
  }, [projectId, fetchProject, fetchEvidenceFiles]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCategory) {
      toast({
        title: "Missing information",
        description: "Please select a file and category",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", selectedCategory);

      const response = await fetch(`/api/projects/${projectId}/evidence`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Reset form
      setSelectedFile(null);
      setSelectedCategory("");
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh list
      fetchEvidenceFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/evidence?fileId=${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete file");

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      fetchEvidenceFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "RD_PLAN":
        return "default";
      case "LITERATURE_SEARCH":
        return "secondary";
      case "TIMESHEETS":
        return "outline";
      case "EXPERIMENTS":
        return "default";
      case "OUTPUTS":
        return "secondary";
      case "FINANCIAL_RECORDS":
        return "outline";
      default:
        return "secondary";
    }
  };

  const groupedFiles = EVIDENCE_CATEGORIES.reduce((acc, category) => {
    acc[category.value] = evidenceFiles.filter((f) => f.category === category.value);
    return acc;
  }, {} as Record<string, EvidenceFile[]>);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/portal/projects/${projectId}/review`)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
          <h1 className="text-3xl font-bold">Evidence Vault</h1>
          {project && (
            <p className="text-muted-foreground mt-1">{project.title}</p>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Evidence
          </CardTitle>
          <CardDescription>
            Upload supporting documents for your R&D project. Maximum file size: 10MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Evidence Category *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EVIDENCE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <div>
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-xs text-muted-foreground">{cat.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File *</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !selectedCategory || uploading}
            className="w-full md:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </CardContent>
      </Card>

      {/* Evidence Files by Category */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Evidence</h2>

        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading evidence files...
            </CardContent>
          </Card>
        ) : evidenceFiles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No evidence files uploaded yet</h3>
              <p className="text-muted-foreground">
                Upload supporting documents to strengthen your application
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {EVIDENCE_CATEGORIES.map((category) => {
              const files = groupedFiles[category.value] || [];
              if (files.length === 0) return null;

              return (
                <Card key={category.value}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{category.label}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                      <Badge variant={getCategoryBadgeVariant(category.value)}>
                        {files.length} {files.length === 1 ? "file" : "files"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <FileIcon className="h-8 w-8 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{file.fileName}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(file.fileSize)} •{" "}
                                {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.filePath, "_blank")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(file.id, file.fileName)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Evidence Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence Checklist</CardTitle>
          <CardDescription>
            Ensure you have uploaded all required evidence for a complete application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {EVIDENCE_CATEGORIES.map((category) => {
              const files = groupedFiles[category.value] || [];
              const hasFiles = files.length > 0;

              return (
                <div
                  key={category.value}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {hasFiles ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{category.label}</p>
                      {hasFiles && (
                        <Badge variant="outline" className="text-xs">
                          {files.length} uploaded
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
