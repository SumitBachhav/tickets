/**
 * Application-wide constants
 * @module constants
 */

/**
 * Storage keys for localStorage
 * @type {Object<string, string>}
 */
export const STORAGE_KEYS = {
  TASKS: "ticket_tasks",
  SETTINGS: "ticket_settings",
};

/**
 * Default enum values for task fields
 * @type {Object<string, string[]>}
 */
export const DEFAULT_ENUMS = {
  statusInternal: [
    "new",
    "validating",
    "waiting-external",
    "waiting-internal",
    "resolved",
    "resolved-wfc",
    "someone else is handling",
  ],
  todo: ["yes-priority", "yes", "no"],
  rank: ["normal", "high"],
  askedTo: ["John Doe", "Client Team", "Dev Team", "QA Team", "Product Team"],
  tags: [
    "backend",
    "api",
    "client",
    "feedback",
    "deployment",
    "bugfix",
    "testing",
    "review",
    "feature",
    "enhancement",
  ],
};

/**
 * Default status mapping from internal to external status
 * @type {Object<string, string>}
 */
export const DEFAULT_STATUS_MAPPING = {
  new: "new",
  validating: "In validation",
  "waiting-external": "WFC",
  "waiting-internal": "In progress",
  resolved: "Resolved",
  "resolved-wfc": "WFC",
  "someone else is handling": "WFC",
};

/**
 * Status color classes for UI
 * @type {Object<string, string>}
 */
export const STATUS_COLORS = {
  validating: "bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100",
  "in progress":
    "bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100",
  resolved:
    "bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100",
  "resolved-wfc":
    "bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100",
  waiting:
    "bg-orange-200 dark:bg-orange-700 text-orange-900 dark:text-white",
  "waiting-external":
    "bg-orange-200 dark:bg-orange-700 text-orange-900 dark:text-white",
  "waiting-internal":
    "bg-orange-200 dark:bg-orange-700 text-orange-900 dark:text-white",
  default: "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100",
};

/**
 * Date format configuration
 * @type {Object<string, string|number>}
 */
export const DATE_FORMAT = {
  locale: "en-IN",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

/**
 * Rank order for sorting
 * @type {Object<string, number>}
 */
export const RANK_ORDER = {
  high: 2,
  normal: 1,
};

/**
 * Toast notification duration (milliseconds)
 * @type {number}
 */
export const TOAST_DURATION = 3000;

/**
 * Tasks per page for pagination
 * @type {number}
 */
export const TASKS_PER_PAGE = 20;

