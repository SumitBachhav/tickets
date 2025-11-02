// Sample settings to load when localStorage is empty
import { defaultEnums } from "./enums";
import { defaultStatusMapping } from "./statusMapping";

export const getSampleSettings = () => {
  return {
    darkMode: false,
    prefixText: "TICKET-",
    enums: defaultEnums,
    statusMapping: defaultStatusMapping,
  };
};

