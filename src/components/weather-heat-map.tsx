"use client";

import type React from "react";

import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

// Enhanced type definitions
export interface TemperaturePoint {
  lat: number;
  lng: number;
  value: number;
}

export interface HeatwaveZone {
  polygon: [number, number][];
  temperature: number;
  severity: "moderate" | "high" | "extreme" | "dangerous";
  name?: string;
}

export interface WeatherHeatMapProps {
  temperatureData: TemperaturePoint[];
  updateTime: string;
  heatwaveZones?: HeatwaveZone[];
  showLegend?: boolean;
}

const WeatherHeatMap: React.FC<WeatherHeatMapProps> = ({
  temperatureData,
  updateTime,
  heatwaveZones,
  showLegend = true,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const heatLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any[]>([]);
  const heatwaveLayersRef = useRef<any[]>([]);
  const [visualizationMode, setVisualizationMode] = useState<
    "heatmap" | "markers"
  >("heatmap");

  // Center coordinates for Mumbai
  const mumbaiCenter: [number, number] = [19.076, 72.877];

  // Helper: get intensity based on temperature value
  const getIntensity = (temp: number): number => {
    if (temp >= 45) return 1.0;
    if (temp >= 42) return 0.9;
    if (temp >= 40) return 0.8;
    if (temp >= 38) return 0.6;
    if (temp >= 35) return 0.4;
    if (temp >= 32) return 0.3;
    return 0.2;
  };

  // Get color for temperature
  const getTemperatureColor = (temp: number): string => {
    if (temp >= 45) return "#8B0000"; // dark red
    if (temp >= 42) return "#FF0000"; // red
    if (temp >= 40) return "#FF4500"; // orange red
    if (temp >= 38) return "#FF7F00"; // dark orange
    if (temp >= 35) return "#FFFF00"; // yellow
    if (temp >= 32) return "#7FFF00"; // light green
    return "#00FFFF"; // cyan
  };

  // Get severity color
  const getSeverityColor = (severity: HeatwaveZone["severity"]): string => {
    switch (severity) {
      case "dangerous":
        return "#8B0000";
      case "extreme":
        return "#FF0000";
      case "high":
        return "#FF4500";
      case "moderate":
        return "#FF7F00";
      default:
        return "#FF7F00";
    }
  };

  // Get severity opacity
  const getSeverityOpacity = (severity: HeatwaveZone["severity"]): number => {
    switch (severity) {
      case "dangerous":
        return 0.5;
      case "extreme":
        return 0.4;
      case "high":
        return 0.3;
      case "moderate":
        return 0.2;
      default:
        return 0.3;
    }
  };

  // Clear all layers
  const clearLayers = () => {
    if (heatLayerRef.current) {
      heatLayerRef.current.remove();
      heatLayerRef.current = null;
    }

    markersLayerRef.current.forEach((marker) => marker.remove());
    markersLayerRef.current = [];

    heatwaveLayersRef.current.forEach((layer) => layer.remove());
    heatwaveLayersRef.current = [];
  };

  // Effect 1: Initialize the map only once.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initMap = async () => {
      // Extract default export from leaflet
      const L = (await import("leaflet")).default;

      if (!mapRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          mumbaiCenter,
          12
        );

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
          }
        ).addTo(mapInstanceRef.current);

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

        // Add toggle buttons for visualization modes
        const customControl = new L.Control({ position: "topright" });
        customControl.onAdd = () => {
          const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
          div.innerHTML = `
            <div style="background: white; padding: 5px; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
              <button id="heatmap-btn" style="padding: 4px 8px; margin-right: 4px; background: #4285F4; color: white; border: none; border-radius: 2px; cursor: pointer;">Heatmap</button>
              <button id="markers-btn" style="padding: 4px 8px; background: #f1f1f1; color: #333; border: none; border-radius: 2px; cursor: pointer;">Markers</button>
            </div>
          `;

          L.DomEvent.disableClickPropagation(div);

          setTimeout(() => {
            const heatmapBtn = document.getElementById("heatmap-btn");
            const markersBtn = document.getElementById("markers-btn");

            if (heatmapBtn && markersBtn) {
              heatmapBtn.addEventListener("click", () => {
                setVisualizationMode("heatmap");
                heatmapBtn.style.background = "#4285F4";
                heatmapBtn.style.color = "white";
                markersBtn.style.background = "#f1f1f1";
                markersBtn.style.color = "#333";
              });

              markersBtn.addEventListener("click", () => {
                setVisualizationMode("markers");
                markersBtn.style.background = "#4285F4";
                markersBtn.style.color = "white";
                heatmapBtn.style.background = "#f1f1f1";
                heatmapBtn.style.color = "#333";
              });
            }
          }, 0);

          return div;
        };
        customControl.addTo(mapInstanceRef.current);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Effect 2: Update visualization based on mode and data
  useEffect(() => {
    if (typeof window === "undefined" || !mapInstanceRef.current) return;

    const updateVisualization = async () => {
      // Extract default export from leaflet
      const L = (await import("leaflet")).default;

      clearLayers();

      if (temperatureData && mapInstanceRef.current) {
        if (visualizationMode === "heatmap") {
          const HeatLayer = (await import("leaflet.heat")).default;

          const heatData: [number, number, number][] = temperatureData.map(
            (point) => {
              return [point.lat, point.lng, getIntensity(point.value)];
            }
          );

          heatLayerRef.current = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
              0.2: "#00ffff",
              0.3: "#7fff00",
              0.4: "#FFFF00",
              0.6: "#FFA500",
              0.8: "#FF4500",
              0.9: "#FF0000",
              1.0: "#8B0000",
            },
          }).addTo(mapInstanceRef.current);

          temperatureData.forEach((point) => {
            const marker = L.circleMarker([point.lat, point.lng], {
              radius: 0,
              opacity: 0,
              fillOpacity: 0,
            })
              .bindPopup(
                `<div style="font-size: 14px;">
                  <strong>${point.value}°C</strong><br/>
                  ${
                    point.value >= 42
                      ? '<span style="color: #FF0000;">Extreme Heat</span>'
                      : point.value >= 38
                      ? '<span style="color: #FF7F00;">High Heat</span>'
                      : point.value >= 35
                      ? '<span style="color: #FFFF00;">Moderate Heat</span>'
                      : '<span style="color: #7FFF00;">Normal</span>'
                  }
                  <br/>Location: ${point.lat.toFixed(3)}, ${point.lng.toFixed(
                  3
                )}
                </div>`
              )
              .addTo(mapInstanceRef.current!);

            markersLayerRef.current.push(marker);
          });
        } else {
          temperatureData.forEach((point) => {
            const color = getTemperatureColor(point.value);
            const radius = Math.max(5, (point.value - 30) * 0.8);

            const marker = L.circleMarker([point.lat, point.lng], {
              radius: radius,
              color: color,
              fillColor: color,
              fillOpacity: 0.7,
              weight: 1,
            })
              .bindPopup(
                `<div style="font-size: 14px;">
                  <strong>${point.value}°C</strong><br/>
                  ${
                    point.value >= 42
                      ? '<span style="color: #FF0000;">Extreme Heat</span>'
                      : point.value >= 38
                      ? '<span style="color: #FF7F00;">High Heat</span>'
                      : point.value >= 35
                      ? '<span style="color: #FFFF00;">Moderate Heat</span>'
                      : '<span style="color: #7FFF00;">Normal</span>'
                  }
                  <br/>Location: ${point.lat.toFixed(3)}, ${point.lng.toFixed(
                  3
                )}
                </div>`
              )
              .addTo(mapInstanceRef.current!);

            markersLayerRef.current.push(marker);
          });

          temperatureData
            .filter((point) => point.value >= 40)
            .forEach((point) => {
              const icon = L.divIcon({
                html: `<div style="background: rgba(255,255,255,0.7); padding: 2px 4px; border-radius: 2px; font-weight: bold; color: #FF0000;">${point.value}°C</div>`,
                className: "temperature-label",
                iconSize: [40, 20],
                iconAnchor: [20, 10],
              });

              const marker = L.marker([point.lat, point.lng], { icon }).addTo(
                mapInstanceRef.current!
              );

              markersLayerRef.current.push(marker);
            });
        }

        if (heatwaveZones && heatwaveZones.length > 0) {
          heatwaveZones.forEach((zone) => {
            const color = getSeverityColor(zone.severity);
            const opacity = getSeverityOpacity(zone.severity);

            const pulsingIcon = L.divIcon({
              html: `
                <div class="pulsing-circle" style="
                  width: 20px;
                  height: 20px;
                  background-color: ${color};
                  border-radius: 50%;
                  opacity: 0.8;
                  animation: pulse 1.5s infinite;
                ">
                </div>
                <style>
                  @keyframes pulse {
                    0% { transform: scale(0.5); opacity: 0.8; }
                    50% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(0.5); opacity: 0.8; }
                  }
                </style>
              `,
              className: "pulsing-icon",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            const center = zone.polygon.reduce(
              (acc, point) => [
                acc[0] + point[0] / zone.polygon.length,
                acc[1] + point[1] / zone.polygon.length,
              ],
              [0, 0]
            );

            const marker = L.marker(center as [number, number], {
              icon: pulsingIcon,
            }).addTo(mapInstanceRef.current!);

            heatwaveLayersRef.current.push(marker);

            const polygon = L.polygon(zone.polygon, {
              color: color,
              fillColor: color,
              fillOpacity: opacity,
              weight: 2,
              dashArray: "5, 5",
            })
              .bindPopup(
                `
                <div style="font-size: 14px;">
                  <strong>Heatwave Zone</strong><br/>
                  Severity: ${zone.severity}<br/>
                  Temperature: ${zone.temperature}°C<br/>
                  ${zone.name ? `Area: ${zone.name}` : ""}
                </div>
              `
              )
              .addTo(mapInstanceRef.current!);

            heatwaveLayersRef.current.push(polygon);
          });
        } else {
          const extremePoints = temperatureData.filter(
            (point) => point.value >= 42
          );
          const highPoints = temperatureData.filter(
            (point) => point.value >= 40 && point.value < 42
          );

          if (extremePoints.length > 0) {
            extremePoints.forEach((point) => {
              const circle = L.circle([point.lat, point.lng], {
                radius: 800,
                color: "#FF0000",
                weight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.2,
                dashArray: "5, 5",
              })
                .bindPopup(
                  `
                  <div style="font-size: 14px;">
                    <strong>Extreme Heat Zone</strong><br/>
                    Temperature: ${point.value}°C<br/>
                    <span style="color: #FF0000;">Dangerous conditions</span>
                  </div>
                `
                )
                .addTo(mapInstanceRef.current!);

              heatwaveLayersRef.current.push(circle);

              const pulsingIcon = L.divIcon({
                html: `
                  <div class="pulsing-circle" style="
                    width: 20px;
                    height: 20px;
                    background-color: #FF0000;
                    border-radius: 50%;
                    opacity: 0.8;
                    animation: pulse 1.5s infinite;
                  ">
                  </div>
                  <style>
                    @keyframes pulse {
                      0% { transform: scale(0.5); opacity: 0.8; }
                      50% { transform: scale(1); opacity: 0.5; }
                      100% { transform: scale(0.5); opacity: 0.8; }
                    }
                  </style>
                `,
                className: "pulsing-icon",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });

              const marker = L.marker([point.lat, point.lng], {
                icon: pulsingIcon,
              }).addTo(mapInstanceRef.current!);

              heatwaveLayersRef.current.push(marker);
            });
          }

          if (highPoints.length > 0) {
            highPoints.forEach((point) => {
              const circle = L.circle([point.lat, point.lng], {
                radius: 600,
                color: "#FF7F00",
                weight: 2,
                fillColor: "#FF7F00",
                fillOpacity: 0.15,
                dashArray: "5, 5",
              })
                .bindPopup(
                  `
                  <div style="font-size: 14px;">
                    <strong>High Heat Zone</strong><br/>
                    Temperature: ${point.value}°C<br/>
                    <span style="color: #FF7F00;">Take precautions</span>
                  </div>
                `
                )
                .addTo(mapInstanceRef.current!);

              heatwaveLayersRef.current.push(circle);
            });
          }
        }
      }
    };

    updateVisualization();
  }, [temperatureData, updateTime, visualizationMode, heatwaveZones]);

  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.getContainer()) {
      mapInstanceRef.current.invalidateSize();
    }
  }, [updateTime]);

  return (
    <div className="space-y-2">
      <div
        className="w-full rounded-md overflow-hidden border border-border relative"
        style={{ height: "500px", zIndex: 0 }}
      >
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />

        {showLegend && (
          <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md z-50 border border-border">
            <h4 className="text-xs font-medium mb-1 text-foreground">
              Temperature Scale
            </h4>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: "#8B0000" }}
                />
                <span className="text-foreground">≥ 45°C (Dangerous)</span>
              </div>
              <div className="flex items-center text-xs">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: "#FF0000" }}
                />
                <span className="text-foreground">42-45°C (Extreme)</span>
              </div>
              <div className="flex items-center text-xs">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: "#FF4500" }}
                />
                <span className="text-foreground">40-42°C (Very Hot)</span>
              </div>
              <div className="flex items-center text-xs">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: "#FF7F00" }}
                />
                <span className="text-foreground">38-40°C (Hot)</span>
              </div>
              <div className="flex items-center text-xs">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: "#FFFF00" }}
                />
                <span className="text-foreground">35-38°C (Warm)</span>
              </div>
              <div className="flex items-center text-xs">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: "#7FFF00" }}
                />
                <span className="text-foreground">32-35°C (Moderate)</span>
              </div>
              <div className="flex items-center text-xs">
                <div
                  className="w-4 h-4 mr-2 rounded-sm"
                  style={{ backgroundColor: "#00FFFF" }}
                />
                <span className="text-foreground">32°C (Cool)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Last updated: {new Date(updateTime).toLocaleString()}
      </div>
    </div>
  );
};

export default WeatherHeatMap;
