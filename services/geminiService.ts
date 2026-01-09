
import { GoogleGenAI, Type } from "@google/genai";
import { CityInsight } from "../types";

export const getCityInsight = async (cityName: string, localTime: string): Promise<CityInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief dynamic insight for ${cityName} given its local time is ${localTime}. 
      Include a short summary of what's likely happening there, a cultural tip, and a "current vibe" word.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Short summary of current activity in city" },
            cultureTip: { type: Type.STRING, description: "One interesting cultural fact or tip" },
            currentVibe: { type: Type.STRING, description: "A single word or short phrase describing the vibe" }
          },
          required: ["summary", "cultureTip", "currentVibe"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      summary: data.summary || "Waking up to a new day...",
      cultureTip: data.cultureTip || "Always be polite!",
      currentVibe: data.currentVibe || "Peaceful"
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "Explore the beauty of this metropolis.",
      cultureTip: "Each city has its own rhythm.",
      currentVibe: "Active"
    };
  }
};
