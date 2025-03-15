"use client";

import DataCard from "@/components/data-card";
import MapView from "@/components/map-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchEnvironmentalData } from "@/lib/api";
import type { EnvironmentalData } from "@/lib/types";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

export default function PollutionPage() {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const environmentalData = await fetchEnvironmentalData();
        setData(environmentalData);
      } catch (error) {
        console.error("Error loading environmental data:", error);
        toast.error("Failed to load environmental data");
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

  // Prepare air quality data for chart
  const airQualityData = [
    { name: "PM2.5", value: data.airQuality.pm25 },
    { name: "PM10", value: data.airQuality.pm10 },
    { name: "O3", value: data.airQuality.o3 },
    { name: "NO2", value: data.airQuality.no2 },
    { name: "SO2", value: data.airQuality.so2 },
    { name: "CO", value: data.airQuality.co * 10 }, // Scale up CO for visibility
  ];

  // Mock historical data for line chart
  const historicalData = [
    { date: "Jan", aqi: 120, pm25: 60, pm10: 90 },
    { date: "Feb", aqi: 140, pm25: 70, pm10: 100 },
    { date: "Mar", aqi: 160, pm25: 80, pm10: 120 },
    { date: "Apr", aqi: 180, pm25: 90, pm10: 140 },
    { date: "May", aqi: 150, pm25: 75, pm10: 110 },
    { date: "Jun", aqi: 130, pm25: 65, pm10: 95 },
    {
      date: "Jul",
      aqi: data.airQuality.aqi,
      pm25: data.airQuality.pm25,
      pm10: data.airQuality.pm10,
    },
  ];

  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-mono">
        Pollution Data
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DataCard
          title="Air Quality Index"
          value={data.airQuality.aqi}
          description="Current AQI level"
          status={
            data.airQuality.aqi < 50
              ? "success"
              : data.airQuality.aqi < 100
              ? "info"
              : data.airQuality.aqi < 150
              ? "warning"
              : "error"
          }
        />
        <DataCard
          title="PM2.5"
          value={`${data.airQuality.pm25} µg/m³`}
          description="Fine particulate matter"
          status={
            data.airQuality.pm25 < 12
              ? "success"
              : data.airQuality.pm25 < 35
              ? "warning"
              : "error"
          }
        />
        <DataCard
          title="PM10"
          value={`${data.airQuality.pm10} µg/m³`}
          description="Coarse particulate matter"
          status={
            data.airQuality.pm10 < 54
              ? "success"
              : data.airQuality.pm10 < 154
              ? "warning"
              : "error"
          }
        />
        <DataCard
          title="Ozone (O₃)"
          value={`${data.airQuality.o3} ppb`}
          description="Ground-level ozone"
          status={
            data.airQuality.o3 < 54
              ? "success"
              : data.airQuality.o3 < 70
              ? "warning"
              : "error"
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Air Pollutant Levels</CardTitle>
            <CardDescription>
              Current levels of major air pollutants in µg/m³ (CO in ppm × 10)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[250px] sm:h-[300px] w-full"
              config={{}}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={airQualityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Air Quality Trends</CardTitle>
            <CardDescription>
              7-month trend of air quality parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[250px] sm:h-[300px] w-full"
              config={{}}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke="hsl(var(--chart-1))"
                  />
                  <Line
                    type="monotone"
                    dataKey="pm25"
                    stroke="hsl(var(--chart-2))"
                  />
                  <Line
                    type="monotone"
                    dataKey="pm10"
                    stroke="hsl(var(--chart-3))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 md:mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Pollution Sensor Map</CardTitle>
            <CardDescription>
              Location of air quality, water quality, and noise level sensors
              across Mumbai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapView sensors={data.sensors} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 md:mt-6">
        <Tabs defaultValue="air" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="air">Air Quality</TabsTrigger>
            <TabsTrigger value="water">Water Quality</TabsTrigger>
            <TabsTrigger value="noise">Noise Levels</TabsTrigger>
          </TabsList>
          <TabsContent value="air" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Details</CardTitle>
                <CardDescription>
                  Detailed information about air quality parameters and their
                  health impacts
                </CardDescription>
              </CardHeader>
              <CardContent>{/* Air quality details content */}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="water" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Water Quality Details</CardTitle>
                <CardDescription>
                  Detailed information about water quality parameters and their
                  health impacts
                </CardDescription>
              </CardHeader>
              <CardContent>{/* Water quality details content */}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="noise" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Noise Level Details</CardTitle>
                <CardDescription>
                  Detailed information about noise levels and their health
                  impacts
                </CardDescription>
              </CardHeader>
              <CardContent>{/* Noise level details content */}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
