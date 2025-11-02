import { useSettings } from "../context/SettingsContext";

export const FilterBar = ({
  filters,
  onFilterChange,
  availableTags = [],
}) => {
  const { enums } = useSettings();

  const filterFields = [
    {
      key: "rank",
      label: "Rank",
      options: enums.rank || [],
    },
    {
      key: "todo",
      label: "Todo",
      options: enums.todo || [],
    },
    {
      key: "statusInternal",
      label: "Status (Internal)",
      options: enums.statusInternal || [],
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {filterFields.map((field) => (
        <select
          key={field.key}
          value={filters[field.key] || ""}
          onChange={(e) => onFilterChange(field.key, e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ))}
      <select
        value={filters.tag || ""}
        onChange={(e) => onFilterChange("tag", e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          filterFields.forEach((f) => onFilterChange(f.key, ""));
          onFilterChange("tag", "");
        }}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};

