import type { MumbaiHealthData } from "@/lib/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Provide the most recent health data for Mumbai as of the current date and time, including environmental data, disease outbreaks, and mental health reports, in the following JSON format. 
      
      Use only authentic and generic sources such as the Maharashtra government, Mumbai government, BMC, MCGM, etc., and reputable news outlets like Lokmat, New Today, TimesofIndia, etc. If any news is originally in Marathi, translate it appropriately into English. For every data section, include a "source" field with the name of the source and its exact URL so that the user can verify the information. Ensure that the data, particularly about disease outbreaks, is valid and accurate. For AQI, use the US AQI scale and websites like AQICN, OpenAQ, etc., for reference. For water quality, use the WHO guidelines and Maharashtra pollution control board and provide only drinkable waters data. For noise levels, use the WHO guidelines and standards with official maharashtra government data as well as trusted sources. For disease outbreaks, include the disease name, severity, affected areas, case count, start date, status, symptoms, and prevention measures. For mental health reports, include the area, stress, anxiety, depression levels, report count, sentiment analysis, and source. Keep fluctuacting data to a close to minimum for AQI, Noise, Temperature and ensure that the data is up-to-date and relevant to the current situation in Mumbai. For Flood prediction use latest data and provide the location, severity, and forecast time but make sure its not recurring and only 1 out of 20 times.

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
              "id": "string",
              "type": "air" | "water" | "noise",
              "location": { "latitude": number, "longitude": number },
              "reading": number,
              "unit": "string",
              "lastUpdated": "ISO date string"
            }
          ],
          "source": {
            "name": "string",
            "url": "string"
          }
        },
        "diseaseOutbreaks": [
          {
            "id": "string",
            "disease": "string",
            "severity": "low" | "medium" | "high" | "critical",
            "affectedAreas": [
              {
                "name": "string",
                "location": { "latitude": number, "longitude": number },
                "caseCount": number
              }
            ],
            "startDate": "ISO date string",
            "status": "active" | "contained" | "resolved",
            "symptoms": ["string"],
            "preventionMeasures": ["string"],
            "source": {
              "name": "string",
              "url": "string"
            },
            "expertVerified": boolean
          }
        ],
        "mentalHealthReports": [
          {
            "id": "string",
            "area": "string",
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
            },
            "source": {
              "name": "string",
              "url": "string"
            }
          }
        ],
        "floodForecast": {
          "location": { "latitude": number, "longitude": number },
          "severity": "low" | "medium" | "high" | "critical",
          "forecastTime": "ISO date string"
        }
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
    // console.log(jsonString);
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
