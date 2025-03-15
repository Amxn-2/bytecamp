"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Popup, useMap, CircleMarker } from "react-leaflet"
import { divIcon } from "leaflet"
import { Card } from "@/components/ui/card"
import type { GeoLocation, SensorData, DiseaseOutbreak, MentalHealthReport } from "@/lib/types"

// Import Leaflet CSS in the client component
import "leaflet/dist/leaflet.css"

// Fallback coordinates for Mumbai
const MUMBAI_CENTER: GeoLocation = { latitude: 19.076, longitude: 72.8777 }

// Export the interface for use in other files
export interface DynamicMapProps {
    sensors?: SensorData[];
    outbreaks?: DiseaseOutbreak[];
    mentalHealthReports?: MentalHealthReport[];
    center?: GeoLocation;
    zoom?: number;
  }

// Component to recenter map when center prop changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

// Create custom div icons for different marker types
const createCustomIcon = (type: string) => {
  return divIcon({
    className: "",
    html: `<div class="custom-marker ${type}-marker">${type.charAt(0).toUpperCase()}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

export default function DynamicMap({
  sensors = [],
  outbreaks = [],
  mentalHealthReports = [],
  center = MUMBAI_CENTER,
  zoom = 12,
}: DynamicMapProps) {
  const mapCenter: [number, number] = [center.latitude, center.longitude]

  // Create custom icons
  const airIcon = createCustomIcon("air")
  const waterIcon = createCustomIcon("water")
  const noiseIcon = createCustomIcon("noise")
  const outbreakIcon = createCustomIcon("outbreak")
  const mentalIcon = createCustomIcon("mental")

  return (
    <Card className="w-full responsive-map overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} zoom={zoom} />

          {/* Render sensor markers */}
          {sensors.map((sensor) => (
            <CircleMarker
              key={sensor.id}
              center={[sensor.location.latitude, sensor.location.longitude]}
              radius={8}
              pathOptions={{
                fillColor:
                  sensor.type === "air"
                    ? "#ff5252"
                    : sensor.type === "water"
                      ? "#2196f3"
                      : "#ffc107",
                fillOpacity: 0.8,
                color: "white",
                weight: 1,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{sensor.type.toUpperCase()} Sensor</h3>
                  <p>ID: {sensor.id}</p>
                  <p>
                    Reading: {sensor.reading} {sensor.unit}
                  </p>
                  <p>Last Updated: {new Date(sensor.lastUpdated).toLocaleString()}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Render outbreak markers */}
          {outbreaks.flatMap((outbreak) =>
            {outbreaks.flatMap((outbreak) =>
                outbreak.affectedAreas.map((area) => (
                  <CircleMarker
                    key={`${outbreak.id}-${area.name}`}
                    center={[area.location.latitude, area.location.longitude]}
                    radius={Math.min(10 + area.caseCount / 10, 20)}
                    pathOptions={{
                      fillColor:
                        outbreak.severity === "critical"
                          ? "#d32f2f"
                          : outbreak.severity === "high"
                            ? "#f44336"
                            : outbreak.severity === "medium"
                              ? "#ff9800"
                              : "#4caf50",
                      fillOpacity: 0.7,
                      color: "white",
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold">{outbreak.disease}</h3>
                        <p>Area: {area.name}</p>
                        <p>Cases: {area.caseCount}</p>
                        <p>Severity: {outbreak.severity}</p>
                        <p>Status: {outbreak.status}</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))
              )}
          )}

          {/* Render mental health report markers */}
          {mentalHealthReports.map((report) => (
            <CircleMarker
              key={report.id}
              center={[report.location.latitude, report.location.longitude]}
              radius={8}
              pathOptions={{
                fillColor: "#4caf50",
                fillOpacity: 0.7,
                color: "white",
                weight: 1,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">Mental Health Report</h3>
                  <p>Area: {report.area}</p>
                  <p>Stress Level: {report.stressLevel}/10</p>
                  <p>Anxiety Level: {report.anxietyLevel}/10</p>
                  <p>Depression Level: {report.depressionLevel}/10</p>
                  <p>Reports: {report.reportCount}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </>
      </MapContainer>
    </Card>
  )
}
