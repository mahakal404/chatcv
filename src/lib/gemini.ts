import { GoogleGenAI, Type } from '@google/genai';
import { ResumeData } from '../types';

const SYSTEM_INSTRUCTION = `
You are "ChatCV AI", an empathetic and expert Resume Copilot. Your goal is to help users build a professional, industry-standard resume through a natural conversation.

CORE CAPABILITIES:
1. Step-by-Step Guidance: Ask for information logically (Personal Details -> Summary -> Experience -> Education -> Skills -> Projects).
2. Information Extraction: Extract professional details from casual or unstructured user input.
3. Real-time Updates: You MUST update the resume data structure as soon as you receive ANY new information.
4. Content Enhancement: Use industry-specific keywords and strong action verbs (e.g., "Spearheaded", "Orchestrated", "Optimized").

STRICT OUTPUT FORMAT:
You MUST always respond with a JSON object containing exactly two keys:
1. "chatMessage": A string containing your conversational response to the user.
2. "resumeUpdates": A partial ResumeData object containing ONLY the fields that should be updated or added based on the latest user input.

IMPORTANT: 
- For arrays (experience, education, projects, certifications), if you are adding a NEW item, provide the ENTIRE array including previous items plus the new one, OR just the new item if you want the client to handle merging (but the client currently replaces the array, so provide the FULL array for that section if you want to keep previous entries).
- Actually, to be safe, always provide the FULL array for the section you are updating (e.g., if adding a second experience, provide both experiences in the "experience" array).

ResumeData Structure Reference:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "address": "", "linkedin": "", "portfolio": "" },
  "summary": "",
  "experience": [{ "id": "uuid", "company": "", "role": "", "startDate": "", "endDate": "", "description": "", "isCurrent": boolean }],
  "education": [{ "id": "uuid", "level": "10th" | "12th" | "Bachelor" | "Master" | "Diploma", "school": "", "degree": "", "startDate": "", "endDate": "", "score": "", "isCurrentlyStudying": boolean }],
  "skills": [{ "name": "", "level": "Beginner" | "Intermediate" | "Advanced" | "Expert" }],
  "projects": [{ "id": "uuid", "title": "", "description": "", "link": "" }],
  "certifications": [{ "id": "uuid", "name": "", "organization": "", "year": "" }]
}
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    chatMessage: {
      type: Type.STRING,
      description: "The conversational message to display to the user."
    },
    resumeUpdates: {
      type: Type.OBJECT,
      description: "A partial ResumeData object containing the fields to update.",
      properties: {
        personalInfo: { type: Type.OBJECT },
        summary: { type: Type.STRING },
        experience: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        education: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        skills: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        projects: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        certifications: { type: Type.ARRAY, items: { type: Type.OBJECT } },
        theme: { type: Type.STRING },
        accentColor: { type: Type.STRING },
        skillDisplayStyle: { type: Type.STRING, enum: ["text", "stars", "dots", "bar"] }
      }
    }
  },
  required: ["chatMessage", "resumeUpdates"]
};

export async function getGeminiResponse(
  userInput: string, 
  currentData: ResumeData, 
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  fileData?: { data: string, mimeType: string }
) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    Current Resume Data: ${JSON.stringify(currentData)}
    User Input: "${userInput}"
    ${fileData ? "A document has been attached. Please analyze it and extract relevant professional information." : ""}
    
    Instructions:
    1. If a document is attached, prioritize extracting information from it (Degree, Institution, Dates, Skills, etc.).
    2. Update the resume data and continue the conversation.
    3. Be helpful and professional.
  `;

  const userParts: any[] = [{ text: prompt }];
  if (fileData) {
    userParts.push({
      inlineData: {
        data: fileData.data,
        mimeType: fileData.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(h => ({ role: h.role === 'model' ? 'model' : 'user', parts: h.parts })),
      { role: 'user', parts: userParts }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: responseSchema as any,
    }
  });

  const responseText = response.text;
  if (!responseText) throw new Error("Empty response from AI");
  
  try {
    // Remove any markdown code blocks if the model included them
    const cleanedText = responseText.replace(/```json\n?|```/g, '').trim();
    if (cleanedText === "undefined") {
      throw new Error("AI returned 'undefined' string instead of JSON");
    }
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error("Failed to parse AI response:", responseText);
    throw new Error(`Invalid JSON response from AI: ${e instanceof Error ? e.message : String(e)}`);
  }
}
