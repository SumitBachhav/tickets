/**
 * Storage service for localStorage operations
 * @module services/storageService
 */

import { STORAGE_KEYS } from "../constants";

/**
 * Load tasks from localStorage
 * @returns {Array<Object>} Array of tasks or empty array
 */
export const loadTasksFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
};

/**
 * Save tasks to localStorage
 * @param {Array<Object>} tasks - Tasks to save
 * @throws {Error} If storage quota is exceeded or save fails
 */
export const saveTasksToStorage = (tasks) => {
  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEYS.TASKS, serialized);
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
    if (error.name === "QuotaExceededError") {
      throw new Error("Storage quota exceeded. Please free up some space.");
    }
    throw new Error("Failed to save tasks. Please try again.");
  }
};

/**
 * Load settings from localStorage
 * @returns {Object|null} Settings object or null
 */
export const loadSettingsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
    return null;
  }
};

/**
 * Save settings to localStorage
 * @param {Object} settings - Settings object to save
 */
export const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};

