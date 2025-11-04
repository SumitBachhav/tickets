/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import {
  loadSettingsFromStorage,
  saveSettingsToStorage,
} from "../services/storageService";
import { DEFAULT_ENUMS, DEFAULT_STATUS_MAPPING } from "../constants";
import { getDefaultSettings } from "../data/sampleSettings";
import { loadSettingsFromCSV } from "../services/csvService";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [enums, setEnums] = useState(DEFAULT_ENUMS);
  const [darkMode, setDarkMode] = useState(false);
  const [statusMapping, setStatusMapping] = useState(DEFAULT_STATUS_MAPPING);
  const [prefixText, setPrefixText] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [settingsError, setSettingsError] = useState(null);

  useEffect(() => {
    // Load settings: localStorage first, then fallback to settings.csv
    const loadSettings = async () => {
      // Try localStorage first
      const savedSettings = loadSettingsFromStorage();
      
      if (savedSettings) {
        // localStorage has settings - use them
        if (savedSettings.enums) {
          setEnums(savedSettings.enums);
        }
        if (savedSettings.darkMode !== undefined) {
          setDarkMode(savedSettings.darkMode);
        }
        if (savedSettings.statusMapping) {
          setStatusMapping(savedSettings.statusMapping);
        }
        if (savedSettings.prefixText !== undefined) {
          setPrefixText(savedSettings.prefixText);
        }
        setSettingsError(null);
        setIsInitialized(true);
        return;
      }
      
      // No localStorage - try CSV file as fallback
      const { settings, error } = await loadSettingsFromCSV();
      
      if (error) {
        // No CSV file - show warning but continue
        setSettingsError(error);
        setIsInitialized(true);
        return;
      }
      
      if (settings) {
        // CSV file exists and has data - use it
        if (settings.enums) {
          setEnums(settings.enums);
        }
        if (settings.darkMode !== undefined) {
          setDarkMode(settings.darkMode);
        }
        if (settings.statusMapping) {
          setStatusMapping(settings.statusMapping);
        }
        if (settings.prefixText !== undefined) {
          setPrefixText(settings.prefixText);
        }
        setSettingsError(null);
        // Also save to localStorage for runtime persistence
        saveSettingsToStorage(settings);
      }
      
      setIsInitialized(true);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save settings to localStorage for runtime persistence (like tasks)
    // This allows settings changes to persist during the session
    if (isInitialized) {
      saveSettingsToStorage({ enums, darkMode, statusMapping, prefixText });
    }
  }, [darkMode, enums, statusMapping, prefixText, isInitialized]);

  const updateEnum = (type, values) => {
    setEnums((prev) => ({
      ...prev,
      [type]: values,
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const updateStatusMapping = (newMapping) => {
    setStatusMapping(newMapping);
  };

  const updatePrefixText = (newPrefix) => {
    setPrefixText(newPrefix);
  };

  const resetDefaults = () => {
    const defaults = getDefaultSettings();
    setEnums(defaults.enums);
    setDarkMode(defaults.darkMode);
    setStatusMapping(defaults.statusMapping);
    setPrefixText(defaults.prefixText);
  };

  return (
    <SettingsContext.Provider
      value={{
        enums,
        darkMode,
        statusMapping,
        prefixText,
        settingsError,
        updateEnum,
        toggleDarkMode,
        updateStatusMapping,
        updatePrefixText,
        resetDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

