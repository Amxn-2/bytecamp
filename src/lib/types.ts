// TypeScript interfaces for data validation

export interface MumbaiHealthData {
    timestamp: string
    environmentalData: EnvironmentalData
    diseaseOutbreaks: DiseaseOutbreak[]
    mentalHealthReports: MentalHealthReport[]
  }
  
  export interface EnvironmentalData {
    airQuality: {
      aqi: number
      pm25: number
      pm10: number
      o3: number
      no2: number
      so2: number
      co: number
    }
    waterQuality: {
      ph: number
      turbidity: number
      dissolvedOxygen: number
      conductivity: number
      temperature: number
    }
    noiseLevel: {
      average: number
      peak: number
      timeOfPeak: string
    }
    sensors: SensorData[]
  }
  
  export interface SensorData {
    id: string
    type: "air" | "water" | "noise"
    location: GeoLocation
    reading: number
    unit: string
    lastUpdated: string
  }
  
  export interface DiseaseOutbreak {
    id: string
    disease: string
    severity: "low" | "medium" | "high" | "critical"
    affectedAreas: {
      name: string
      location: GeoLocation
      caseCount: number
    }[]
    startDate: string
    status: "active" | "contained" | "resolved"
    symptoms: string[]
    preventionMeasures: string[]
  }
  
  export interface MentalHealthReport {
    id: string
    area: string
    location: GeoLocation
    stressLevel: number // 1-10
    anxietyLevel: number // 1-10
    depressionLevel: number // 1-10
    reportCount: number
    timestamp: string
    sentimentAnalysis: {
      positive: number // percentage
      negative: number // percentage
      neutral: number // percentage
    }
  }
  
  export interface GeoLocation {
    latitude: number
    longitude: number
  }
  
  