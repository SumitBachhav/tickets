import { useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { TaskCard } from "../components/TaskCard";
import { AddEditModal } from "../components/AddEditModal";
import { Button } from "../components/ui/Button";

export const AskedTo = () => {
  const { tasks, updateTask, deleteTask } = useTasks();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter tasks that have askedTo value and match status filter
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const hasAskedTo = task.askedTo && task.askedTo.trim() !== "";
      if (!hasAskedTo) return false;
      
      if (statusFilter && task.askedToStatus !== statusFilter) return false;
      
      return true;
    });
  }, [tasks, statusFilter]);

  // Group tasks by askedTo value
  const groupedTasks = useMemo(() => {
    const groups = {};
    filteredTasks.forEach((task) => {
      const person = task.askedTo;
      if (!groups[person]) {
        groups[person] = [];
      }
      groups[person].push(task);
    });
    return groups;
  }, [filteredTasks]);

  // Get sorted list of people with their counts
  const peopleList = useMemo(() => {
    return Object.entries(groupedTasks)
      .map(([person, tasks]) => ({
        person,
        count: tasks.length,
        tasks,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [groupedTasks]);

  const handleSave = (taskData) => {
    try {
      if (editingTask) {
        updateTask(editingTask.id, taskData);
      }
      setEditingTask(null);
    } catch (error) {
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

  const totalTickets = filteredTasks.length;

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Asked To
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View tickets grouped by person ({totalTickets} total tickets)
          </p>
        </div>
      </div>

      {/* Status Filter Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Status
        </label>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statusFilter === "pending"
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("response-received")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statusFilter === "response-received"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Response Received
          </button>
          <button
            onClick={() => setStatusFilter("done")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statusFilter === "done"
                ? "bg-green-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Done
          </button>
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              statusFilter === ""
                ? "bg-gray-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Grouped Tasks */}
      {peopleList.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {statusFilter
              ? `No tickets with status "${statusFilter}" assigned to anyone.`
              : "No tickets have been assigned to anyone yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {peopleList.map(({ person, count, tasks }) => (
            <div key={person} className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {person}
                </h2>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                  {count} {count === 1 ? "ticket" : "tickets"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
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

