import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ToastProvider } from "./context/ToastContext";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Waiting } from "./pages/Waiting";
import { Resolved } from "./pages/Resolved";
import { AllTasks } from "./pages/AllTasks";
import { ImportExport } from "./pages/ImportExport";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <TaskProvider>
          <Router>
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar />
              <main className="flex-1 ml-64">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/waiting" element={<Waiting />} />
                  <Route path="/resolved" element={<Resolved />} />
                  <Route path="/all" element={<AllTasks />} />
                  <Route path="/import-export" element={<ImportExport />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </Router>
        </TaskProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}

export default App;
