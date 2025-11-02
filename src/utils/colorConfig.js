export const statusColors = {
  validating: "bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100",
  "in progress": "bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100",
  resolved: "bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100",
  "resolved-wfc": "bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100",
  waiting: "bg-orange-200 dark:bg-orange-700 text-orange-900 dark:text-white",
  "waiting-external": "bg-orange-200 dark:bg-orange-700 text-orange-900 dark:text-white",
  "waiting-internal": "bg-orange-200 dark:bg-orange-700 text-orange-900 dark:text-white",
  default: "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100",
};

export const getStatusColor = (status) => {
  if (!status) return statusColors.default;
  const statusLower = status.toLowerCase();
  for (const [key, value] of Object.entries(statusColors)) {
    if (statusLower.includes(key.toLowerCase())) {
      return value;
    }
  }
  return statusColors.default;
};

