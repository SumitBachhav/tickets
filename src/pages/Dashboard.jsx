import { useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskCard } from "../components/TaskCard";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { AddEditModal } from "../components/AddEditModal";
import { Button } from "../components/ui/Button";

export const Dashboard = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    rank: "",
    todo: "",
    statusInternal: "",
    tag: "",
  });
  const [sortBy, setSortBy] = useState("rank");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks for dashboard (validating or in progress)
  const dashboardTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusInt = (task.statusInternal || "").toLowerCase();
      const statusExt = (task.statusExternal || "").toLowerCase();
      return (
        statusInt.includes("validating") ||
        statusExt.includes("validating") ||
        statusExt.includes("in progress")
      );
    });
  }, [tasks]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    dashboardTasks.forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [dashboardTasks]);

  // Filter and search
  const filteredTasks = useMemo(() => {
    let filtered = dashboardTasks.filter((task) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTicketNumber = task.ticketNumber
          ?.toLowerCase()
          .includes(query);
        const matchesTags =
          task.tags &&
          task.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesTicketNumber && !matchesTags) return false;
      }

      // Filters
      if (filters.rank && task.rank !== filters.rank) return false;
      if (filters.todo && task.todo !== filters.todo) return false;
      if (
        filters.statusInternal &&
        task.statusInternal !== filters.statusInternal
      )
        return false;
      if (filters.tag && (!task.tags || !task.tags.includes(filters.tag)))
        return false;

      return true;
    });

    // Sort: by default, rank first (high > normal), then by updated time ascending
    filtered.sort((a, b) => {
      if (sortBy === "rank") {
        const rankOrder = { high: 2, normal: 1 };
        const rankDiff = (rankOrder[b.rank] || 0) - (rankOrder[a.rank] || 0);
        if (rankDiff !== 0) return rankDiff;
        // If ranks are equal, sort by updated time ascending (oldest first)
        return new Date(a.lastUpdated || 0) - new Date(b.lastUpdated || 0);
      } else if (sortBy === "lastUpdated") {
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      }
      return 0;
    });

    return filtered;
  }, [dashboardTasks, searchQuery, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (taskData) => {
    try {
      if (editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask(taskData);
      }
      setEditingTask(null);
    } catch (error) {
      // Error will be caught and displayed in AddEditModal
      throw error;
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your active tickets and tasks
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          size="md"
          className="shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </Button>
      </div>

      <div className="mb-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ticket number or tags..."
        />
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        availableTags={allTags}
      />

      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by:
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="lastUpdated">Last Updated</option>
          <option value="rank">Rank</option>
        </select>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({filteredTasks.length} tasks)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No tasks found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your filters or add a new task
          </p>
          <Button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            variant="primary"
          >
            Create First Task
          </Button>
        </div>
      )}

      <AddEditModal
        task={editingTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

