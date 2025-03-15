import type { MumbaiHealthData } from "./types"
import { toast } from "sonner"

// Function to fetch data from the Gemini API
export async function fetchHealthData(): Promise<MumbaiHealthData | null> {
  try {
    const response = await fetch("/api/health-data")

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    return data as MumbaiHealthData
  } catch (error) {
    console.error("Error fetching health data:", error)
    toast.error("Failed to fetch health data. Please try again later.")
    return null
  }
}

// Function to fetch specific environmental data
export async function fetchEnvironmentalData() {
  try {
    const healthData = await fetchHealthData()
    return healthData?.environmentalData || null
  } catch (error) {
    console.error("Error fetching environmental data:", error)
    toast.error("Failed to fetch environmental data. Please try again later.")
    return null
  }
}

// Function to fetch disease outbreak data
export async function fetchDiseaseOutbreaks() {
  try {
    const healthData = await fetchHealthData()
    return healthData?.diseaseOutbreaks || null
  } catch (error) {
    console.error("Error fetching disease outbreak data:", error)
    toast.error("Failed to fetch disease outbreak data. Please try again later.")
    return null
  }
}

// Function to fetch mental health report data
export async function fetchMentalHealthReports() {
  try {
    const healthData = await fetchHealthData()
    return healthData?.mentalHealthReports || null
  } catch (error) {
    console.error("Error fetching mental health report data:", error)
    toast.error("Failed to fetch mental health report data. Please try again later.")
    return null
  }
}

