"use client";

import AlertCard from "@/components/alert-card";
import MapView from "@/components/map-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHealthStore } from "@/lib/healthStore";
import { AlertTriangle, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OutbreaksPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const healthData = useHealthStore((state) => state.healthData);
  useEffect(() => {
    async function loadData() {
      try {
        // const outbreakData = await fetchDiseaseOutbreaks();
        // setData(outbreakData);
      } catch (error) {
        console.error("Error loading outbreak data:", error);
        toast.error("Failed to load outbreak data");
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

  if (!healthData?.diseaseOutbreaks) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load data</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  // Filter outbreaks based on search term and severity filter
  const filteredOutbreaks = healthData?.diseaseOutbreaks.filter((outbreak) => {
    const matchesSearch =
      outbreak.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outbreak.affectedAreas.some((area) =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSeverity =
      filterSeverity === "all" || outbreak.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  // Calculate total cases
  const totalCases = healthData?.diseaseOutbreaks.reduce((sum, outbreak) => {
    return (
      sum +
      outbreak.affectedAreas.reduce(
        (areaSum, area) => areaSum + area.caseCount,
        0
      )
    );
  }, 0);

  // Get all affected areas
  const allAffectedAreas = healthData?.diseaseOutbreaks.flatMap(
    (outbreak) => outbreak.affectedAreas
  );

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6 font-mono">
        Disease Outbreak Alerts
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Outbreaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {healthData?.diseaseOutbreaks.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Active outbreaks:{" "}
              {
                healthData?.diseaseOutbreaks.filter(
                  (o) => o.status === "active"
                ).length
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCases}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Across {allAffectedAreas.length} affected areas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                healthData?.diseaseOutbreaks.filter(
                  (o) => o.severity === "critical" || o.severity === "high"
                ).length
              }
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              High or critical severity outbreaks
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Outbreak Map</CardTitle>
          <CardDescription>
            Geographic distribution of disease outbreaks across Mumbai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MapView outbreaks={healthData?.diseaseOutbreaks} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Disease Outbreaks</CardTitle>
            <CardDescription>
              Detailed information about current disease outbreaks
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by disease or area..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredOutbreaks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  No outbreaks match your search criteria
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredOutbreaks.map((outbreak) => (
                  <AlertCard
                    key={outbreak.id}
                    title={outbreak.disease}
                    description={`${outbreak.affectedAreas.reduce(
                      (sum, area) => sum + area.caseCount,
                      0
                    )} cases reported across ${
                      outbreak.affectedAreas.length
                    } areas`}
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
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Prevention Guidelines</CardTitle>
            <CardDescription>
              General guidelines to prevent disease spread
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Personal Hygiene</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Wash hands frequently with soap and water</li>
                  <li>Use hand sanitizer when soap is not available</li>
                  <li>Cover mouth and nose when coughing or sneezing</li>
                  <li>Avoid touching face with unwashed hands</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Environmental Measures</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Eliminate standing water to prevent mosquito breeding</li>
                  <li>Keep food preparation areas clean</li>
                  <li>Ensure proper waste disposal</li>
                  <li>Maintain good ventilation in indoor spaces</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Social Practices</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Maintain physical distance in crowded areas</li>
                  <li>Wear masks in high-risk environments</li>
                  <li>Avoid close contact with sick individuals</li>
                  <li>Stay home when feeling unwell</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Medical Advice</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Seek medical attention promptly when symptoms appear</li>
                  <li>Follow vaccination schedules</li>
                  <li>Complete full course of prescribed medications</li>
                  <li>Stay informed about local health advisories</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
