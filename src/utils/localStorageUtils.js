const STORAGE_KEYS = {
  TASKS: "ticket_tasks",
  SETTINGS: "ticket_settings",
};

export const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
};

export const saveTasksToStorage = (tasks) => {
  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, serialized);
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
    // Re-throw if quota exceeded or other critical errors
    if (error.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded. Please free up some space.");
    }
    throw new Error("Failed to save tasks. Please try again.");
  }
};

export const loadSettingsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
    return null;
  }
};

export const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};

