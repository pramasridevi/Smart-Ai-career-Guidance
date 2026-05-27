import { generateExamRoadmap } from "./src/lib/gemini.js";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

async function testRoadmap() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-pro-latest",
      contents: "Generate a roadmap for UPSC",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
             foo: { type: "STRING" }
          }
        }
      }
    });
    console.log("SUCCESS");
  } catch(e) {
    console.error("FAIL", e.message);
  }
}
testRoadmap();
