"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchMentalHealthReports } from "@/lib/api"
import type { MentalHealthReport } from "@/lib/types"
import { toast } from "sonner"
import { Loader2, AlertTriangle, Brain, Heart, Smile, Frown, Meh } from "lucide-react"
import DataCard from "@/components/data-card"
import MapView from "@/components/map-view"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    PieChart,
    Pie,
    Cell,
} from "recharts"

export default function MentalHealthPage() {
  const [data, setData] = useState<MentalHealthReport[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const mentalHealthData = await fetchMentalHealthReports()
        setData(mentalHealthData)
      } catch (error) {
        console.error("Error loading mental health data:", error)
        toast.error("Failed to load mental health data")
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

  // Calculate averages
  const avgStress = data.reduce((sum, report) => sum + report.stressLevel, 0) / data.length
  const avgAnxiety = data.reduce((sum, report) => sum + report.anxietyLevel, 0) / data.length
  const avgDepression = data.reduce((sum, report) => sum + report.depressionLevel, 0) / data.length
  const totalReports = data.reduce((sum, report) => sum + report.reportCount, 0)

  // Prepare sentiment data for chart
  const sentimentData = [
    { name: "Positive", value: data.reduce((sum, report) => sum + report.sentimentAnalysis.positive, 0) / data.length },
    { name: "Negative", value: data.reduce((sum, report) => sum + report.sentimentAnalysis.negative, 0) / data.length },
    { name: "Neutral", value: data.reduce((sum, report) => sum + report.sentimentAnalysis.neutral, 0) / data.length },
  ]

  // Prepare mental health metrics for chart
  const mentalHealthData = data.map((report) => ({
    area: report.area,
    stress: report.stressLevel,
    anxiety: report.anxietyLevel,
    depression: report.depressionLevel,
  }))

  // Colors for pie chart
  const COLORS = ["#0F9E99", "#FF8042", "#FFBB28"]

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6 font-mono">Mental Health Support</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DataCard
          title="Average Stress Level"
          value={`${avgStress.toFixed(1)}/10`}
          description="Based on self-reported data"
          status={avgStress < 4 ? "success" : avgStress < 7 ? "warning" : "error"}
          icon={<Brain className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="Average Anxiety Level"
          value={`${avgAnxiety.toFixed(1)}/10`}
          description="Based on self-reported data"
          status={avgAnxiety < 4 ? "success" : avgAnxiety < 7 ? "warning" : "error"}
          icon={<Heart className="h-4 w-4 text-muted-foreground" />}
        />
        <DataCard
          title="Average Depression Level"
          value={`${avgDepression.toFixed(1)}/10`}
          description="Based on self-reported data"
          status={avgDepression < 4 ? "success" : avgDepression < 7 ? "warning" : "error"}
        />
        <DataCard title="Total Reports" value={totalReports} description="Across all monitored areas" />
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mental Health Metrics by Area</CardTitle>
            <CardDescription>Comparison of stress, anxiety, and depression levels across areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  stress: {
                    label: "Stress",
                    color: "hsl(var(--chart-1))",
                  },
                  anxiety: {
                    label: "Anxiety",
                    color: "hsl(var(--chart-2))",
                  },
                  depression: {
                    label: "Depression",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <BarChart data={mentalHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="stress" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="anxiety" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="depression" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Distribution of positive, negative, and neutral sentiments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Value",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Mental Health Map</CardTitle>
          <CardDescription>Geographic distribution of mental health reports across Mumbai</CardDescription>
        </CardHeader>
        <CardContent>
          <MapView mentalHealthReports={data} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Tabs defaultValue="resources">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Support Resources</TabsTrigger>
            <TabsTrigger value="report">Report Your Experience</TabsTrigger>
          </TabsList>
          <TabsContent value="resources" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mental Health Support Resources</CardTitle>
                <CardDescription>Available resources for mental health support in Mumbai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Helplines</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Mental Health Helpline: 1800-599-0019</li>
                        <li>Crisis Support: 9152987821</li>
                        <li>Suicide Prevention: 022-25521111</li>
                        <li>Women's Support: 1091</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Online Resources</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                          <a href="#" className="text-primary hover:underline">
                            Mumbai Mental Health Portal
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-primary hover:underline">
                            Mindfulness Resources
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-primary hover:underline">
                            Self-Help Guides
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-primary hover:underline">
                            Meditation Apps
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Community Centers</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Mumbai Community Mental Health Center</li>
                        <li>Andheri Wellness Hub</li>
                        <li>Bandra Support Group</li>
                        <li>Dadar Counseling Center</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Self-Care Tips</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Practice daily mindfulness meditation</li>
                        <li>Maintain a regular sleep schedule</li>
                        <li>Stay physically active</li>
                        <li>Connect with supportive friends and family</li>
                        <li>Limit news and social media consumption</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="report" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>Your input helps us understand the mental health landscape in Mumbai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">How would you rate your stress level today?</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Low</span>
                      <span className="text-sm text-muted-foreground">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">1</span>
                      <Progress value={50} className="flex-1" />
                      <span className="text-sm font-medium">10</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">How would you rate your anxiety level today?</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Low</span>
                      <span className="text-sm text-muted-foreground">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">1</span>
                      <Progress value={30} className="flex-1" />
                      <span className="text-sm font-medium">10</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">How would you rate your mood today?</h3>
                    <div className="flex justify-between items-center mt-2">
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-2">
                        <Smile className="h-6 w-6 text-green-500" />
                        <span className="text-xs">Positive</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-2">
                        <Meh className="h-6 w-6 text-yellow-500" />
                        <span className="text-xs">Neutral</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col items-center gap-1 h-auto py-2">
                        <Frown className="h-6 w-6 text-red-500" />
                        <span className="text-xs">Negative</span>
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full">Submit Your Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

