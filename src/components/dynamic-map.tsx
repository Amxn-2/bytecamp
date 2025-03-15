import type React from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"

interface Location {
  latitude: number
  longitude: number
}

interface AffectedArea {
  name: string
  location: Location
  caseCount: number
}

interface Outbreak {
  id: string
  disease: string
  affectedAreas: AffectedArea[]
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "contained" | "resolved"
}

interface DynamicMapProps {
  outbreaks: Outbreak[]
}

const DynamicMap: React.FC<DynamicMapProps> = ({ outbreaks }) => {
  const center: [number, number] = [0, 0] // Default center

  return (
    <Card className="w-full responsive-map overflow-hidden" style={{ height: "500px" }}>
      <MapContainer center={center} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render outbreak markers */}
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
          )),
        )}
      </MapContainer>
    </Card>
  )
}

export default DynamicMap

