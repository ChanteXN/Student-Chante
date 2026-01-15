import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function PortalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Applicant Portal</h1>
          <p className="text-gray-600 mt-2">
            Welcome, {session.user.email} ({session.user.role})
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Active Applications</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Draft Projects</h3>
          <p className="text-3xl font-bold text-gray-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Pending Requests</h3>
          <p className="text-3xl font-bold text-orange-600">0</p>
        </div>
      </div>

      <div className="mt-8 bg-green-50 border border-green-200 rounded p-4">
        <h2 className="text-lg font-semibold text-green-900 mb-2">
           Day 3 Authentication Complete!
        </h2>
        <ul className="text-sm text-green-800 space-y-1">
          <li>✓ NextAuth.js configured with magic link authentication</li>
          <li>✓ Email provider with Ethereal Email</li>
          <li>✓ SQLite database with Prisma</li>
          <li>✓ JWT sessions for Edge Runtime compatibility</li>
          <li>✓ Role-based access control (RBAC) middleware</li>
          <li>✓ Protected routes working</li>
        </ul>
      </div>
    </div>
  );
}
