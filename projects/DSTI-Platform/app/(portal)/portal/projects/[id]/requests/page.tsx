"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, CheckCircle2, ArrowLeft } from "lucide-react";

interface InfoRequest {
  id: string;
  subject: string;
  message: string;
  status: "PENDING" | "RESPONDED" | "RESOLVED";
  response: string | null;
  createdAt: string;
  respondedAt: string | null;
}

interface Project {
  id: string;
  title: string;
  caseReference: string | null;
}

export default function RequestInboxPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [requests, setRequests] = useState<InfoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<InfoRequest | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectRes, requestsRes] = await Promise.all([
        fetch(`/api/projects/${resolvedParams.id}`),
        fetch(`/api/requests/list?projectId=${resolvedParams.id}`),
      ]);

      if (projectRes.ok) {
        const projectData = await projectRes.json();
        setProject(projectData.project);
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRequests(requestsData.requests || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRequest || !responseText.trim()) {
      toast({
        title: "Error",
        description: "Please provide a response",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/requests/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          response: responseText,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Response submitted successfully",
        });
        setSelectedRequest(null);
        setResponseText("");
        fetchData();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to submit response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const completedRequests = requests.filter((r) => r.status !== "PENDING");

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
        <h1 className="text-3xl font-bold mb-2">Information Requests</h1>
        {project && (
          <p className="text-muted-foreground">
            {project.title} {project.caseReference && `(${project.caseReference})`}
          </p>
        )}
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Pending Requests ({pendingRequests.length})
          </h2>
          {pendingRequests.map((request) => (
            <Card key={request.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{request.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Request:</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{request.message}</p>
                </div>

                {selectedRequest?.id === request.id ? (
                  <form onSubmit={handleRespond} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="response">Your Response *</Label>
                      <Textarea
                        id="response"
                        placeholder="Provide the requested information..."
                        rows={6}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(null);
                          setResponseText("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Submit Response"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    onClick={() => setSelectedRequest(request)}
                    className="w-full sm:w-auto"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Respond to Request
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Completed Requests ({completedRequests.length})
          </h2>
          {completedRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{request.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                      {request.respondedAt &&
                        ` • Responded ${new Date(request.respondedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Responded
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Request:</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{request.message}</p>
                </div>
                {request.response && (
                  <div>
                    <Label className="text-sm font-semibold">Your Response:</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                      {request.response}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {requests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No information requests yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
