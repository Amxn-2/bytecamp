import type { MumbaiHealthData } from "@/lib/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchHealthData } from "./api";
import { useHealthStore } from "./healthStore";
import { useNotificationStore } from "./notificationStore";

async function sendEmailNotification(
  subject: string,
  text: string,
  recipient: string
): Promise<void> {
  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, text, recipient }),
    });
    if (!response.ok) {
      throw new Error("Failed to send email");
    }
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export function useHealthDataUpdater(): void {
  const setHealthData = useHealthStore((state) => state.setHealthData);
  const pushNotification = useNotificationStore(
    (state) => state.addNotification
  );
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
          pushNotification({
            id: Date.now().toString(),
            message: "Critical outbreak detected in Mumbai health data.",
            read: false,
          });
        }

        // Check for poor air quality (US AQI threshold: above 150 is unhealthy)
        if (data.environmentalData.airQuality.aqi > 150) {
          toast.warning("Poor air quality alert: AQI is high!");
          pushNotification({
            id: Date.now().toString(),
            message: "Poor air quality alert: AQI is high.",
            read: false,
          });
        }

        // Check for abnormal water pH (safe range: 6.5 - 8.5)
        if (
          data.environmentalData.waterQuality.ph < 6.5 ||
          data.environmentalData.waterQuality.ph > 8.5
        ) {
          toast.warning("Abnormal water quality: pH level out of range!");
          pushNotification({
            id: Date.now().toString(),
            message: "Abnormal water quality: pH level out of range.",
            read: false,
          });
        }

        // Check for high ambient noise (example threshold: average > 80 dB)
        if (data.environmentalData.noiseLevel.average > 80) {
          toast.warning("High ambient noise detected!");
          pushNotification({
            id: Date.now().toString(),
            message: "High ambient noise detected in Mumbai.",
            read: false,
          });
        }

        const airTempSensor = data.environmentalData.sensors.find(
          (sensor) => sensor.type === "air" && sensor.unit === "°C"
        );
        if (airTempSensor && airTempSensor.reading >= 40) {
          toast.warning("Heatwave alert: Temperature is extremely high!");
          pushNotification({
            id: Date.now().toString(),
            message: "Heatwave alert: Temperature is extremely high.",
            read: false,
          });
          // Send email for heatwave alert
          await sendEmailNotification(
            "Heatwave Alert in Mumbai",
            "The temperature in Mumbai has reached or exceeded 40°C. Please take necessary precautions.",
            "user@example.com"
          );
        }

        // Check for flood forecast if available
        if (data.floodForecast) {
          toast.warning("Flood forecast alert received!");
          pushNotification({
            id: Date.now().toString(),
            message: "Flood forecast alert received in Mumbai.",
            read: false,
          });
          // Send email for flood forecast alert
          await sendEmailNotification(
            "Flood Forecast Alert in Mumbai",
            `A flood forecast has been issued for the location (${data.floodForecast.location.latitude}, ${data.floodForecast.location.longitude}) with ${data.floodForecast.severity} severity. Forecast Time: ${data.floodForecast.forecastTime}`,
            "user@example.com"
          );
        }
      } catch (error: unknown) {
        console.error("Error updating health data:", error);
        toast.error("Error updating health data.");
        pushNotification({
          id: Date.now().toString(),
          message: "Error updating health data.",
          read: false,
        });
      }
    };

    fetchAndUpdate();
    const intervalId = setInterval(fetchAndUpdate, 5000);

    return (): void => clearInterval(intervalId);
  }, [setHealthData]);
}
