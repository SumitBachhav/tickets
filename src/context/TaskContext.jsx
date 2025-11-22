/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../services/storageService";
import { formatTimestamp } from "../utils/dateUtils";
import { getSampleTasks } from "../data/sampleData";
import { getExternalStatus } from "../utils/statusMapping";
import { useSettings } from "./SettingsContext";
import { useToast } from "./ToastContext";
import { loadTasksFromCSV } from "../services/csvService";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const { statusMapping } = useSettings();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to normalize tags in tasks
  const normalizeTaskTags = (task) => {
    if (!task.tags) {
      return { ...task, tags: [] };
    }
    if (Array.isArray(task.tags)) {
      return { ...task, tags: task.tags.filter(Boolean) };
    }
    if (typeof task.tags === "string") {
      return {
        ...task,
        tags: task.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
    }
    return { ...task, tags: [] };
  };

  useEffect(() => {
    // Load tasks: localStorage first, then fallback to tasks.csv, then sample data
    const loadTasks = async () => {
      // Try localStorage first
      const storedTasks = loadTasksFromStorage();
      if (storedTasks && storedTasks.length > 0) {
        // Normalize tags for all stored tasks
        const normalizedTasks = storedTasks.map(normalizeTaskTags);
        setTasks(normalizedTasks);
        setLoading(false);
        return;
      }
      
      // No localStorage - try CSV file as fallback
      const { tasks: csvTasks, error } = await loadTasksFromCSV(statusMapping);
      
      if (error) {
        // No CSV file - use sample data as final fallback
        console.warn("CSV load error:", error);
        const sampleTasks = getSampleTasks();
        setTasks(sampleTasks);
        setLoading(false);
        return;
      }
      
      if (csvTasks && csvTasks.length > 0) {
        // Normalize tags for all CSV tasks
        const normalizedTasks = csvTasks.map(normalizeTaskTags);
        setTasks(normalizedTasks);
        // Also save to localStorage for runtime persistence
        saveTasksToStorage(normalizedTasks);
      } else {
        // CSV file exists but empty - use sample data
        const sampleTasks = getSampleTasks();
        setTasks(sampleTasks);
      }
      
      setLoading(false);
    };

    loadTasks();
  }, [statusMapping]);

  useEffect(() => {
    // Auto-save to localStorage whenever tasks change
    if (!loading && tasks.length >= 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, loading]);

  const addTask = (task) => {
    try {
      // Validate task data
      if (!task.ticketNumber || task.ticketNumber.trim() === "") {
        throw new Error("Ticket number is required.");
      }

      // Check for duplicate ticket numbers
      const duplicate = tasks.find(
        (t) =>
          t.ticketNumber.toLowerCase().trim() ===
          task.ticketNumber.toLowerCase().trim()
      );
      if (duplicate) {
        throw new Error(
          `A task with ticket number "${task.ticketNumber}" already exists.`
        );
      }

      // Auto-calculate external status from internal status
      const externalStatus = getExternalStatus(task.statusInternal, statusMapping);
      const newTask = normalizeTaskTags({
        ...task,
        statusExternal: externalStatus,
        id: Date.now().toString(),
        lastUpdated: formatTimestamp(),
        tags: Array.isArray(task.tags) ? task.tags : [],
      });

      setTasks((prev) => [...prev, newTask]);
      showToast(`Ticket "${task.ticketNumber}" created successfully!`, "success");
      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const updateTask = (id, fields) => {
    try {
      // Validate task exists
      const existingTask = tasks.find((t) => t.id === id);
      if (!existingTask) {
        throw new Error("Task not found.");
      }

      // Validate ticket number if it's being updated
      if (fields.ticketNumber !== undefined) {
        if (!fields.ticketNumber || fields.ticketNumber.trim() === "") {
          throw new Error("Ticket number is required.");
        }

        // Check for duplicate ticket numbers (excluding current task)
        const duplicate = tasks.find(
          (t) =>
            t.id !== id &&
            t.ticketNumber.toLowerCase().trim() ===
              fields.ticketNumber.toLowerCase().trim()
        );
        if (duplicate) {
          throw new Error(
            `A task with ticket number "${fields.ticketNumber}" already exists.`
          );
        }
      }

      // Get the ticket number for the toast (use updated value if provided)
      const ticketNumber = fields.ticketNumber || existingTask.ticketNumber;

      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            // If statusInternal is being updated, recalculate statusExternal
            const updatedFields = { ...fields };
            if (fields.statusInternal !== undefined) {
              updatedFields.statusExternal = getExternalStatus(
                fields.statusInternal,
                statusMapping
              );
            }
            // Ensure tags are always an array
            if (updatedFields.tags !== undefined) {
              updatedFields.tags = Array.isArray(updatedFields.tags)
                ? updatedFields.tags.filter(Boolean)
                : [];
            } else {
              // Preserve existing tags if not being updated
              updatedFields.tags = task.tags || [];
            }
            return normalizeTaskTags({
              ...task,
              ...updatedFields,
              lastUpdated: formatTimestamp(),
            });
          }
          return task;
        })
      );
      
      showToast(
        `Ticket "${ticketNumber}" updated successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (taskToDelete) {
      showToast(`Ticket "${taskToDelete.ticketNumber}" deleted successfully!`, "success");
    }
  };

  const importTasks = (importedTasks) => {
    const tasksWithIds = importedTasks.map((task, index) =>
      normalizeTaskTags({
        ...task,
        id: task.id || `imported-${Date.now()}-${index}`,
        lastUpdated: task.lastUpdated || formatTimestamp(),
      })
    );
    setTasks(tasksWithIds);
  };

  const exportTasks = () => {
    return tasks;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        importTasks,
        exportTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

