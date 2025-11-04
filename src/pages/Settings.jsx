import { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { EnumEditor } from "../components/EnumEditor";
import { StatusMappingEditor } from "../components/StatusMappingEditor";
import {
  exportSettingsToCSV,
  downloadCSV,
  parseSettingsCSV,
} from "../utils/csvUtils";

export const Settings = () => {
  const {
    enums,
    updateEnum,
    resetDefaults,
    darkMode,
    toggleDarkMode,
    prefixText,
    updatePrefixText,
    statusMapping,
    updateStatusMapping,
    settingsError,
  } = useSettings();
  const [importStatus, setImportStatus] = useState("");

  const handleEnumUpdate = (type) => (values) => {
    updateEnum(type, values);
  };

  const handleExportSettings = () => {
    try {
      const settings = {
        darkMode,
        prefixText,
        enums,
        statusMapping,
      };
      const csvContent = exportSettingsToCSV(settings);
      downloadCSV(csvContent, "settings.csv");
      setImportStatus("Settings exported successfully! Replace src/data/settings.csv with the downloaded file to use it on next load.");
      setTimeout(() => setImportStatus(""), 5000);
    } catch (error) {
      console.error("Export error:", error);
      setImportStatus("Error: Failed to export settings.");
      setTimeout(() => setImportStatus(""), 3000);
    }
  };

  const handleImportSettings = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setImportStatus("Error: Please select a CSV file.");
      setTimeout(() => setImportStatus(""), 3000);
      return;
    }

    parseSettingsCSV(file)
      .then((parsedSettings) => {
        if (
          window.confirm(
            "This will replace all your current settings. Continue?"
          )
        ) {
          // Update all settings
          if (parsedSettings.darkMode !== undefined && parsedSettings.darkMode !== darkMode) {
            toggleDarkMode(); // Toggle to match imported value
          }
          if (parsedSettings.prefixText !== undefined) {
            updatePrefixText(parsedSettings.prefixText);
          }
          if (parsedSettings.enums) {
            Object.keys(parsedSettings.enums).forEach((key) => {
              updateEnum(key, parsedSettings.enums[key]);
            });
          }
          if (parsedSettings.statusMapping) {
            updateStatusMapping(parsedSettings.statusMapping);
          }
          setImportStatus("Settings imported successfully!");
          setTimeout(() => setImportStatus(""), 3000);
        }
      })
      .catch((error) => {
        console.error("Import error:", error);
        setImportStatus(
          "Error: Failed to parse settings CSV file. Please check the format."
        );
        setTimeout(() => setImportStatus(""), 3000);
      });

    // Reset file input
    e.target.value = "";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>

      {settingsError && (
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Settings CSV Not Found
          </h2>
          <p className="text-yellow-800 dark:text-yellow-200">{settingsError}</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
            Using settings from localStorage. To load from file, ensure src/data/settings.csv exists and is properly formatted.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Dark Mode Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Dark Mode
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Enum Customization Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Customize Enums
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Customize the dropdown options for task fields. You can add, edit,
            or remove options for each field type.
          </p>

          <div className="space-y-6">
            <EnumEditor
              label="Status (Internal)"
              values={enums.statusInternal || []}
              onUpdate={handleEnumUpdate("statusInternal")}
            />
            <EnumEditor
              label="Todo"
              values={enums.todo || []}
              onUpdate={handleEnumUpdate("todo")}
            />
                <EnumEditor
                  label="Rank"
                  values={enums.rank || []}
                  onUpdate={handleEnumUpdate("rank")}
                />
                <EnumEditor
                  label="Asked To"
                  values={enums.askedTo || []}
                  onUpdate={handleEnumUpdate("askedTo")}
                />
                <EnumEditor
                  label="Tags"
                  values={enums.tags || []}
                  onUpdate={handleEnumUpdate("tags")}
                />
              </div>
            </div>

        {/* Status Mapping Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Status Mapping Configuration
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Configure how internal statuses automatically map to external
            statuses. External status is calculated automatically based on the
            internal status you select.
          </p>
          <StatusMappingEditor />
        </div>

        {/* Prefix Configuration Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ticket Number Prefix
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Set a prefix text that will be added before ticket numbers when
            copying ticket details. For example, if prefix is "TICKET-" and
            ticket number is "4562", the copied format will be "TICKET-4562".
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prefix Text
            </label>
            <input
              type="text"
              value={prefixText}
              onChange={(e) => updatePrefixText(e.target.value)}
              placeholder="TICKET-"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Example: If prefix is "TICKET-" and ticket number is "4562", it
              will be copied as "TICKET-4562"
            </p>
          </div>
        </div>

        {/* Import/Export Settings Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Import / Export Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Export your settings to a CSV file. The file will be downloaded - replace <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">src/data/settings.csv</code> with the downloaded file to use it on next load. You can also import settings from a previously exported CSV file.
          </p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={handleExportSettings}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Export Settings
            </button>
            <label className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleImportSettings}
                className="hidden"
              />
              Import Settings
            </label>
          </div>
          {importStatus && (
            <div
              className={`p-3 rounded-lg text-sm ${
                importStatus.includes("Error")
                  ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                  : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
              }`}
            >
              {importStatus}
            </div>
          )}
        </div>

        {/* Reset Section */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
            Reset to Defaults
          </h2>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            This will reset all enum values to their defaults and disable dark
            mode. This action cannot be undone.
          </p>
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to reset all settings to defaults?"
                )
              ) {
                resetDefaults();
              }
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

