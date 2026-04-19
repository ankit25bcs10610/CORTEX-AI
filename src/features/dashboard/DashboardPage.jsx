import { Dashboard } from "../../components/dashboard/Dashboard";

export function DashboardPage({ view = "daily" }) {
  return <Dashboard view={view} />;
}
