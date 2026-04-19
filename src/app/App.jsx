import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { TasksPage } from "../features/tasks/TasksPage";
import { GrowthPage } from "../features/growth/GrowthPage";
import { LearningPage } from "../features/learning/LearningPage";
import { CoachPage } from "../features/coach/CoachPage";
import { AuthPage } from "../features/auth/AuthPage";
import { AnalyticsPage } from "../features/analytics/AnalyticsPage";
import { SchedulePage } from "../features/schedule/SchedulePage";
import { IntegrationsPage } from "../features/integrations/IntegrationsPage";
import { BackupPage } from "../features/backup/BackupPage";
import { RequireAuth } from "./auth/RequireAuth";

function ProtectedApp() {
  return (
    <AppShell>
      {({ view }) => (
        <Routes>
          <Route path="/" element={<DashboardPage view={view} />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/habits" element={<Navigate to="/growth" replace />} />
          <Route path="/goals" element={<Navigate to="/growth" replace />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/calendar" element={<Navigate to="/schedule" replace />} />
          <Route path="/reminders" element={<Navigate to="/schedule" replace />} />
          <Route path="/weekly-review" element={<Navigate to="/schedule" replace />} />
          <Route path="/planner" element={<Navigate to="/coach" replace />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/coach" element={<CoachPage />} />
        </Routes>
      )}
    </AppShell>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <ProtectedApp />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
