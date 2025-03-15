"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import type { GeoLocation, SensorData, DiseaseOutbreak, MentalHealthReport } from "@/lib/types"
import { useEffect, useState } from "react"

const MUMBAI_CENTER: GeoLocation = { latitude: 19.076, longitude: 72.8777 }

interface MapViewProps {
  sensors?: SensorData[]
  outbreaks?: DiseaseOutbreak[]
  mentalHealthReports?: MentalHealthReport[]
  center?: GeoLocation
  zoom?: number
}

export default function MapView({
  sensors = [],
  outbreaks = [],
  mentalHealthReports = [],
  center = MUMBAI_CENTER,
  zoom = 12,
}: MapViewProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Import the map component only on the client side
    const loadMap = async () => {
      try {
        // Use the default export directly
        const MapModule = await import("./leaflet-map")

        if (isMounted) {
          setMapComponent(() => MapModule.default)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error loading map:", error)
        setLoading(false)
      }
    }

    loadMap()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <Card className="w-full h-[300px] md:h-[500px] flex items-center justify-center">
        <p>Loading map...</p>
      </Card>
    )
  }

  if (!MapComponent) {
    return (
      <Card className="w-full h-[300px] md:h-[500px] flex items-center justify-center">
        <p>Could not load map component</p>
      </Card>
    )
  }

  // Render the dynamically loaded component with props
  return (
    <div className="w-full h-[300px] md:h-[500px]">
      <MapComponent
        sensors={sensors}
        outbreaks={outbreaks}
        mentalHealthReports={mentalHealthReports}
        center={center}
        zoom={zoom}
      />
    </div>
  )
}

