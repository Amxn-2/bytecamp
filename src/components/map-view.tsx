"use client"

import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import type { GeoLocation, SensorData, DiseaseOutbreak, MentalHealthReport } from "@/lib/types"

const MUMBAI_CENTER: GeoLocation = { latitude: 19.076, longitude: 72.8777 }

interface MapViewProps {
  sensors?: SensorData[]
  outbreaks?: DiseaseOutbreak[]
  mentalHealthReports?: MentalHealthReport[]
  center?: GeoLocation
  zoom?: number
}

// Adjust for named export if necessary; assume default for now
const DynamicMap = dynamic(() => import("@/components/dynamic-map"), {
  ssr: false,
  loading: () => (
    <Card className="w-full h-[300px] md:h-[500px] flex items-center justify-center">
      <p>Loading map...</p>
    </Card>
  ),
})

export default function MapView({
  sensors = [],
  outbreaks = [],
  mentalHealthReports = [],
  center = MUMBAI_CENTER,
  zoom = 12,
}: MapViewProps) {
  return (
    <DynamicMap
      sensors={sensors}
      outbreaks={outbreaks}
      mentalHealthReports={mentalHealthReports}
      center={center}
      zoom={zoom}
    />
  )
}