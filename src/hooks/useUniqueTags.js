/**
 * Custom hook to extract unique tags from tasks
 * @module hooks/useUniqueTags
 */

import { useMemo } from "react";

/**
 * Get unique tags from tasks
 * @param {Array<Object>} tasks - Tasks array
 * @returns {Array<string>} Array of unique tags
 */
export const useUniqueTags = (tasks) => {
  return useMemo(() => {
    const tags = new Set();
    tasks.forEach((task) => {
      if (task.tags) {
        task.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [tasks]);
};

