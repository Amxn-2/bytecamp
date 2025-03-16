"use client";

import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

interface TemperaturePoint {
  lat: number;
  lng: number;
  value: number;
}

interface WeatherHeatMapProps {
  temperatureData: TemperaturePoint[];
  updateTime: string;
}

const WeatherHeatMap: React.FC<WeatherHeatMapProps> = ({
  temperatureData,
  updateTime,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const heatPolygonsRef = useRef<any[]>([]);

  // Center coordinates for Mumbai
  const mumbaiCenter: [number, number] = [19.076, 72.877];

  // Helper: choose color based on temperature value.
  const getHeatColor = (temp: number): string => {
    if (temp >= 42) return "#ff0000"; // red
    if (temp >= 40) return "#ff7f00"; // orange
    if (temp >= 38) return "#ffff00"; // yellow
    if (temp >= 35) return "#7fff00"; // light green
    return "#00ffff"; // cyan
  };

  // Remove previously added polygons
  const clearHeatPolygons = (L: any) => {
    if (mapInstanceRef.current && heatPolygonsRef.current.length > 0) {
      heatPolygonsRef.current.forEach((poly) => {
        if (poly && typeof poly.remove === "function") {
          poly.remove();
        }
      });
      heatPolygonsRef.current = [];
    }
  };

  // Effect 1: Initialize the map only once.
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      // Only initialize if not already done.
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          mumbaiCenter,
          12
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current!);

        // Optional: add a boundary polygon for Mumbai for context.
        L.polygon(
          [
            [19.297, 72.773],
            [19.297, 73.025],
            [18.89, 73.025],
            [18.89, 72.773],
            [19.297, 72.773],
          ],
          {
            color: "#4285F4",
            weight: 2,
            fillColor: "#4285F4",
            fillOpacity: 0.05,
          }
        ).addTo(mapInstanceRef.current);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Effect 2: Update heatmap polygons when temperatureData or updateTime changes.
  useEffect(() => {
    if (typeof window === "undefined" || !mapInstanceRef.current) return;
    import("leaflet").then((L) => {
      // Remove previous polygons.
      clearHeatPolygons(L);

      if (temperatureData && mapInstanceRef.current) {
        // For each temperature data point, create a diamond polygon.
        // Adjust the offset (in degrees) to control polygon size.
        const offset = 0.005;
        temperatureData.forEach((point) => {
          const color = getHeatColor(point.value);
          const diamondCoords: [number, number][] = [
            [point.lat, point.lng + offset],
            [point.lat + offset, point.lng],
            [point.lat, point.lng - offset],
            [point.lat - offset, point.lng],
          ];
          const poly = L.polygon(diamondCoords, {
            color,
            fillColor: color,
            fillOpacity: 0.6,
            weight: 1,
          }).addTo(mapInstanceRef.current!);
          poly.bindPopup(
            `<div style="font-size: 14px;"><strong>${point.value}°C</strong><br/>Heat intensity</div>`
          );
          heatPolygonsRef.current.push(poly);
        });
      }
    });
  }, [temperatureData, updateTime]);

  // Ensure the map container is correctly sized on updateTime change.
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
      mapInstanceRef.current.invalidateSize();
    }
  }, [updateTime]);

  return (
    <div
      className="w-full rounded-md overflow-hidden border border-border"
      style={{ height: "500px" }}
    >
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default WeatherHeatMap;
