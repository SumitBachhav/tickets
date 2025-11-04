/**
 * Custom hook for task filtering logic
 * @module hooks/useTaskFilters
 */

import { useMemo } from "react";
import { RANK_ORDER } from "../constants";

/**
 * Filter and sort tasks based on search query and filters
 * @param {Array<Object>} tasks - Tasks to filter
 * @param {string} searchQuery - Search query string
 * @param {Object} filters - Filter object
 * @param {string} sortBy - Sort field name
 * @param {boolean} priorityFirst - Whether to prioritize high priority tickets
 * @returns {Array<Object>} Filtered and sorted tasks
 */
export const useTaskFilters = (
  tasks,
  searchQuery,
  filters,
  sortBy = "lastUpdated",
  priorityFirst = false
) => {
  return useMemo(() => {
    let filtered = tasks.filter((task) => {
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
      if (filters.askedTo && task.askedTo !== filters.askedTo) return false;

      // Asked To Status filter
      if (filters.askedToStatus) {
        const hasAskedTo = task.askedTo && task.askedTo.trim() !== "";
        if (filters.askedToStatus === "empty" && hasAskedTo) return false;
        if (
          filters.askedToStatus === "pending" &&
          (!hasAskedTo || task.askedToStatus !== "pending")
        )
          return false;
        if (
          filters.askedToStatus === "done" &&
          (!hasAskedTo || task.askedToStatus !== "done")
        )
          return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      // Priority first sorting (if enabled)
      if (priorityFirst) {
        const rankDiff =
          (RANK_ORDER[b.rank] || 0) - (RANK_ORDER[a.rank] || 0);
        if (rankDiff !== 0) return rankDiff;
      }

      // Secondary sort
      if (sortBy === "rank") {
        const rankDiff =
          (RANK_ORDER[b.rank] || 0) - (RANK_ORDER[a.rank] || 0);
        if (rankDiff !== 0) return rankDiff;
        return new Date(a.lastUpdated || 0) - new Date(b.lastUpdated || 0);
      } else if (sortBy === "lastUpdated") {
        return new Date(a.lastUpdated || 0) - new Date(b.lastUpdated || 0);
      }

      return 0;
    });

    return filtered;
  }, [tasks, searchQuery, filters, sortBy, priorityFirst]);
};

