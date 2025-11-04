/**
 * CSV service for import/export operations
 * @module services/csvService
 */

import Papa from "papaparse";
import { DEFAULT_ENUMS, DEFAULT_STATUS_MAPPING } from "../constants";
import { getExternalStatus } from "../utils/statusMapping";
import { formatTimestamp } from "../utils/dateUtils";

// Static imports for CSV files (Vite requires static paths for dynamic imports)
import tasksCSVRaw from "../data/tasks.csv?raw";
import settingsCSVRaw from "../data/settings.csv?raw";

/**
 * Load tasks from CSV file
 * @param {Object} statusMapping - Status mapping configuration
 * @returns {Promise<{tasks: Array, error: string|null}>}
 */
export const loadTasksFromCSV = async (statusMapping) => {
  try {
    const text = tasksCSVRaw;

    if (!text || text.trim() === "") {
      return { tasks: [], error: "Tasks file is empty." };
    }

    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const tasks = results.data.map((row, index) => ({
            id: row.id || `csv-${Date.now()}-${index}`,
            ticketNumber: row.ticketNumber || "",
            statusInternal: row.statusInternal || "",
            statusExternal: getExternalStatus(row.statusInternal, statusMapping),
            todo: row.todo || "",
            rank: row.rank || "",
            notes: row.notes || "",
            askedTo: row.askedTo || "",
            askedToStatus: row.askedToStatus || "pending",
            lastUpdated: row.lastUpdated || formatTimestamp(),
            tags: row.tags
              ? typeof row.tags === "string"
                ? row.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                : Array.isArray(row.tags)
                ? row.tags.map((tag) => String(tag).trim()).filter(Boolean)
                : []
              : [],
          }));
          resolve({ tasks, error: null });
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          resolve({ tasks: [], error: "Failed to parse tasks file." });
        },
      });
    });
  } catch (error) {
    console.error("Error loading tasks.csv:", error);
    return {
      tasks: [],
      error: "Tasks file not found. Please ensure src/data/tasks.csv exists.",
    };
  }
};

/**
 * Load settings from CSV file
 * @returns {Promise<{settings: Object|null, error: string|null}>}
 */
export const loadSettingsFromCSV = async () => {
  try {
    const text = settingsCSVRaw;

    if (!text || text.trim() === "") {
      return { settings: null, error: "Settings file is empty." };
    }

    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            resolve({
              settings: null,
              error: "No settings data found in file.",
            });
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
            resolve({
              settings: null,
              error: "Failed to parse settings file. Please check the format.",
            });
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          resolve({
            settings: null,
            error: "Failed to parse settings file.",
          });
        },
      });
    });
  } catch (error) {
    console.error("Error loading settings.csv:", error);
    return {
      settings: null,
      error:
        "Settings file not found. Please ensure src/data/settings.csv exists.",
    };
  }
};

/**
 * Export tasks to CSV format
 * @param {Array<Object>} tasks - Tasks to export
 * @returns {string} CSV content
 */
export const exportTasksToCSV = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return "";
  }

  const csvData = tasks.map((task) => ({
    ticketNumber: task.ticketNumber || "",
    statusInternal: task.statusInternal || "",
    statusExternal: task.statusExternal || "",
    todo: task.todo || "",
    rank: task.rank || "",
    notes: task.notes || "",
    askedTo: task.askedTo || "",
    askedToStatus: task.askedToStatus || "pending",
    lastUpdated: task.lastUpdated || "",
    tags: Array.isArray(task.tags)
      ? task.tags.join(", ")
      : task.tags || "",
  }));

  return Papa.unparse(csvData);
};

/**
 * Parse tasks from uploaded CSV file
 * @param {File} file - CSV file to parse
 * @returns {Promise<Array<Object>>} Parsed tasks
 */
export const parseTasksFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const tasks = results.data.map((row) => ({
          ticketNumber: row.ticketNumber || "",
          statusInternal: row.statusInternal || "",
          statusExternal: row.statusExternal || "",
          todo: row.todo || "",
          rank: row.rank || "",
          notes: row.notes || "",
          askedTo: row.askedTo || "",
          askedToStatus: row.askedToStatus || "pending",
          lastUpdated:
            row.lastUpdated || new Date().toLocaleString("en-IN"),
          tags: row.tags
            ? typeof row.tags === "string"
              ? row.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
              : Array.isArray(row.tags)
              ? row.tags.map((tag) => String(tag).trim()).filter(Boolean)
              : []
            : [],
        }));
        resolve(tasks);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Export settings to CSV format
 * @param {Object} settings - Settings object
 * @returns {string} CSV content
 */
export const exportSettingsToCSV = (settings) => {
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

/**
 * Parse settings from uploaded CSV file
 * @param {File} file - CSV file to parse
 * @returns {Promise<Object>} Parsed settings
 */
export const parseSettingsFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          reject(new Error("No settings data found in CSV file."));
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
          resolve(settings);
        } catch (parseError) {
          reject(new Error("Failed to parse settings from CSV file."));
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

/**
 * Generate default settings CSV content
 * @returns {string} CSV content
 */
export const generateDefaultSettingsCSV = () => {
  const defaultSettings = {
    darkMode: false,
    prefixText: "",
    enums: DEFAULT_ENUMS,
    statusMapping: DEFAULT_STATUS_MAPPING,
  };
  return exportSettingsToCSV(defaultSettings);
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV content string
 * @param {string} filename - Filename for download
 */
export const downloadCSV = (csvContent, filename = "tasks.csv") => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

