import Papa from "papaparse";
import { defaultEnums } from "./enums";
import { defaultStatusMapping } from "./statusMapping";

// Default settings values (same as resetDefaults)
export const getDefaultSettings = () => {
  return {
    darkMode: false,
    prefixText: "",
    enums: defaultEnums,
    statusMapping: defaultStatusMapping,
  };
};

// Load settings from settings.csv file (in data folder)
// Returns { settings, error } where error is null if successful
export const loadSettingsFromCSV = async () => {
  try {
    // Import the CSV file as raw text using Vite's ?raw suffix
    const csvModule = await import("../data/settings.csv?raw");
    const text = csvModule.default;
    
    if (!text || text.trim() === "") {
      return { settings: null, error: "Settings file is empty." };
    }

    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            resolve({ settings: null, error: "No settings data found in file." });
            return;
          }

          const row = results.data[0];
          try {
            const settings = {
              darkMode: row.darkMode === "true" || row.darkMode === true,
              prefixText: row.prefixText || "",
              enums: {
                statusInternal: JSON.parse(row.statusInternal || "[]"),
                todo: JSON.parse(row.todo || "[]"),
                rank: JSON.parse(row.rank || "[]"),
                askedTo: JSON.parse(row.askedTo || "[]"),
                tags: JSON.parse(row.tags || "[]"),
              },
              statusMapping: JSON.parse(row.statusMapping || "{}"),
            };
            resolve({ settings, error: null });
          } catch (parseError) {
            console.error("Error parsing settings CSV:", parseError);
            resolve({ settings: null, error: "Failed to parse settings file. Please check the format." });
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          resolve({ settings: null, error: "Failed to parse settings file." });
        },
      });
    });
  } catch (error) {
    console.error("Error loading settings.csv:", error);
    return { settings: null, error: "Settings file not found. Please ensure src/data/settings.csv exists." };
  }
};

// Generate CSV content from settings
export const generateSettingsCSV = (settings) => {
  const csvData = [
    {
      darkMode: settings.darkMode ? "true" : "false",
      prefixText: settings.prefixText || "",
      statusInternal: JSON.stringify(settings.enums?.statusInternal || []),
      todo: JSON.stringify(settings.enums?.todo || []),
      rank: JSON.stringify(settings.enums?.rank || []),
      askedTo: JSON.stringify(settings.enums?.askedTo || []),
      tags: JSON.stringify(settings.enums?.tags || []),
      statusMapping: JSON.stringify(settings.statusMapping || {}),
    },
  ];

  return Papa.unparse(csvData);
};

// Save settings to CSV file
// Note: Browsers cannot write directly to src/data folder.
// This downloads the file - user needs to manually replace src/data/settings.csv
export const saveSettingsToCSVFile = (settings) => {
  const csvContent = generateSettingsCSV(settings);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "settings.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent; // Return content for display
};

// Create default settings.csv content
export const createDefaultSettingsCSV = () => {
  const defaultSettings = getDefaultSettings();
  return generateSettingsCSV(defaultSettings);
};

