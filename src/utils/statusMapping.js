// Default status mapping: internal -> external
export const defaultStatusMapping = {
  new: "new",
  validating: "In validation",
  "waiting-external": "WFC",
  "waiting-internal": "In progress",
  resolved: "Resolved",
  "resolved-wfc": "WFC",
  "someone else is handling": "WFC",
};

export const getExternalStatus = (internalStatus, mapping = defaultStatusMapping) => {
  if (!internalStatus) return "";
  return mapping[internalStatus] || "";
};

