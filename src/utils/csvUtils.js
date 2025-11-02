import Papa from "papaparse";

export const exportTasksToCSV = (tasks) => {
  if (!tasks || tasks.length === 0) {
    return "";
  }

  // Convert tasks to CSV format
  const csvData = tasks.map((task) => ({
    ticketNumber: task.ticketNumber || "",
    statusInternal: task.statusInternal || "",
    statusExternal: task.statusExternal || "",
    todo: task.todo || "",
    rank: task.rank || "",
    notes: task.notes || "",
    askedTo: task.askedTo || "",
    lastUpdated: task.lastUpdated || "",
    tags: Array.isArray(task.tags) ? task.tags.join(", ") : task.tags || "",
  }));

  return Papa.unparse(csvData);
};

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
};

export const parseCSV = (file) => {
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
          lastUpdated: row.lastUpdated || new Date().toLocaleString("en-IN"),
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

// Settings CSV export/import
export const exportSettingsToCSV = (settings) => {
  // Flatten settings object for CSV
  const csvData = [
    {
      darkMode: settings.darkMode ? "true" : "false",
      prefixText: settings.prefixText || "",
      statusInternal: JSON.stringify(settings.enums?.statusInternal || []),
      todo: JSON.stringify(settings.enums?.todo || []),
      rank: JSON.stringify(settings.enums?.rank || []),
      statusMapping: JSON.stringify(settings.statusMapping || {}),
    },
  ];

  return Papa.unparse(csvData);
};

export const parseSettingsCSV = (file) => {
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

