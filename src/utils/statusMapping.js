/**
 * Status mapping utilities
 * @module utils/statusMapping
 */

import { DEFAULT_STATUS_MAPPING } from "../constants";

/**
 * Get external status from internal status using mapping
 * @param {string} internalStatus - Internal status value
 * @param {Object<string, string>} mapping - Status mapping object
 * @returns {string} External status or empty string
 */
export const getExternalStatus = (
  internalStatus,
  mapping = DEFAULT_STATUS_MAPPING
) => {
  if (!internalStatus) return "";
  return mapping[internalStatus] || "";
};
