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
import { useHealthStore } from "@/lib/healthStore";
import { AlertTriangle, Loader2, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

export default function PollutionPage() {
  const [loading, setLoading] = useState(true);

  const healthData = useHealthStore((state) => state.healthData);

  useEffect(() => {
    async function loadData() {
      try {
        // const environmentalData = await fetchEnvironmentalData();
        // setData(environmentalData);
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

  if (!healthData?.environmentalData) {
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
    { name: "PM2.5", value: healthData?.environmentalData.airQuality.pm25 },
    { name: "PM10", value: healthData?.environmentalData.airQuality.pm10 },
    { name: "O3", value: healthData?.environmentalData.airQuality.o3 },
    { name: "NO2", value: healthData?.environmentalData.airQuality.no2 },
    { name: "SO2", value: healthData?.environmentalData.airQuality.so2 },
    { name: "CO", value: healthData?.environmentalData.airQuality.co! * 10 }, // Scale up CO for visibility
  ];

  // Mock historical data for line chart (latest month reflects current air quality)
  const historicalData = [
    { date: "Jan", aqi: 120, pm25: 60, pm10: 90 },
    { date: "Feb", aqi: 140, pm25: 70, pm10: 100 },
    { date: "Mar", aqi: 160, pm25: 80, pm10: 120 },
    { date: "Apr", aqi: 180, pm25: 90, pm10: 140 },
    { date: "May", aqi: 150, pm25: 75, pm10: 110 },
    { date: "Jun", aqi: 130, pm25: 65, pm10: 95 },
    {
      date: "Jul",
      aqi: healthData?.environmentalData.airQuality.aqi,
      pm25: healthData?.environmentalData.airQuality.pm25,
      pm10: healthData?.environmentalData.airQuality.pm10,
    },
  ];

  const airChartData = [
    { parameter: "AQI", value: healthData?.environmentalData.airQuality.aqi },
    {
      parameter: "PM2.5",
      value: healthData?.environmentalData.airQuality.pm25,
    },
    { parameter: "PM10", value: healthData?.environmentalData.airQuality.pm10 },
    { parameter: "O₃", value: healthData?.environmentalData.airQuality.o3 },
    { parameter: "NO₂", value: healthData?.environmentalData.airQuality.no2 },
    { parameter: "SO₂", value: healthData?.environmentalData.airQuality.so2 },
    { parameter: "CO", value: healthData?.environmentalData.airQuality.co },
  ];

  const waterChartData = [
    { parameter: "pH", value: healthData?.environmentalData.waterQuality.ph },
    {
      parameter: "Turbidity",
      value: healthData?.environmentalData.waterQuality.turbidity,
    },
    {
      parameter: "Dissolved O₂",
      value: healthData?.environmentalData.waterQuality.dissolvedOxygen,
    },
    {
      parameter: "Conductivity",
      value: healthData?.environmentalData.waterQuality.conductivity,
    },
    {
      parameter: "Temperature",
      value: healthData?.environmentalData.waterQuality.temperature,
    },
  ];

  const noiseChartData = [
    {
      parameter: "Average",
      value: healthData?.environmentalData.noiseLevel.average,
    },
    { parameter: "Peak", value: healthData?.environmentalData.noiseLevel.peak },
  ];

  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-mono">
        Pollution Data
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DataCard
          title="US Air Quality Index (AQI)"
          value={healthData.environmentalData.airQuality.aqi}
          description="Current AQI level based on US standards"
          status={
            healthData.environmentalData.airQuality.aqi < 50
              ? "great"
              : healthData.environmentalData.airQuality.aqi < 100
              ? "good"
              : healthData.environmentalData.airQuality.aqi < 150
              ? "hazardous"
              : "critical"
          }
          icon={<Wind className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="PM2.5"
          value={`${healthData?.environmentalData.airQuality.pm25} µg/m³`}
          description="Fine particulate matter"
          status={
            healthData?.environmentalData.airQuality.pm25! < 12
              ? "great"
              : healthData?.environmentalData.airQuality.pm25! < 35
              ? "good"
              : "critical"
          }
        />
        <DataCard
          title="PM10"
          value={`${healthData?.environmentalData.airQuality.pm10} µg/m³`}
          description="Coarse particulate matter"
          status={
            healthData?.environmentalData.airQuality.pm25! < 12
              ? "great"
              : healthData?.environmentalData.airQuality.pm25! < 35
              ? "good"
              : "critical"
          }
        />
        <DataCard
          title="Ozone (O₃)"
          value={`${healthData?.environmentalData.airQuality.o3} ppb`}
          description="Ground-level ozone"
          status={
            healthData?.environmentalData.airQuality.pm25! < 12
              ? "great"
              : healthData?.environmentalData.airQuality.pm25! < 35
              ? "good"
              : "critical"
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Air Pollutant Levels</CardTitle>
            <CardDescription>
              Current levels of major air pollutants (µg/m³; CO scaled by 10)
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
              Locations of air quality, water quality, and noise level sensors
              across Mumbai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapView sensors={healthData?.environmentalData.sensors} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 md:mt-8">
        <Tabs defaultValue="air" className="w-full">
          <TabsList className="w-full grid grid-cols-3 gap-2">
            <TabsTrigger value="air">Air Quality</TabsTrigger>
            <TabsTrigger value="water">Water Quality</TabsTrigger>
            <TabsTrigger value="noise">Noise Levels</TabsTrigger>
          </TabsList>

          {/* Air Quality Chart */}
          <TabsContent value="air" className="mt-6">
            <Card className="rounded-xl shadow-lg">
              <CardHeader className="bg-primary/10 rounded-t-xl px-4 py-3">
                <CardTitle className="text-xl font-bold text-primary">
                  Air Quality Parameters
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Latest measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer
                  className="h-[150px] sm:h-[200px] w-full"
                  config={{}}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={airChartData}
                      layout="vertical"
                      margin={{ right: 16 }}
                    >
                      <CartesianGrid horizontal={false} />
                      <YAxis
                        dataKey="parameter"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <XAxis type="number" hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(210, 80%, 85%)" radius={4}>
                        <LabelList
                          dataKey="value"
                          position="insideRight"
                          offset={8}
                          fill="#333"
                          fontSize={12}
                          fontWeight="bold"
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Water Quality Chart */}
          <TabsContent value="water" className="mt-6">
            <Card className="rounded-xl shadow-lg">
              <CardHeader className="bg-primary/10 rounded-t-xl px-4 py-3">
                <CardTitle className="text-xl font-bold text-primary">
                  Water Quality Parameters
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Latest measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer
                  className="h-[150px] sm:h-[200px] w-full"
                  config={{}}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={waterChartData}
                      layout="vertical"
                      margin={{ right: 16 }}
                    >
                      <CartesianGrid horizontal={false} />
                      <YAxis
                        dataKey="parameter"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <XAxis type="number" hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(120, 80%, 85%)" radius={4}>
                        <LabelList
                          dataKey="value"
                          position="insideRight"
                          offset={8}
                          fill="#333"
                          fontSize={12}
                          fontWeight="bold"
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Noise Levels Chart */}
          <TabsContent value="noise" className="mt-6">
            <Card className="rounded-xl shadow-lg">
              <CardHeader className="bg-primary/10 rounded-t-xl px-4 py-3">
                <CardTitle className="text-xl font-bold text-primary">
                  Noise Level Measurements
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Latest readings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <ChartContainer
                  className="h-[150px] sm:h-[200px] w-full"
                  config={{}}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={noiseChartData}
                      layout="vertical"
                      margin={{ right: 16 }}
                    >
                      <CartesianGrid horizontal={false} />
                      <YAxis
                        dataKey="parameter"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <XAxis type="number" hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="hsl(45, 80%, 85%)" radius={4}>
                        <LabelList
                          dataKey="value"
                          position="insideRight"
                          offset={8}
                          fill="#333"
                          fontSize={12}
                          fontWeight="bold"
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
