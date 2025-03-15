// lib/useHealthDataUpdater.ts
import type { MumbaiHealthData } from "@/lib/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchHealthData } from "./api";
import { useHealthStore } from "./healthStore";

function pushNotification(message: string): void {
  // TODO: Implement push notifications (browser notifications, Gmail SMTP, etc.)
  console.log("Push notification:", message);
}

export function useHealthDataUpdater(): void {
  const setHealthData = useHealthStore((state) => state.setHealthData);

  useEffect(() => {
    const fetchAndUpdate = async (): Promise<void> => {
      try {
        const data = (await fetchHealthData()) as MumbaiHealthData;
        setHealthData(data);

        // Check for a critical outbreak
        const criticalOutbreak = data.diseaseOutbreaks.find(
          (o) => o.severity === "critical"
        );
        if (criticalOutbreak) {
          toast.error("Critical outbreak detected!");
          pushNotification("Critical outbreak detected in Mumbai health data.");
        }

        // Check for poor air quality (US AQI threshold: above 150 is unhealthy)
        if (data.environmentalData.airQuality.aqi > 150) {
          toast.warning("Poor air quality alert: AQI is high!");
          pushNotification("Poor air quality alert: AQI is high.");
        }

        // Check for abnormal water pH (safe range: 6.5 - 8.5)
        if (
          data.environmentalData.waterQuality.ph < 6.5 ||
          data.environmentalData.waterQuality.ph > 8.5
        ) {
          toast.warning("Abnormal water quality: pH level out of range!");
          pushNotification("Water quality alert: pH level abnormal.");
        }

        // Check for high ambient noise (example threshold: average > 80 dB)
        if (data.environmentalData.noiseLevel.average > 80) {
          toast.warning("High ambient noise detected!");
          pushNotification("High ambient noise level detected.");
        }
      } catch (error: unknown) {
        console.error("Error updating health data:", error);
        toast.error("Error updating health data.");
        pushNotification(
          "Error updating health data. Please check the system."
        );
      }
    };

    fetchAndUpdate();
    const intervalId = setInterval(fetchAndUpdate, 5000);

    return (): void => clearInterval(intervalId);
  }, [setHealthData]);
}
