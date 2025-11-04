import { useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskCard } from "../components/TaskCard";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { AddEditModal } from "../components/AddEditModal";

export const Waiting = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    rank: "",
    todo: "",
    statusInternal: "",
    tag: "",
    askedTo: "",
    askedToStatus: "",
  });
  const [sortBy, setSortBy] = useState("lastUpdated");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks for waiting page
  const waitingTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusInt = (task.statusInternal || "").toLowerCase();
      const statusExt = (task.statusExternal || "").toLowerCase();
      return (
        statusInt.includes("waiting") || statusExt.includes("waiting")
      );
    });
  }, [tasks]);

  const allTags = useMemo(() => {
    const tags = new Set();
    waitingTasks.forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [waitingTasks]);

  const filteredTasks = useMemo(() => {
    let filtered = waitingTasks.filter((task) => {
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

      if (filters.rank && task.rank !== filters.rank) return false;
      if (filters.todo && task.todo !== filters.todo) return false;
      if (
        filters.statusInternal &&
        task.statusInternal !== filters.statusInternal
      )
        return false;
      if (filters.tag && (!task.tags || !task.tags.includes(filters.tag)))
        return false;
      if (filters.askedTo && task.askedTo !== filters.askedTo) return false;
      
      // Asked To Status filter
      if (filters.askedToStatus) {
        const hasAskedTo = task.askedTo && task.askedTo.trim() !== "";
        if (filters.askedToStatus === "empty" && hasAskedTo) return false;
        if (filters.askedToStatus === "pending" && (!hasAskedTo || task.askedToStatus !== "pending")) return false;
        if (filters.askedToStatus === "done" && (!hasAskedTo || task.askedToStatus !== "done")) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "rank") {
        const rankOrder = { high: 2, normal: 1 };
        return (rankOrder[b.rank] || 0) - (rankOrder[a.rank] || 0);
      } else if (sortBy === "lastUpdated") {
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      }
      return 0;
    });

    return filtered;
  }, [waitingTasks, searchQuery, filters, sortBy]);

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Waiting Tasks
        </h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Add Task
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No waiting tasks found.
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

