import type { MumbaiHealthData } from "@/lib/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Provide the most recent health data for Mumbai as of the current date and time, including environmental data, disease outbreaks, and mental health reports, in the following JSON format. Ensure the response is a valid JSON object with no additional text outside the JSON structure:

      {
        "timestamp": "ISO date string",
        "environmentalData": {
          "airQuality": {
            "aqi": number,
            "pm25": number,
            "pm10": number,
            "o3": number,
            "no2": number,
            "so2": number,
            "co": number
          },
          "waterQuality": {
            "ph": number,
            "turbidity": number,
            "dissolvedOxygen": number,
            "conductivity": number,
            "temperature": number
          },
          "noiseLevel": {
            "average": number,
            "peak": number,
            "timeOfPeak": "HH:MM:SS"
          },
          "sensors": [
            {
              "id": string,
              "type": "air" | "water" | "noise",
              "location": { "latitude": number, "longitude": number },
              "reading": number,
              "unit": string,
              "lastUpdated": "ISO date string"
            }
          ]
        },
        "diseaseOutbreaks": [
          {
            "id": string,
            "disease": string,
            "severity": "low" | "medium" | "high",
            "affectedAreas": [
              {
                "name": string,
                "location": { "latitude": number, "longitude": number },
                "caseCount": number
              }
            ],
            "startDate": "ISO date string",
            "status": "active" | "contained" | "resolved",
            "symptoms": string[],
            "preventionMeasures": string[]
          }
        ],
        "mentalHealthReports": [
          {
            "id": string,
            "area": string,
            "location": { "latitude": number, "longitude": number },
            "stressLevel": number,
            "anxietyLevel": number,
            "depressionLevel": number,
            "reportCount": number,
            "timestamp": "ISO date string",
            "sentimentAnalysis": {
              "positive": number,
              "negative": number,
              "neutral": number
            }
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const startIndex = responseText.indexOf("{");
    const endIndex = responseText.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      throw new Error("No valid JSON object found in the response");
    }

    // Extract the JSON string
    const jsonString = responseText.substring(startIndex, endIndex + 1);

    // Parse the response as JSON and type it as MumbaiHealthData
    const healthData: MumbaiHealthData = JSON.parse(jsonString);

    // Return the data as a JSON response
    return NextResponse.json(healthData);
  } catch (error) {
    console.error("Error in health-data API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch health data" },
      { status: 500 }
    );
  }
}
