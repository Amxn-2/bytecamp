"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchEnvironmentalData } from "@/lib/api"
import type { EnvironmentalData } from "@/lib/types"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import DataCard from "@/components/data-card"
import MapView from "@/components/map-view"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts"

export default function PollutionPage() {
  const [data, setData] = useState<EnvironmentalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const environmentalData = await fetchEnvironmentalData()
        setData(environmentalData)
      } catch (error) {
        console.error("Error loading environmental data:", error)
        toast.error("Failed to load environmental data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load data</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    )
  }

  // Prepare air quality data for chart
  const airQualityData = [
    { name: "PM2.5", value: data.airQuality.pm25 },
    { name: "PM10", value: data.airQuality.pm10 },
    { name: "O3", value: data.airQuality.o3 },
    { name: "NO2", value: data.airQuality.no2 },
    { name: "SO2", value: data.airQuality.so2 },
    { name: "CO", value: data.airQuality.co * 10 }, // Scale up CO for visibility
  ]

  // Mock historical data for line chart
  const historicalData = [
    { date: "Jan", aqi: 120, pm25: 60, pm10: 90 },
    { date: "Feb", aqi: 140, pm25: 70, pm10: 100 },
    { date: "Mar", aqi: 160, pm25: 80, pm10: 120 },
    { date: "Apr", aqi: 180, pm25: 90, pm10: 140 },
    { date: "May", aqi: 150, pm25: 75, pm10: 110 },
    { date: "Jun", aqi: 130, pm25: 65, pm10: 95 },
    { date: "Jul", aqi: data.airQuality.aqi, pm25: data.airQuality.pm25, pm10: data.airQuality.pm10 },
  ]

  return (
    <div className="container py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 font-mono">Pollution Data</h1>

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
          status={data.airQuality.pm25 < 12 ? "success" : data.airQuality.pm25 < 35 ? "warning" : "error"}
        />
        <DataCard
          title="PM10"
          value={`${data.airQuality.pm10} µg/m³`}
          description="Coarse particulate matter"
          status={data.airQuality.pm10 < 54 ? "success" : data.airQuality.pm10 < 154 ? "warning" : "error"}
        />
        <DataCard
          title="Ozone (O₃)"
          value={`${data.airQuality.o3} ppb`}
          description="Ground-level ozone"
          status={data.airQuality.o3 < 54 ? "success" : data.airQuality.o3 < 70 ? "warning" : "error"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Air Pollutant Levels</CardTitle>
            <CardDescription>Current levels of major air pollutants in µg/m³ (CO in ppm × 10)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[250px] sm:h-[300px]" config={{}}>
              <BarChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historical Air Quality Trends</CardTitle>
            <CardDescription>7-month trend of air quality parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[250px] sm:h-[300px]" config={{}}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="aqi" stroke="hsl(var(--chart-1))" />
                <Line type="monotone" dataKey="pm25" stroke="hsl(var(--chart-2))" />
                <Line type="monotone" dataKey="pm10" stroke="hsl(var(--chart-3))" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 md:mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Pollution Sensor Map</CardTitle>
            <CardDescription>
              Location of air quality, water quality, and noise level sensors across Mumbai
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
                  Detailed information about air quality parameters and their health impacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">AQI: {data.airQuality.aqi}</h3>
                    <p className="text-sm text-muted-foreground">
                      The Air Quality Index is a measure of how air pollution affects health. Higher values indicate
                      worse air quality.
                    </p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          data.airQuality.aqi < 50
                            ? "bg-green-500"
                            : data.airQuality.aqi < 100
                              ? "bg-yellow-500"
                              : data.airQuality.aqi < 150
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(data.airQuality.aqi / 3, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Good (0)</span>
                      <span>Moderate (100)</span>
                      <span>Unhealthy (200)</span>
                      <span>Hazardous (300+)</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-1">PM2.5: {data.airQuality.pm25} µg/m³</h3>
                      <p className="text-sm text-muted-foreground">
                        Fine particulate matter that can penetrate deep into the lungs and bloodstream.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">PM10: {data.airQuality.pm10} µg/m³</h3>
                      <p className="text-sm text-muted-foreground">
                        Coarse particulate matter that can irritate the eyes, nose, and throat.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Ozone (O₃): {data.airQuality.o3} ppb</h3>
                      <p className="text-sm text-muted-foreground">
                        Ground-level ozone that can trigger respiratory problems.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Nitrogen Dioxide (NO₂): {data.airQuality.no2} ppb</h3>
                      <p className="text-sm text-muted-foreground">
                        Gas that can irritate the respiratory system and contribute to smog formation.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="water" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Water Quality Details</CardTitle>
                <CardDescription>
                  Detailed information about water quality parameters and their health impacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-1">pH Level: {data.waterQuality.ph}</h3>
                      <p className="text-sm text-muted-foreground">
                        Measure of how acidic or basic the water is. Ideal range is 6.5-8.5.
                      </p>
                      <div className="w-full bg-secondary h-2 rounded-full mt-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${(data.waterQuality.ph / 14) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Acidic (0)</span>
                        <span>Neutral (7)</span>
                        <span>Basic (14)</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Turbidity: {data.waterQuality.turbidity} NTU</h3>
                      <p className="text-sm text-muted-foreground">
                        Measure of water clarity. Higher values indicate more particles suspended in water.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dissolved Oxygen: {data.waterQuality.dissolvedOxygen} mg/L</h3>
                      <p className="text-sm text-muted-foreground">
                        Amount of oxygen dissolved in water. Essential for aquatic life.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Temperature: {data.waterQuality.temperature}°C</h3>
                      <p className="text-sm text-muted-foreground">
                        Water temperature affects dissolved oxygen levels and aquatic life.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="noise" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Noise Level Details</CardTitle>
                <CardDescription>Detailed information about noise levels and their health impacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Average Noise Level: {data.noiseLevel.average} dB</h3>
                    <p className="text-sm text-muted-foreground">
                      Average noise level across monitored areas in Mumbai.
                    </p>
                    <div className="w-full bg-secondary h-2 rounded-full mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          data.noiseLevel.average < 60
                            ? "bg-green-500"
                            : data.noiseLevel.average < 75
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min((data.noiseLevel.average / 120) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Low (40dB)</span>
                      <span>Moderate (70dB)</span>
                      <span>High (100dB+)</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold mb-1">
                      Peak Noise Level: {data.noiseLevel.peak} dB at {data.noiseLevel.timeOfPeak}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Highest recorded noise level and the time it occurred. Prolonged exposure to noise above 85dB can
                      cause hearing damage.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-1">Health Impact</h3>
                      <p className="text-sm text-muted-foreground">
                        Prolonged exposure to high noise levels can cause stress, sleep disturbance, and hearing loss.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Noise Sources</h3>
                      <p className="text-sm text-muted-foreground">
                        Major sources include traffic, construction, industrial activities, and public gatherings.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

