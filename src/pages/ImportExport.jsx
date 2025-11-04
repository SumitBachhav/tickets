import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useSettings } from "../context/SettingsContext";
import {
  exportTasksToCSV,
  downloadCSV,
  parseTasksFromCSV,
} from "../services/csvService";
import { getExternalStatus } from "../utils/statusMapping";
import { isWithinLast24Hours } from "../utils/dateUtils";

export const ImportExport = () => {
  const { tasks, importTasks, exportTasks } = useTasks();
  const { prefixText, statusMapping } = useSettings();
  const [importStatus, setImportStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const handleExport = () => {
    const allTasks = exportTasks();
    if (allTasks.length === 0) {
      setImportStatus("No tasks to export.");
      return;
    }
    const csvContent = exportTasksToCSV(allTasks);
    downloadCSV(csvContent, "tasks-export.csv");
    setImportStatus(`Exported ${allTasks.length} tasks successfully!`);
    setTimeout(() => setImportStatus(""), 3000);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setImportStatus("Error: Please select a CSV file.");
      setTimeout(() => setImportStatus(""), 3000);
      return;
    }

    parseTasksFromCSV(file)
      .then((parsedTasks) => {
        if (parsedTasks.length === 0) {
          setImportStatus("Error: No valid tasks found in CSV file.");
          setTimeout(() => setImportStatus(""), 3000);
          return;
        }

        if (
          window.confirm(
            `This will replace all ${tasks.length} existing tasks with ${parsedTasks.length} tasks from the CSV file. Continue?`
          )
        ) {
          importTasks(parsedTasks);
          setImportStatus(
            `Successfully imported ${parsedTasks.length} tasks!`
          );
          setTimeout(() => setImportStatus(""), 3000);
        }
      })
      .catch((error) => {
        console.error("Import error:", error);
        setImportStatus("Error: Failed to parse CSV file. Please check the format.");
        setTimeout(() => setImportStatus(""), 3000);
      });

    // Reset file input
    e.target.value = "";
  };

  const handleCopyTickets = async () => {
    if (tasks.length === 0) {
      setCopyStatus("No tasks to copy.");
      setTimeout(() => setCopyStatus(""), 3000);
      return;
    }

    try {
      // Filter tasks updated in the last 24 hours
      const recentTasks = tasks.filter((task) =>
        isWithinLast24Hours(task.lastUpdated)
      );

      if (recentTasks.length === 0) {
        setCopyStatus("No tickets updated in the last 24 hours.");
        setTimeout(() => setCopyStatus(""), 3000);
        return;
      }

      // Format: prefixText + ticketNumber + " " + externalStatus
      const ticketDetails = recentTasks
        .map((task) => {
          const ticketNumber = task.ticketNumber || "";
          const externalStatus = getExternalStatus(
            task.statusInternal,
            statusMapping
          );
          const fullTicketId = prefixText + ticketNumber;
          return `${fullTicketId} ${externalStatus}`;
        })
        .join("\n"); // Join with newlines

      await navigator.clipboard.writeText(ticketDetails);
      setCopyStatus(
        `Successfully copied ${recentTasks.length} ticket details (updated in last 24 hours) to clipboard!`
      );
      setTimeout(() => setCopyStatus(""), 3000);
    } catch (error) {
      console.error("Copy error:", error);
      setCopyStatus("Error: Failed to copy to clipboard.");
      setTimeout(() => setCopyStatus(""), 3000);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Import / Export
      </h1>

      <div className="space-y-6">
        {/* Copy Tickets Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Copy Ticket Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Copy ticket details (updated in last 24 hours) to clipboard in the format:{" "}
            <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {prefixText || "[prefix]"}ticketNumber externalStatus
            </code>
            . Each ticket will be on a new line.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyTickets}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Tickets
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Format: {prefixText || "[no prefix]"}ticketNumber status
            </span>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Export Tasks
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Export all your tasks to a CSV file for backup or external use.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Download CSV ({tasks.length} tasks)
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current task count: {tasks.length}
            </span>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Import Tasks
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Import tasks from a CSV file. This will <strong>replace</strong> all
            existing tasks.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-4">
            ⚠️ Warning: Importing will replace all current tasks. Make sure to
            export your current data first as a backup.
          </p>
          <div className="flex items-center gap-4">
            <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
              Choose CSV File
            </label>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              CSV format required
            </span>
          </div>
        </div>

        {/* CSV Format Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            CSV Format Requirements
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
            Your CSV file should include the following columns:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>
              <code>ticketNumber</code> (required)
            </li>
            <li>
              <code>statusInternal</code>
            </li>
            <li>
              <code>statusExternal</code>
            </li>
            <li>
              <code>todo</code>
            </li>
            <li>
              <code>rank</code>
            </li>
            <li>
              <code>notes</code>
            </li>
            <li>
              <code>askedTo</code>
            </li>
            <li>
              <code>lastUpdated</code>
            </li>
            <li>
              <code>tags</code> (comma-separated)
            </li>
          </ul>
        </div>

        {/* Status Messages */}
        {(importStatus || copyStatus) && (
          <div
            className={`p-4 rounded-lg ${
              (importStatus || copyStatus).includes("Error") ||
              (importStatus || copyStatus).includes("No tasks")
                ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
            }`}
          >
            {importStatus || copyStatus}
          </div>
        )}
      </div>
    </div>
  );
};

