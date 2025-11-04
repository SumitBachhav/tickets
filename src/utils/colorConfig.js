/**
 * Color configuration utilities for status badges
 * @module utils/colorConfig
 */

import { STATUS_COLORS } from "../constants";

/**
 * Get color classes for a given status
 * @param {string} status - Status value
 * @returns {string} Tailwind CSS color classes
 */
export const getStatusColor = (status) => {
  if (!status) return STATUS_COLORS.default;
  const statusLower = status.toLowerCase();
  for (const [key, value] of Object.entries(STATUS_COLORS)) {
    if (statusLower.includes(key.toLowerCase())) {
      return value;
    }
  }
  return STATUS_COLORS.default;
};
