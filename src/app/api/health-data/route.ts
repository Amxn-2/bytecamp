import { NextResponse } from "next/server"
import type { MumbaiHealthData } from "@/lib/types"

// This is a mock API endpoint that would be replaced with actual Gemini API integration
export async function GET() {
  try {
    // In a real implementation, this would fetch data from the Gemini API
    // For now, we'll return mock data that matches our TypeScript interface
    const mockData: MumbaiHealthData = {
      timestamp: new Date().toISOString(),
      environmentalData: {
        airQuality: {
          aqi: 156,
          pm25: 75.2,
          pm10: 120.5,
          o3: 42.1,
          no2: 38.7,
          so2: 15.3,
          co: 1.2,
        },
        waterQuality: {
          ph: 7.2,
          turbidity: 5.8,
          dissolvedOxygen: 6.5,
          conductivity: 450,
          temperature: 28.3,
        },
        noiseLevel: {
          average: 68.5,
          peak: 92.3,
          timeOfPeak: "08:30:00",
        },
        sensors: [
          {
            id: "air-001",
            type: "air",
            location: { latitude: 19.076, longitude: 72.8777 },
            reading: 156,
            unit: "AQI",
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "water-001",
            type: "water",
            location: { latitude: 19.033, longitude: 72.8296 },
            reading: 7.2,
            unit: "pH",
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "noise-001",
            type: "noise",
            location: { latitude: 19.0178, longitude: 72.8478 },
            reading: 68.5,
            unit: "dB",
            lastUpdated: new Date().toISOString(),
          },
        ],
      },
      diseaseOutbreaks: [
        {
          id: "outbreak-001",
          disease: "Dengue Fever",
          severity: "high",
          affectedAreas: [
            {
              name: "Dharavi",
              location: { latitude: 19.038, longitude: 72.8538 },
              caseCount: 127,
            },
            {
              name: "Worli",
              location: { latitude: 19.0096, longitude: 72.8175 },
              caseCount: 83,
            },
          ],
          startDate: "2023-07-15T00:00:00Z",
          status: "active",
          symptoms: ["High Fever", "Severe Headache", "Pain Behind Eyes", "Joint and Muscle Pain", "Rash"],
          preventionMeasures: [
            "Eliminate standing water",
            "Use mosquito repellent",
            "Wear long sleeves",
            "Use bed nets",
          ],
        },
        {
          id: "outbreak-002",
          disease: "Gastroenteritis",
          severity: "medium",
          affectedAreas: [
            {
              name: "Bandra East",
              location: { latitude: 19.0596, longitude: 72.8295 },
              caseCount: 56,
            },
          ],
          startDate: "2023-08-02T00:00:00Z",
          status: "contained",
          symptoms: ["Diarrhea", "Abdominal Cramps", "Nausea", "Vomiting", "Fever"],
          preventionMeasures: [
            "Wash hands frequently",
            "Drink clean water",
            "Cook food thoroughly",
            "Proper sanitation",
          ],
        },
      ],
      mentalHealthReports: [
        {
          id: "mh-001",
          area: "Andheri",
          location: { latitude: 19.1136, longitude: 72.8697 },
          stressLevel: 7,
          anxietyLevel: 6,
          depressionLevel: 5,
          reportCount: 245,
          timestamp: "2023-08-10T00:00:00Z",
          sentimentAnalysis: {
            positive: 25,
            negative: 45,
            neutral: 30,
          },
        },
        {
          id: "mh-002",
          area: "Colaba",
          location: { latitude: 18.9067, longitude: 72.8147 },
          stressLevel: 5,
          anxietyLevel: 4,
          depressionLevel: 3,
          reportCount: 178,
          timestamp: "2023-08-10T00:00:00Z",
          sentimentAnalysis: {
            positive: 40,
            negative: 30,
            neutral: 30,
          },
        },
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error in health-data API route:", error)
    return NextResponse.json({ error: "Failed to fetch health data" }, { status: 500 })
  }
}

