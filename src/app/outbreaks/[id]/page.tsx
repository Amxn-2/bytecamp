"use client";

import MapView from "@/components/map-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchDiseaseOutbreaks } from "@/lib/api";
import type { DiseaseOutbreak } from "@/lib/types";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Loader2,
  MapPin,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OutbreakDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [outbreak, setOutbreak] = useState<DiseaseOutbreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const outbreakData = await fetchDiseaseOutbreaks();

        if (!outbreakData) {
          toast.error("Failed to load outbreak data");
          return;
        }

        const foundOutbreak = outbreakData.find((o) => o.id === params.id);

        if (!foundOutbreak) {
          toast.error("Outbreak not found");
          router.push("/outbreaks");
          return;
        }

        setOutbreak(foundOutbreak);
      } catch (error) {
        console.error("Error loading outbreak data:", error);
        toast.error("Failed to load outbreak data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!outbreak) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h2 className="text-xl font-semibold">Outbreak not found</h2>
        <p className="text-muted-foreground">
          The requested outbreak could not be found.
        </p>
        <Button onClick={() => router.push("/outbreaks")} className="mt-4">
          Back to Outbreaks
        </Button>
      </div>
    );
  }

  // Calculate total cases
  const totalCases = outbreak.affectedAreas.reduce(
    (sum, area) => sum + area.caseCount,
    0
  );

  // Get severity color
  const getSeverityColor = () => {
    switch (outbreak.severity) {
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="container py-6">
      <Button
        variant="ghost"
        className="mb-6 pl-0 flex items-center gap-2"
        onClick={() => router.push("/outbreaks")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Outbreaks
      </Button>

      <Card className={`border-l-4 ${getSeverityColor()}`}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                {outbreak.disease}
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Started on {new Date(outbreak.startDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  outbreak.status === "active"
                    ? "destructive"
                    : outbreak.status === "contained"
                    ? "default"
                    : "secondary"
                }
              >
                {outbreak.status.charAt(0).toUpperCase() +
                  outbreak.status.slice(1)}
              </Badge>
              <Badge
                variant={
                  outbreak.severity === "low"
                    ? "secondary"
                    : outbreak.severity === "medium"
                    ? "outline"
                    : outbreak.severity === "high"
                    ? "default"
                    : "destructive"
                }
              >
                {outbreak.severity.charAt(0).toUpperCase() +
                  outbreak.severity.slice(1)}{" "}
                Severity
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCases}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Affected Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {outbreak.affectedAreas.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.ceil(
                    (new Date().getTime() -
                      new Date(outbreak.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Affected Areas</CardTitle>
              <CardDescription>
                Geographic distribution of {outbreak.disease} cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapView outbreaks={[outbreak]} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {outbreak.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Prevention Measures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {outbreak.preventionMeasures.map((measure, index) => (
                    <li key={index}>{measure}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Case Distribution</CardTitle>
              <CardDescription>
                Breakdown of cases by area (Source:{" "}
                <a
                  href={outbreak.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  {outbreak.source.name}
                </a>
                )
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outbreak.affectedAreas.map((area, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{area.name}</span>
                      </div>
                      <span className="font-bold">{area.caseCount} cases</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${
                            (area.caseCount /
                              Math.max(
                                ...outbreak.affectedAreas.map(
                                  (a) => a.caseCount
                                )
                              )) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    {index < outbreak.affectedAreas.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button variant="outline" onClick={() => router.push("/outbreaks")}>
            Back to All Outbreaks
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => window.open(outbreak.source.url, "_blank")}
            >
              View Source
            </Button>
            <Button>Report New Case</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
