import { getStatusColor } from "../utils/colorConfig";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColor = getStatusColor(
    task.statusInternal || task.statusExternal
  );

  const getBadgeVariant = (type, value) => {
    if (type === "rank") {
      return value === "high" ? "danger" : "default";
    }
    if (type === "todo") {
      if (value === "yes-priority") return "warning";
      if (value === "yes") return "primary";
      return "default";
    }
    return "default";
  };

  const handleCardClick = () => {
    onEdit(task);
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card 
      className="animate-slide-up cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <button
              onClick={(e) => handleButtonClick(e, () => onEdit(task))}
              className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors text-left"
            >
              {task.ticketNumber}
            </button>
            <Badge className={`${statusColor} text-xs font-semibold`}>
              {task.statusInternal || task.statusExternal || "N/A"}
            </Badge>
          </div>
          <div className="flex gap-2 mb-2 flex-wrap">
            {task.rank && (
              <Badge variant={getBadgeVariant("rank", task.rank)}>
                {task.rank}
              </Badge>
            )}
            {task.todo && (
              <Badge variant={getBadgeVariant("todo", task.todo)}>
                {task.todo}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 ml-2 flex-shrink-0">
          <button
            onClick={(e) => handleButtonClick(e, () => onEdit(task))}
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
            aria-label="Edit task"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => handleButtonClick(e, () => onDelete(task.id))}
            className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
            aria-label="Delete task"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {task.askedTo && (
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Asked To:</span> {task.askedTo}
          </p>
          {task.askedToStatus && (
            <Badge 
              variant={
                task.askedToStatus === "done" 
                  ? "success" 
                  : task.askedToStatus === "response-received"
                  ? "primary"
                  : "warning"
              }
              className="text-xs"
            >
              {task.askedToStatus === "done" 
                ? "✓ Done" 
                : task.askedToStatus === "response-received"
                ? "📨 RR"
                : "⏳ Pending"}
            </Badge>
          )}
        </div>
      )}

      {task.docStatus && (
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-700 dark:text-gray-300">DOC Status:</span>
          </p>
          <Badge 
            variant={
              task.docStatus === "done" 
                ? "success" 
                : task.docStatus === "yes"
                ? "warning"
                : "danger"
            }
            className="text-xs"
          >
            {task.docStatus === "done" 
              ? "✓ Done" 
              : task.docStatus === "yes"
              ? "✓ Yes"
              : "✗ No"}
          </Badge>
        </div>
      )}

      {task.notes && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
          {task.notes}
        </p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {task.tags.map((tag, idx) => (
            <Badge key={idx} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {task.lastUpdated && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="font-medium">Updated:</span> {task.lastUpdated}
        </p>
      )}
    </Card>
  );
};

