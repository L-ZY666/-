import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ReviewResponse, CommentSeverity } from "../types";

const SYSTEM_INSTRUCTION = `
You are a distinguished Agronomy Professor, PhD Supervisor, and senior journal reviewer. 
You are known for your rigorous scientific standards, deep expertise in experimental design, statistics, and agricultural science.
Your student has submitted a document (likely an experiment proposal, thesis chapter, or lab report) for your review.

Your task is to:
1. Analyze the document deeply.
2. Evaluate it based on 5 dimensions: Logic (flow of argument), Content (depth/accuracy), Structure (academic format), Feasibility (can this experiment actually be done?), and Scientific Rigor (stats, methods).
3. Provide a constructive but strict critique. 
4. Identify specific text segments that need improvement and provide actionable "Track Changes" style feedback.

Maintain a professional, academic, mentorship tone. Be encouraging but do not let scientific errors slide.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A comprehensive executive summary of the review, addressing the student directly.",
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        logic: { type: Type.NUMBER, description: "Score 0-100" },
        content: { type: Type.NUMBER, description: "Score 0-100" },
        structure: { type: Type.NUMBER, description: "Score 0-100" },
        feasibility: { type: Type.NUMBER, description: "Score 0-100" },
        scientific: { type: Type.NUMBER, description: "Score 0-100" },
      },
      required: ["logic", "content", "structure", "feasibility", "scientific"],
    },
    comments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original_text_context: { type: Type.STRING, description: "The specific sentence or paragraph being critiqued." },
          critique: { type: Type.STRING, description: "What is wrong or needs attention." },
          suggestion: { type: Type.STRING, description: "Specific instruction on how to fix it." },
          severity: { type: Type.STRING, enum: ["critical", "minor", "good"] },
        },
        required: ["original_text_context", "critique", "suggestion", "severity"],
      },
    },
  },
  required: ["summary", "scores", "comments"],
};

export const reviewDocument = async (text: string): Promise<ReviewResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please review the following academic text:\n\n${text}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.3, // Low temperature for consistent, analytical output
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    return JSON.parse(jsonText) as ReviewResponse;
  } catch (error) {
    console.error("Gemini Review Error:", error);
    throw error;
  }
};
