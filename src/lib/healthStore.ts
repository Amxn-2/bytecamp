import type { DiseaseOutbreak, MumbaiHealthData } from "@/lib/types";
import { create } from "zustand";

interface HealthStore {
  // Our state holds the latest health data from the API
  healthData: MumbaiHealthData | null;
  // Basic setter and updater
  setHealthData: (data: MumbaiHealthData) => void;
  updateHealthData: (data: Partial<MumbaiHealthData>) => void;
  // CRUD operations for disease outbreaks as an example
  addDiseaseOutbreak: (outbreak: DiseaseOutbreak) => void;
  updateDiseaseOutbreak: (
    id: string,
    updated: Partial<DiseaseOutbreak>
  ) => void;
  deleteDiseaseOutbreak: (id: string) => void;
  // You can add similar functions for mental health reports or sensors as needed.
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  healthData: null,
  setHealthData: (data) => set({ healthData: data }),
  updateHealthData: (data) => {
    const currentData = get().healthData;
    if (currentData) {
      set({ healthData: { ...currentData, ...data } });
    }
  },
  addDiseaseOutbreak: (outbreak) => {
    const currentData = get().healthData;
    if (currentData) {
      set({
        healthData: {
          ...currentData,
          diseaseOutbreaks: [...currentData.diseaseOutbreaks, outbreak],
        },
      });
    }
  },
  updateDiseaseOutbreak: (id, updated) => {
    const currentData = get().healthData;
    if (currentData) {
      set({
        healthData: {
          ...currentData,
          diseaseOutbreaks: currentData.diseaseOutbreaks.map((o) =>
            o.id === id ? { ...o, ...updated } : o
          ),
        },
      });
    }
  },
  deleteDiseaseOutbreak: (id) => {
    const currentData = get().healthData;
    if (currentData) {
      set({
        healthData: {
          ...currentData,
          diseaseOutbreaks: currentData.diseaseOutbreaks.filter(
            (o) => o.id !== id
          ),
        },
      });
    }
  },
}));
