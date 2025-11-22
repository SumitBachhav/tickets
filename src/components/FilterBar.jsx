import { useSettings } from "../context/SettingsContext";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";

export const FilterBar = ({
  filters,
  onFilterChange,
  availableTags = [], // Deprecated - tags now come from settings
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
    {
      key: "askedTo",
      label: "Asked To",
      options: enums.askedTo || [],
    },
  ];

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="flex flex-wrap gap-3 mb-6 animate-fade-in">
      {filterFields.map((field) => (
        <Select
          key={field.key}
          inline
          value={filters[field.key] || ""}
          onChange={(e) => onFilterChange(field.key, e.target.value)}
          className="min-w-[140px]"
        >
          <option value="">All {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      ))}
      <Select
        inline
        value={filters.tag || ""}
        onChange={(e) => onFilterChange("tag", e.target.value)}
        className="min-w-[140px]"
      >
        <option value="">All Tags</option>
        {(enums.tags || []).map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </Select>
      <Select
        inline
        value={filters.askedToStatus || ""}
        onChange={(e) => onFilterChange("askedToStatus", e.target.value)}
        className="min-w-[140px]"
      >
        <option value="">All Asked To Status</option>
        <option value="empty">Empty</option>
        <option value="pending">Pending</option>
        <option value="response-received">Response Received (RR)</option>
        <option value="done">Done</option>
      </Select>
      <Select
        inline
        value={filters.docStatus || ""}
        onChange={(e) => onFilterChange("docStatus", e.target.value)}
        className="min-w-[140px]"
      >
        <option value="">All DOC Status</option>
        <option value="no">No</option>
        <option value="yes">Yes</option>
        <option value="done">Done</option>
      </Select>
      {hasActiveFilters && (
        <Button
          onClick={() => {
            filterFields.forEach((f) => onFilterChange(f.key, ""));
            onFilterChange("tag", "");
            onFilterChange("askedToStatus", "");
            onFilterChange("docStatus", "");
          }}
          variant="secondary"
          size="sm"
          className="whitespace-nowrap"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

