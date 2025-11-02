import Papa from "papaparse";
import { formatTimestamp } from "./dateUtils";
import { getExternalStatus } from "./statusMapping";

// Load tasks from tasks.csv file (in data folder)
// Returns { tasks, error } where error is null if successful
export const loadTasksFromCSV = async (statusMapping) => {
  try {
    // Import the CSV file as raw text using Vite's ?raw suffix
    const csvModule = await import("../data/tasks.csv?raw");
    const text = csvModule.default;
    
    if (!text || text.trim() === "") {
      return { tasks: null, error: "Tasks file is empty." };
    }

    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            resolve({ tasks: null, error: "No tasks data found in file." });
            return;
          }

          try {
            const tasks = results.data.map((row, index) => {
              // Calculate external status from internal status
              const externalStatus = getExternalStatus(
                row.statusInternal,
                statusMapping
              );
              
              return {
                id: row.id || `csv-${Date.now()}-${index}`,
                ticketNumber: row.ticketNumber || "",
                statusInternal: row.statusInternal || "",
                statusExternal: externalStatus,
                todo: row.todo || "",
                rank: row.rank || "",
                notes: row.notes || "",
                askedTo: row.askedTo || "",
                lastUpdated: row.lastUpdated || formatTimestamp(),
                tags: row.tags
                  ? typeof row.tags === "string"
                    ? row.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
                    : Array.isArray(row.tags)
                    ? row.tags.map((tag) => String(tag).trim()).filter(Boolean)
                    : []
                  : [],
              };
            });
            resolve({ tasks, error: null });
          } catch (parseError) {
            console.error("Error parsing tasks CSV:", parseError);
            resolve({ tasks: null, error: "Failed to parse tasks file. Please check the format." });
          }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          resolve({ tasks: null, error: "Failed to parse tasks file." });
        },
      });
    });
  } catch (error) {
    console.error("Error loading tasks.csv:", error);
    return { tasks: null, error: "Tasks file not found. Please ensure src/data/tasks.csv exists." };
  }
};

