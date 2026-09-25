import { create } from "zustand";
import { getJSON, setJSON } from "@/lib/storage";
import type {
  AppSettings,
  LocationSource,
} from "@/features/prayer/types/prayer";

const STORAGE_KEY = "settings.v1";

const DEFAULT_SETTINGS: AppSettings = {
  location: null,
  calculationMethod: "MuslimWorldLeague",
  madhab: "shafi",
  use24HourClock: false,
  notificationsEnabled: false,
};

interface SettingsStore extends AppSettings {
  /** False until `hydrate()` has loaded any persisted settings from storage. */
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setLocation: (location: LocationSource) => void;
  setCalculationMethod: (method: AppSettings["calculationMethod"]) => void;
  setMadhab: (madhab: AppSettings["madhab"]) => void;
  setUse24HourClock: (value: boolean) => void;
  setNotificationsEnabled: (value: boolean) => void;
}

function persist(state: AppSettings) {
  // Fire-and-forget: settings writes are small and non-critical to await.
  setJSON(STORAGE_KEY, state).catch((err) => {
    console.warn("Failed to persist settings", err);
  });
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,
  hydrated: false,

  hydrate: async () => {
    const stored = await getJSON<AppSettings>(STORAGE_KEY);
    set({ ...(stored ?? DEFAULT_SETTINGS), hydrated: true });
  },

  setLocation: (location) => {
    set({ location });
    persist({ ...get(), location });
  },
  setCalculationMethod: (calculationMethod) => {
    set({ calculationMethod });
    persist({ ...get(), calculationMethod });
  },
  setMadhab: (madhab) => {
    set({ madhab });
    persist({ ...get(), madhab });
  },
  setUse24HourClock: (use24HourClock) => {
    set({ use24HourClock });
    persist({ ...get(), use24HourClock });
  },
  setNotificationsEnabled: (notificationsEnabled) => {
    set({ notificationsEnabled });
    persist({ ...get(), notificationsEnabled });
  },
}));
