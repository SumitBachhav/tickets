import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ToastProvider } from "./context/ToastContext";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Waiting } from "./pages/Waiting";
import { Resolved } from "./pages/Resolved";
import { AllTasks } from "./pages/AllTasks";
import { AskedTo } from "./pages/AskedTo";
import { ImportExport } from "./pages/ImportExport";
import { Settings } from "./pages/Settings";

function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <TaskProvider>
          <Router basename="/tickets">
            <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
              <Sidebar />
              <main className="flex-1 ml-64 animate-fade-in">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/waiting" element={<Waiting />} />
                  <Route path="/resolved" element={<Resolved />} />
                  <Route path="/all" element={<AllTasks />} />
                  <Route path="/asked-to" element={<AskedTo />} />
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
