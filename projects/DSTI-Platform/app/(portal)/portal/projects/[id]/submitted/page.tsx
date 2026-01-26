"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, Clock, FileText, ArrowLeft } from "lucide-react";

interface Project {
  id: string;
  title: string;
  caseReference: string | null;
  submittedAt: string | null;
  status: string;
}

export default function SubmissionConfirmationPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/projects/${params.id}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `DSTI-Application-${project?.caseReference || params.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("An error occurred while downloading the PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (!project || project.status !== "SUBMITTED") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Invalid submission or project not found.</p>
          <Link href="/portal/projects" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Submitted Successfully!
          </h1>
          <p className="text-gray-600">
            Your R&D tax incentive application has been submitted for review
          </p>
        </div>

        {/* Case Reference Card */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-8 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Case Reference Number</p>
            <p className="text-4xl font-bold text-blue-600 tracking-wide">
              {project.caseReference}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Submitted on {new Date(project.submittedAt!).toLocaleString("en-ZA", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Download Application Pack
                </h3>
                <p className="text-sm text-gray-600">
                  {isDownloading ? "Generating PDF..." : "Get a copy of your submitted application"}
                </p>
              </div>
            </div>
          </button>

          {/* View Timeline */}
          <Link
            href={`/portal/projects/${params.id}/timeline` as never}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 text-left block"
          >
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">View Case Timeline</h3>
                <p className="text-sm text-gray-600">
                  Track the status and history of your application
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* What Happens Next */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            What Happens Next?
          </h2>
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>
                Your application will be reviewed by the DSTI technical team within 10 business days
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>
                You may be contacted for additional information or clarifications
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>
                Once approved, you&apos;ll receive your R&D approval certificate and tax benefits confirmation
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>
                You can track all updates on the case timeline page
              </span>
            </li>
          </ol>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 rounded-lg p-4 mb-8 border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Please save your case reference number ({project.caseReference}) 
            for future correspondence. You will receive email updates at the registered email address.
          </p>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <Link
            href="/portal/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Projects Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
