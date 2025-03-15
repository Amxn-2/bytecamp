"use client";

import AlertCard from "@/components/alert-card";
import DataCard from "@/components/data-card";
import MapView from "@/components/map-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchHealthData } from "@/lib/api";
import type { MumbaiHealthData } from "@/lib/types";
import {
  AlertTriangle,
  Droplet,
  Loader2,
  Thermometer,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [data, setData] = useState<MumbaiHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const healthData = await fetchHealthData();
        setData(healthData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load data</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-mono">
        Mumbai Health Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DataCard
          title="US Air Quality Index (AQI)"
          value={data.environmentalData.airQuality.aqi}
          description="Current AQI level based on US standards"
          status={
            data.environmentalData.airQuality.aqi < 50
              ? "success"
              : data.environmentalData.airQuality.aqi < 100
              ? "info"
              : data.environmentalData.airQuality.aqi < 150
              ? "warning"
              : "error"
          }
          icon={<Wind className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="Water Quality"
          value={`pH ${data.environmentalData.waterQuality.ph}`}
          description="Average pH level"
          status={
            data.environmentalData.waterQuality.ph >= 6.5 &&
            data.environmentalData.waterQuality.ph <= 8.5
              ? "success"
              : "warning"
          }
          icon={<Droplet className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="Temperature"
          value={`${data.environmentalData.waterQuality.temperature}°C`}
          description="Current temperature"
          icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="Noise Level"
          value={`${data.environmentalData.noiseLevel.average} dB`}
          description={`Peak: ${data.environmentalData.noiseLevel.peak} dB at ${data.environmentalData.noiseLevel.timeOfPeak}`}
          status={
            data.environmentalData.noiseLevel.average < 60
              ? "success"
              : data.environmentalData.noiseLevel.average < 75
              ? "warning"
              : "error"
          }
        />
      </div>

      <div className="mt-4 md:mt-6">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle>Mumbai Health Map</CardTitle>
            <CardDescription>
              Interactive map showing environmental sensors, disease outbreaks,
              and mental health reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapView
              key={data.environmentalData.sensors
                .map((sensor) => sensor.id)
                .join("-")}
              sensors={data.environmentalData.sensors}
              outbreaks={data.diseaseOutbreaks}
              mentalHealthReports={data.mentalHealthReports}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 md:mt-6">
        <Tabs defaultValue="outbreaks" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="outbreaks">Disease Outbreaks</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            {/* <TabsTrigger value="mental">Mental Health</TabsTrigger> */}
          </TabsList>
          <TabsContent value="outbreaks" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.diseaseOutbreaks.map((outbreak) => (
                <AlertCard
                  key={outbreak.id}
                  title={outbreak.disease}
                  description={`${outbreak.affectedAreas.reduce(
                    (sum, area) => sum + area.caseCount,
                    0
                  )} cases reported`}
                  severity={outbreak.severity}
                  location={outbreak.affectedAreas
                    .map((area) => area.name)
                    .join(", ")}
                  date={new Date(outbreak.startDate).toLocaleDateString()}
                  source={outbreak.source}
                  actionLink={`/outbreaks/${outbreak.id}`}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="environmental" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AlertCard
                title="High Air Pollution"
                description="PM2.5 levels exceeding safe limits in multiple areas"
                severity={
                  data.environmentalData.airQuality.aqi > 150
                    ? "high"
                    : "medium"
                }
                location="Andheri, Bandra, Dharavi"
                date={new Date().toLocaleDateString()}
                source={data.environmentalData.source}
                actionLink="/pollution"
              />
              <AlertCard
                title="Water Contamination Risk"
                description="Elevated turbidity levels detected in water supply"
                severity="medium"
                location="Worli, Dadar"
                date={new Date().toLocaleDateString()}
                source={data.environmentalData.source}
                actionLink="/pollution"
              />
            </div>
          </TabsContent>
          {/* <TabsContent value="mental" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.mentalHealthReports.map((report) => (
                <AlertCard
                  key={report.id}
                  title={`${report.area} Mental Health Report`}
                  description={`Stress: ${report.stressLevel}/10, Anxiety: ${report.anxietyLevel}/10`}
                  severity={
                    report.stressLevel > 7 ||
                    report.anxietyLevel > 7 ||
                    report.depressionLevel > 7
                      ? "high"
                      : report.stressLevel > 5 ||
                        report.anxietyLevel > 5 ||
                        report.depressionLevel > 5
                      ? "medium"
                      : "low"
                  }
                  location={report.area}
                  date={new Date(report.timestamp).toLocaleDateString()}
                  source={report.source}
                  actionLink="/mental-health"
                />
              ))}
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
