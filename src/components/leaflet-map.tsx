"use client";

import { Card } from "@/components/ui/card";
import type {
  DiseaseOutbreak,
  GeoLocation,
  MentalHealthReport,
  SensorData,
} from "@/lib/types";
import "leaflet/dist/leaflet.css";
import type React from "react";
import { useEffect, useRef } from "react";

interface LeafletMapProps {
  sensors?: SensorData[];
  outbreaks?: DiseaseOutbreak[];
  mentalHealthReports?: MentalHealthReport[];
  center?: GeoLocation;
  zoom?: number;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  sensors = [],
  outbreaks = [],
  mentalHealthReports = [],
  center,
  zoom = 12,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Clear markers safely
  const clearMarkers = () => {
    if (leafletMapRef.current && markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker && typeof marker.remove === "function") {
          marker.remove();
        }
      });
      markersRef.current = [];
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        // If map already exists, clean up
        if (leafletMapRef.current) {
          clearMarkers();
          leafletMapRef.current.remove();
        }

        // Create new map
        const map = L.map(mapRef.current as HTMLElement).setView(
          [center?.latitude || 19.076, center?.longitude || 72.8777],
          zoom
        );

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        leafletMapRef.current = map;

        // Delay invalidation until the container is fully rendered
        setTimeout(() => {
          if (map && map.getContainer()) {
            map.invalidateSize();
          }
        }, 500);

        // Update resize listener to check for container existence
        const handleResize = () => {
          if (map && map.getContainer()) {
            // map.invalidateSize();
          }
        };

        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        clearMarkers();
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []); // Run only once on mount

  // Update markers when data changes
  useEffect(() => {
    const updateMarkers = async () => {
      if (!leafletMapRef.current) return;

      try {
        const L = (await import("leaflet")).default;

        // Clear existing markers
        clearMarkers();

        // Add sensor markers
        sensors.forEach((sensor) => {
          const marker = L.circleMarker(
            [sensor.location.latitude, sensor.location.longitude],
            {
              radius: 8,
              fillColor:
                sensor.type === "air"
                  ? "#ff5252"
                  : sensor.type === "water"
                  ? "#2196f3"
                  : "#ffc107",
              fillOpacity: 0.8,
              color: "white",
              weight: 1,
            }
          ).addTo(leafletMapRef.current).bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">${sensor.type.toUpperCase()} Sensor</h3>
                <p>ID: ${sensor.id}</p>
                <p>Reading: ${sensor.reading} ${sensor.unit}</p>
                <p>Last Updated: ${new Date(
                  sensor.lastUpdated
                ).toLocaleString()}</p>
              </div>
            `);

          markersRef.current.push(marker);
        });

        // Add outbreak markers
        outbreaks.forEach((outbreak) => {
          outbreak.affectedAreas.forEach((area) => {
            const color =
              outbreak.severity === "critical"
                ? "#d32f2f"
                : outbreak.severity === "high"
                ? "#f44336"
                : outbreak.severity === "medium"
                ? "#ff9800"
                : "#4caf50";

            const marker = L.circleMarker(
              [area.location.latitude, area.location.longitude],
              {
                radius: Math.min(10 + area.caseCount / 10, 20),
                fillColor: color,
                fillOpacity: 0.7,
                color: "white",
                weight: 1,
              }
            ).addTo(leafletMapRef.current).bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold">${outbreak.disease}</h3>
                  <p>Area: ${area.name}</p>
                  <p>Cases: ${area.caseCount}</p>
                  <p>Severity: ${outbreak.severity}</p>
                  <p>Status: ${outbreak.status}</p>
                </div>
              `);

            markersRef.current.push(marker);
          });
        });

        // Add mental health report markers
        mentalHealthReports.forEach((report) => {
          const marker = L.circleMarker(
            [report.location.latitude, report.location.longitude],
            {
              radius: 8,
              fillColor: "#4caf50",
              fillOpacity: 0.7,
              color: "white",
              weight: 1,
            }
          ).addTo(leafletMapRef.current).bindPopup(`
              <div class="p-2">
                <h3 class="font-bold">Mental Health Report</h3>
                <p>Area: ${report.area}</p>
                <p>Stress Level: ${report.stressLevel}/10</p>
                <p>Anxiety Level: ${report.anxietyLevel}/10</p>
                <p>Depression Level: ${report.depressionLevel}/10</p>
                <p>Reports: ${report.reportCount}</p>
              </div>
            `);

          markersRef.current.push(marker);
        });

        // Fit map bounds if markers exist
        if (markersRef.current.length > 0) {
          const group = L.featureGroup(markersRef.current);
          leafletMapRef.current.fitBounds(group.getBounds(), {
            padding: [30, 30],
          });
        }

        // Invalidate size to ensure proper rendering
        if (leafletMapRef.current && leafletMapRef.current._container) {
          leafletMapRef.current.invalidateSize();
        }
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    };

    if (leafletMapRef.current) {
      updateMarkers();
    }
  }, [sensors, outbreaks, mentalHealthReports]);

  // Update map center and zoom when props change
  useEffect(() => {
    if (leafletMapRef.current && center) {
      leafletMapRef.current.setView([center.latitude, center.longitude], zoom);
      if (leafletMapRef.current && leafletMapRef.current._container) {
        leafletMapRef.current.invalidateSize();
      }
    }
  }, [center, zoom]);

  return (
    <Card className="w-full h-full overflow-hidden">
      <div
        ref={mapRef}
        className="w-full h-full min-h-[300px] md:min-h-[500px]"
        style={{ zIndex: 0 }}
      />
    </Card>
  );
};

export default LeafletMap;
