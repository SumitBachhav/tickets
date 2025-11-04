import { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { getExternalStatus } from "../utils/statusMapping";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export const AddEditModal = ({ task, isOpen, onClose, onSave }) => {
  const { enums, statusMapping } = useSettings();
  const [formData, setFormData] = useState({
    ticketNumber: "",
    statusInternal: "",
    todo: "",
    rank: "",
    notes: "",
    askedTo: "",
    askedToStatus: "pending",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        ticketNumber: task.ticketNumber || "",
        statusInternal: task.statusInternal || "",
        todo: task.todo || "",
        rank: task.rank || "",
        notes: task.notes || "",
        askedTo: task.askedTo || "",
        askedToStatus: task.askedToStatus || "pending",
        tags: task.tags || [],
      });
    } else {
      setFormData({
        ticketNumber: "",
        statusInternal: "",
        todo: "",
        rank: "",
        notes: "",
        askedTo: "",
        askedToStatus: "pending",
        tags: [],
      });
    }
    setTagInput("");
    setError("");
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate required fields
      if (!formData.ticketNumber || formData.ticketNumber.trim() === "") {
        throw new Error("Ticket number is required.");
      }

      // Call onSave and handle potential errors
      await Promise.resolve(onSave(formData));
      onClose();
    } catch (err) {
      const errorMessage =
        err?.message || "Failed to save task. Please try again.";
      setError(errorMessage);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {task ? "Edit Task" : "Add New Task"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {task ? "Update task details" : "Create a new ticket"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Ticket Number *"
            type="text"
            required
            value={formData.ticketNumber}
            onChange={(e) =>
              setFormData({ ...formData, ticketNumber: e.target.value })
            }
            error={error && !formData.ticketNumber ? "Ticket number is required" : ""}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status (Internal)"
              value={formData.statusInternal}
              onChange={(e) =>
                setFormData({ ...formData, statusInternal: e.target.value })
              }
            >
              <option value="">Select...</option>
              {enums.statusInternal.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status (External) <span className="text-xs text-gray-500 dark:text-gray-400">(Auto-calculated)</span>
              </label>
              <input
                type="text"
                readOnly
                value={getExternalStatus(formData.statusInternal, statusMapping) || "—"}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Todo"
              value={formData.todo}
              onChange={(e) =>
                setFormData({ ...formData, todo: e.target.value })
              }
            >
              <option value="">Select...</option>
              {enums.todo.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>

            <Select
              label="Rank"
              value={formData.rank}
              onChange={(e) =>
                setFormData({ ...formData, rank: e.target.value })
              }
            >
              <option value="">Select...</option>
              {enums.rank.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <Select
              label="Asked To"
              value={formData.askedTo}
              onChange={(e) =>
                setFormData({ ...formData, askedTo: e.target.value })
              }
            >
              <option value="">Select...</option>
              {(enums.askedTo || []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
            {formData.askedTo && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Status
                </label>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, askedToStatus: "pending" })
                    }
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      formData.askedToStatus === "pending"
                        ? "bg-orange-500 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, askedToStatus: "done" })
                    }
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      formData.askedToStatus === "done"
                        ? "bg-green-500 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Select
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1"
              >
                <option value="">Select a tag...</option>
                {(enums.tags || []).map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>
              <Button
                type="button"
                onClick={handleAddTag}
                variant="primary"
                size="md"
                disabled={!tagInput || formData.tags.includes(tagInput)}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <Badge key={idx} variant="primary" className="flex items-center gap-1.5">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg animate-fade-in">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {task ? "Update" : "Create"} Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

