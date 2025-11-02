import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";

export const StatusMappingEditor = () => {
  const { enums, statusMapping, updateStatusMapping } = useSettings();
  const [localMapping, setLocalMapping] = useState(statusMapping);

  // Sync local mapping when statusMapping changes
  useEffect(() => {
    setLocalMapping(statusMapping);
  }, [statusMapping]);

  const handleInternalStatusChange = (internalStatus, newExternalStatus) => {
    const updated = { ...localMapping, [internalStatus]: newExternalStatus };
    setLocalMapping(updated);
    updateStatusMapping(updated);
  };

  const handleAddMapping = () => {
    // Get first internal status that's not in mapping
    const unmappedStatus = enums.statusInternal.find(
      (status) => !localMapping[status]
    );
    if (unmappedStatus) {
      const updated = { ...localMapping, [unmappedStatus]: "" };
      setLocalMapping(updated);
      updateStatusMapping(updated);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Status Mapping
        </h3>
        <button
          onClick={handleAddMapping}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Mapping
        </button>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Configure how internal statuses map to external statuses. External
        status is automatically calculated based on internal status.
      </p>
      <div className="space-y-3">
        {enums.statusInternal.map((internalStatus) => (
          <div
            key={internalStatus}
            className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {internalStatus}
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Internal Status
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-500">→</span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={localMapping[internalStatus] || ""}
                onChange={(e) =>
                  handleInternalStatusChange(internalStatus, e.target.value)
                }
                placeholder="External status..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
      {enums.statusInternal.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add internal statuses first to configure mappings.
        </p>
      )}
    </div>
  );
};

