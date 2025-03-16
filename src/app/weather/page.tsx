"use client";

import AlertCard from "@/components/alert-card";
import DataCard from "@/components/data-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealthStore } from "@/lib/healthStore";
import {
  AlertTriangle,
  Calendar,
  Droplets,
  Loader2,
  Thermometer,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WeatherHeatMap = dynamic(() => import("@/components/weather-heat-map"), {
  ssr: false,
});
// -- Type Definitions --
interface HeatwaveArea {
  name: string;
  temperature: number;
  heatIndex: "Extreme" | "Danger" | string;
}

interface HeatwaveAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  location: string;
  date: string;
  source: {
    name: string;
    url: string;
  };
  actionLink: string;
}

interface HeatwaveCurrent {
  isActive: boolean;
  temperature: number;
  humidity: number;
  startDate: string;
  affectedAreas: HeatwaveArea[];
  severity: string;
  alerts: HeatwaveAlert[];
}

interface HeatwaveForecastPrediction {
  date: string;
  probability: number;
  maxTemp: number;
  minTemp: number;
}

interface HeatwaveForecast {
  predictions: HeatwaveForecastPrediction[];
  advisories: string[];
}

interface HeatwaveData {
  current: HeatwaveCurrent;
  forecast: HeatwaveForecast;
}

interface FloodAffectedArea {
  name: string;
  level: "Minor" | "Moderate" | "Severe" | string;
  depth: number;
}

interface FloodAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  location: string;
  date: string;
  source: {
    name: string;
    url: string;
  };
  actionLink: string;
}

interface FloodWaterLogging {
  isPresent: boolean;
  affectedAreas: FloodAffectedArea[];
}

interface FloodCurrent {
  isActive: boolean;
  waterLogging: FloodWaterLogging;
  alerts: FloodAlert[];
}

interface FloodForecastPrediction {
  date: string;
  probability: number;
  rainfall: string;
}

interface FloodRisk {
  date: string;
  probability: number;
  expectedAreas: string[];
  severity: "low" | "medium" | "high";
}

interface FloodForecast {
  predictions: FloodForecastPrediction[];
  floodRisk: FloodRisk;
  advisories: string[];
}

interface FloodData {
  current: FloodCurrent;
  forecast: FloodForecast;
}

interface TemperaturePoint {
  lat: number;
  lng: number;
  value: number;
}

interface TemperatureMap {
  regions: TemperaturePoint[][];
  updateTime: string;
}

interface WeatherData {
  heatwave: HeatwaveData;
  floods: FloodData;
  temperatureMap: TemperatureMap;
}
// -- End Type Definitions --

export default function WeatherPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // healthData is pulled from the health store if needed
  const healthData = useHealthStore((state) => state.healthData);

  useEffect(() => {
    async function loadWeatherData() {
      try {
        // Replace this with your API call in a real implementation.
        const mockData: WeatherData = {
          heatwave: {
            current: {
              isActive: true,
              temperature: 42.3,
              humidity: 78,
              startDate: "2025-03-14",
              affectedAreas: [
                { name: "Dadar", temperature: 43.1, heatIndex: "Extreme" },
                { name: "Andheri", temperature: 42.8, heatIndex: "Extreme" },
                { name: "Bandra", temperature: 41.9, heatIndex: "Danger" },
                { name: "Worli", temperature: 41.2, heatIndex: "Danger" },
                { name: "Colaba", temperature: 40.5, heatIndex: "Danger" },
              ],
              severity: "high",
              alerts: [
                {
                  id: "hw-1",
                  title: "Extreme Heat Warning",
                  description:
                    "Temperatures exceeding 42°C expected to continue for next 48 hours",
                  severity: "high",
                  location: "Mumbai Metropolitan Region",
                  date: "2025-03-16",
                  source: {
                    name: "IMD Mumbai",
                    url: "https://mausam.imd.gov.in/",
                  },
                  actionLink: "/weather/heatwave-1",
                },
              ],
            },
            forecast: {
              predictions: [
                {
                  date: "2025-03-17",
                  probability: 95,
                  maxTemp: 43.1,
                  minTemp: 32.4,
                },
                {
                  date: "2025-03-18",
                  probability: 90,
                  maxTemp: 42.8,
                  minTemp: 32.1,
                },
                {
                  date: "2025-03-19",
                  probability: 75,
                  maxTemp: 41.2,
                  minTemp: 31.8,
                },
                {
                  date: "2025-03-20",
                  probability: 60,
                  maxTemp: 40.1,
                  minTemp: 31.5,
                },
                {
                  date: "2025-03-21",
                  probability: 40,
                  maxTemp: 38.5,
                  minTemp: 30.2,
                },
              ],
              advisories: [
                "Stay hydrated and avoid outdoor activities between 11am-4pm",
                "Check on elderly and vulnerable individuals regularly",
                "Use cooling centers if home temperatures exceed safe levels",
              ],
            },
          },
          floods: {
            current: {
              isActive: false,
              waterLogging: {
                isPresent: true,
                affectedAreas: [
                  { name: "Hindmata", level: "Minor", depth: 0.3 },
                  { name: "Milan Subway", level: "Minor", depth: 0.4 },
                  { name: "Andheri Subway", level: "Minor", depth: 0.25 },
                ],
              },
              alerts: [
                {
                  id: "fl-1",
                  title: "Waterlogging Alert",
                  description:
                    "Minor waterlogging reported in low-lying areas due to recent rainfall",
                  severity: "medium",
                  location: "Hindmata, Milan Subway, Andheri Subway",
                  date: "2025-03-16",
                  source: {
                    name: "BMC Disaster Management",
                    url: "https://disastermanagement.bmc.gov.in/",
                  },
                  actionLink: "/weather/waterlog-1",
                },
              ],
            },
            forecast: {
              predictions: [
                { date: "2025-03-17", probability: 10, rainfall: "Light" },
                { date: "2025-03-18", probability: 20, rainfall: "Moderate" },
                { date: "2025-03-19", probability: 40, rainfall: "Heavy" },
                { date: "2025-03-20", probability: 60, rainfall: "Very Heavy" },
                {
                  date: "2025-03-21",
                  probability: 75,
                  rainfall: "Extremely Heavy",
                },
              ],
              floodRisk: {
                date: "2025-03-20",
                probability: 65,
                expectedAreas: [
                  "Hindmata",
                  "Dadar TT",
                  "Parel",
                  "King's Circle",
                  "Milan Subway",
                  "Andheri Subway",
                  "Dahisar",
                ],
                severity: "high",
              },
              advisories: [
                "Avoid travel to flood-prone areas during heavy rainfall",
                "Keep emergency supplies and important documents ready",
                "Follow evacuation orders if issued for your area",
              ],
            },
          },
          temperatureMap: {
            regions: [
              [
                { lat: 19.076, lng: 72.877, value: 43.1 }, // Dadar
                { lat: 19.119, lng: 72.847, value: 42.8 }, // Andheri
                { lat: 19.054, lng: 72.825, value: 41.9 }, // Bandra
                { lat: 19.023, lng: 72.818, value: 41.2 }, // Worli
                { lat: 18.922, lng: 72.82, value: 40.5 }, // Colaba
                { lat: 19.067, lng: 72.9, value: 42.6 }, // Chembur
                { lat: 19.129, lng: 72.931, value: 42.3 }, // Powai
                { lat: 19.172, lng: 72.857, value: 42.1 }, // Borivali
                { lat: 19.231, lng: 72.866, value: 41.8 }, // Dahisar
                { lat: 19.191, lng: 72.984, value: 41.9 }, // Mulund
                { lat: 19.037, lng: 72.873, value: 42.4 }, // Parel
                { lat: 19.145, lng: 72.814, value: 41.7 }, // Malad
                { lat: 19.084, lng: 72.845, value: 42.0 }, // Santacruz
                { lat: 19.039, lng: 72.855, value: 41.5 }, // Mahim
                { lat: 19.042, lng: 72.825, value: 41.3 }, // Dharavi
              ],
            ],
            updateTime: "2025-03-16T13:00:00",
          },
        };
        setWeatherData(mockData);
      } catch (error) {
        console.error("Error loading weather data:", error);
        toast.error("Failed to load weather information");
      } finally {
        setLoading(false);
      }
    }

    loadWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load weather data</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  const getCurrentHeatwaveStatus = (): "active" | "imminent" | "none" => {
    if (weatherData.heatwave.current.isActive) {
      return "active";
    } else if (weatherData.heatwave.forecast.predictions[0].probability > 70) {
      return "imminent";
    } else {
      return "none";
    }
  };

  const getCurrentFloodStatus = ():
    | "active"
    | "imminent"
    | "waterlogging"
    | "none" => {
    if (weatherData.floods.current.isActive) {
      return "active";
    } else if (weatherData.floods.forecast.floodRisk.probability > 70) {
      return "imminent";
    } else if (weatherData.floods.current.waterLogging.isPresent) {
      return "waterlogging";
    } else {
      return "none";
    }
  };

  const currentHeatwaveStatus = getCurrentHeatwaveStatus();
  const currentFloodStatus = getCurrentFloodStatus();

  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-mono">
        Mumbai Weather Events Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DataCard
          title="Current Temperature"
          value={`${weatherData.heatwave.current.temperature}°C`}
          description={`Humidity: ${weatherData.heatwave.current.humidity}%`}
          status={
            weatherData.heatwave.current.temperature > 42
              ? "critical"
              : weatherData.heatwave.current.temperature > 38
              ? "hazardous"
              : weatherData.heatwave.current.temperature > 35
              ? "good"
              : "great"
          }
          icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="Heatwave Status"
          value={
            currentHeatwaveStatus === "active"
              ? "Active"
              : currentHeatwaveStatus === "imminent"
              ? "Imminent"
              : "None"
          }
          description={
            currentHeatwaveStatus === "active"
              ? `Since ${new Date(
                  weatherData.heatwave.current.startDate
                ).toLocaleDateString()}`
              : currentHeatwaveStatus === "imminent"
              ? `${weatherData.heatwave.forecast.predictions[0].probability}% probability tomorrow`
              : "No immediate heatwave threat"
          }
          status={
            currentHeatwaveStatus === "active"
              ? "critical"
              : currentHeatwaveStatus === "imminent"
              ? "hazardous"
              : "great"
          }
          icon={<Thermometer className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="Flood Status"
          value={
            currentFloodStatus === "active"
              ? "Active"
              : currentFloodStatus === "imminent"
              ? "High Risk"
              : currentFloodStatus === "waterlogging"
              ? "Water Logging"
              : "Clear"
          }
          description={
            currentFloodStatus === "active"
              ? "Multiple areas affected"
              : currentFloodStatus === "imminent"
              ? `${
                  weatherData.floods.forecast.floodRisk.probability
                }% risk on ${new Date(
                  weatherData.floods.forecast.floodRisk.date
                ).toLocaleDateString()}`
              : currentFloodStatus === "waterlogging"
              ? `${weatherData.floods.current.waterLogging.affectedAreas.length} areas affected`
              : "No immediate flood threat"
          }
          status={
            currentFloodStatus === "active"
              ? "critical"
              : currentFloodStatus === "imminent"
              ? "hazardous"
              : currentFloodStatus === "waterlogging"
              ? "good"
              : "great"
          }
          icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="5-Day Forecast"
          value={weatherData.floods.forecast.predictions[4].rainfall}
          description={`Rain: ${
            weatherData.floods.forecast.predictions[4].probability
          }% on ${new Date(
            weatherData.floods.forecast.predictions[4].date
          ).toLocaleDateString()}`}
          status={
            weatherData.floods.forecast.predictions[4].rainfall ===
            "Extremely Heavy"
              ? "critical"
              : weatherData.floods.forecast.predictions[4].rainfall ===
                "Very Heavy"
              ? "hazardous"
              : weatherData.floods.forecast.predictions[4].rainfall === "Heavy"
              ? "good"
              : "great"
          }
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="mt-4 md:mt-6">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle>Mumbai Temperature Heatmap</CardTitle>
            <CardDescription>
              Real-time temperature distribution across Mumbai regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeatherHeatMap
              temperatureData={weatherData.temperatureMap.regions[0]}
              updateTime={weatherData.temperatureMap.updateTime}
            />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 md:mt-6">
        <Tabs defaultValue="heatwave" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="heatwave">Heatwave Information</TabsTrigger>
            <TabsTrigger value="floods">Flood Information</TabsTrigger>
          </TabsList>

          <TabsContent value="heatwave" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Heatwave Status</CardTitle>
                  <CardDescription>
                    {weatherData.heatwave.current.isActive
                      ? "Active heatwave conditions in Mumbai"
                      : "No active heatwave at present"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Affected Areas</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {weatherData.heatwave.current.affectedAreas.map(
                        (area, index) => (
                          <div
                            key={index}
                            className="flex justify-between p-2 bg-muted rounded-md"
                          >
                            <span>{area.name}</span>
                            <div className="flex space-x-4">
                              <span>{area.temperature}°C</span>
                              <span
                                className={
                                  area.heatIndex === "Extreme"
                                    ? "text-red-500 font-semibold"
                                    : area.heatIndex === "Danger"
                                    ? "text-orange-500 font-semibold"
                                    : "text-yellow-500 font-semibold"
                                }
                              >
                                {area.heatIndex}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heatwave Forecast</CardTitle>
                  <CardDescription>
                    5-day temperature prediction and heatwave probability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      {weatherData.heatwave.forecast.predictions.map(
                        (prediction, index) => (
                          <div
                            key={index}
                            className="flex justify-between p-2 bg-muted rounded-md"
                          >
                            <span>
                              {new Date(prediction.date).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-4">
                              <span className="text-red-500">
                                {prediction.maxTemp}°C
                              </span>
                              <span className="text-blue-500">
                                {prediction.minTemp}°C
                              </span>
                              <span
                                className={
                                  prediction.probability > 90
                                    ? "text-red-500 font-semibold"
                                    : prediction.probability > 70
                                    ? "text-orange-500 font-semibold"
                                    : prediction.probability > 40
                                    ? "text-yellow-500 font-semibold"
                                    : "text-green-500 font-semibold"
                                }
                              >
                                {prediction.probability}%
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Heat Advisories</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {weatherData.heatwave.forecast.advisories.map(
                          (advisory, index) => (
                            <li key={index} className="text-sm">
                              {advisory}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  {weatherData.heatwave.current.alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      title={alert.title}
                      description={alert.description}
                      severity={alert.severity}
                      location={alert.location}
                      date={alert.date}
                      source={alert.source}
                      actionLink={alert.actionLink}
                      expertVerified={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="floods" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Flood Status</CardTitle>
                  <CardDescription>
                    {weatherData.floods.current.isActive
                      ? "Active flooding in multiple areas"
                      : weatherData.floods.current.waterLogging.isPresent
                      ? "Minor waterlogging reported"
                      : "No active flooding at present"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {weatherData.floods.current.waterLogging.isPresent && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Waterlogging Areas</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {weatherData.floods.current.waterLogging.affectedAreas.map(
                          (area, index) => (
                            <div
                              key={index}
                              className="flex justify-between p-2 bg-muted rounded-md"
                            >
                              <span>{area.name}</span>
                              <div className="flex space-x-4">
                                <span>{area.depth}m</span>
                                <span
                                  className={
                                    area.level === "Severe"
                                      ? "text-red-500 font-semibold"
                                      : area.level === "Moderate"
                                      ? "text-orange-500 font-semibold"
                                      : "text-yellow-500 font-semibold"
                                  }
                                >
                                  {area.level}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rainfall Forecast</CardTitle>
                  <CardDescription>
                    5-day rainfall prediction and flooding probability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      {weatherData.floods.forecast.predictions.map(
                        (prediction, index) => (
                          <div
                            key={index}
                            className="flex justify-between p-2 bg-muted rounded-md"
                          >
                            <span>
                              {new Date(prediction.date).toLocaleDateString()}
                            </span>
                            <div className="flex space-x-4">
                              <span
                                className={
                                  prediction.rainfall === "Extremely Heavy"
                                    ? "text-red-500 font-semibold"
                                    : prediction.rainfall === "Very Heavy"
                                    ? "text-orange-500 font-semibold"
                                    : prediction.rainfall === "Heavy"
                                    ? "text-yellow-500 font-semibold"
                                    : "text-blue-500 font-semibold"
                                }
                              >
                                {prediction.rainfall}
                              </span>
                              <span className="font-semibold">
                                {prediction.probability}%
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {weatherData.floods.forecast.floodRisk.probability > 0 && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <h3 className="font-semibold mb-2 text-amber-800">
                          Flood Risk Warning
                        </h3>
                        <p className="text-sm text-amber-700 mb-2">
                          {weatherData.floods.forecast.floodRisk.probability}%
                          probability of flooding on{" "}
                          {new Date(
                            weatherData.floods.forecast.floodRisk.date
                          ).toLocaleDateString()}
                        </p>
                        <h4 className="text-sm font-medium text-amber-800 mb-1">
                          Expected Areas:
                        </h4>
                        <p className="text-sm text-amber-700">
                          {weatherData.floods.forecast.floodRisk.expectedAreas.join(
                            ", "
                          )}
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Flood Advisories</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {weatherData.floods.forecast.advisories.map(
                          (advisory, index) => (
                            <li key={index} className="text-sm">
                              {advisory}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  {weatherData.floods.current.alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      title={alert.title}
                      description={alert.description}
                      severity={alert.severity}
                      location={alert.location}
                      date={alert.date}
                      source={alert.source}
                      actionLink={alert.actionLink}
                      expertVerified={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
