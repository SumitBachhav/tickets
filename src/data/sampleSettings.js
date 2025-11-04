/**
 * Sample settings for initial load
 * @module data/sampleSettings
 */

import { DEFAULT_ENUMS, DEFAULT_STATUS_MAPPING } from "../constants";

/**
 * Get default settings
 * @returns {Object} Default settings object
 */
export const getDefaultSettings = () => {
  return {
    darkMode: false,
    prefixText: "",
    enums: DEFAULT_ENUMS,
    statusMapping: DEFAULT_STATUS_MAPPING,
  };
};

