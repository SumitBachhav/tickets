import { getStatusColor } from "../utils/colorConfig";

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColor = getStatusColor(
    task.statusInternal || task.statusExternal
  );

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <a
              href={`#${task.ticketNumber}`}
              className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {task.ticketNumber}
            </a>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}
            >
              {task.statusInternal || task.statusExternal || "N/A"}
            </span>
          </div>
          <div className="flex gap-2 mb-2">
            {task.rank && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs">
                {task.rank}
              </span>
            )}
            {task.todo && (
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs">
                {task.todo}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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
            onClick={() => onDelete(task.id)}
            className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-medium">Asked To:</span> {task.askedTo}
        </p>
      )}

      {task.notes && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
          {task.notes}
        </p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {task.lastUpdated && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          Updated: {task.lastUpdated}
        </p>
      )}
    </div>
  );
};

