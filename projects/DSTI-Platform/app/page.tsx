export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          DSTI R&D Tax Incentive Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Modern, Secure, Audit-Ready Application System
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/eligibility"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Check Eligibility
          </a>
          <a
            href="/portal"
            className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Start Application
          </a>
        </div>
      </div>
    </div>
  );
}
