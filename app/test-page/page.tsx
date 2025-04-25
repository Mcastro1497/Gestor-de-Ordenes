import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"

export default function TestPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Test Page" text="This is a test page to verify routing is working correctly." />

      <div className="rounded-md border p-4">
        <h2 className="text-lg font-medium">System Status</h2>
        <p className="mt-2">If you can see this page, basic routing is working correctly.</p>
        <div className="mt-4">
          <p>Next steps to try:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>
              Visit the{" "}
              <a href="/api/test-db" className="text-blue-600 hover:underline">
                API test endpoint
              </a>{" "}
              to verify database connectivity
            </li>
            <li>
              Check the{" "}
              <a href="/dashboard" className="text-blue-600 hover:underline">
                dashboard
              </a>{" "}
              to see if it loads
            </li>
            <li>
              Try the{" "}
              <a href="/orders" className="text-blue-600 hover:underline">
                orders page
              </a>{" "}
              to check if it can retrieve data
            </li>
          </ul>
        </div>
      </div>
    </DashboardShell>
  )
}
