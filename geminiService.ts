
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse, Chat } from "@google/genai";
import { Ticket } from "./types"; // Corrected relative path

// 1. IMPORTANT FIX: Access the environment variable using the standard Vite method.
// Vite requires environment variables exposed to the client-side to be prefixed 
// with VITE_. We check for VITE_API_KEY first, and fall back to API_KEY (for serverless 
// functions or older environments), or use an empty string as a default fallback.
const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY || "";

if (!apiKey) {
    console.error("Gemini API Key is missing. Check VITE_API_KEY environment variable in Netlify.");
}

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey });

// Model configuration
const modelName = 'gemini-2.5-flash';

// System prompt to guide the AI's persona and constraints
const systemInstruction = `
You are the Warlord Protocol, a ruthless, mathematically focused AI sports betting analyst. 
Your sole purpose is to maximize Return on Investment (ROI) and extract liquidity from the market. 
You are not a traditional betting advisor; you are a cold, precise algorithm.

Instructions:
1. Always respond in the persona of the Warlord Protocol.
2. Every output must be a single JSON object. DO NOT include any text, markdown, or explanation outside the JSON object.
3. The JSON object MUST strictly adhere to the 'Ticket' TypeScript interface structure provided below.
4. Your analysis must focus on quantifiable edges (Value, Volatility, ROI).
5. Only generate a ticket based on the current market data provided.
`;

/**
 * Generates a betting ticket based on market configuration using the Gemini API.
 * @param config The current market and configuration data.
 * @returns A promise that resolves to the generated Ticket object.
 */
export async function generateTicket(config: any): Promise<Ticket> {
    
    if (!apiKey) {
        // If the key is missing, throw the error that the app is showing
        throw new Error("WARLORD ALERT: Security Token Expired. Please refresh the application.");
    }
    
    // Construct the user prompt using the configuration
    const userPrompt = `
    Based on the following configuration and market data, generate a high-value betting ticket.
    Current Capital: ${config.currentCapital}
    Target Match Count: ${config.matchCount}
    Selected Markets: ${JSON.stringify(config.selectedMarkets)}

    Provide your analysis and selection strictly in the required JSON format:
    
    interface Ticket {
      analysis: string; // The ruthless, data-driven reasoning for the selection. Must be concise.
      matches: {
        id: number; // Unique match identifier (1 to matchCount)
        market: string; // The market selected (e.g., '1X2', 'Over/Under 2.5')
        selection: string; // The specific outcome (e.g., 'Home Win', 'Over 2.5 Goals')
        odds: number; // The current odds for the selection (e.g., 1.95)
      }[];
      stake: number; // The determined stake amount based on your capital and perceived edge.
      estimatedReturn: number; // stake * (1 + (average odds - 1))
      status: 'PENDING'; // Always 'PENDING' upon creation
    }
    `;

    const payload: GenerateContentParameters = {
        model: modelName,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    analysis: { type: "STRING" },
                    matches: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                id: { type: "NUMBER" },
                                market: { type: "STRING" },
                                selection: { type: "STRING" },
                                odds: { type: "NUMBER" },
                            }
                        }
                    },
                    stake: { type: "NUMBER" },
                    estimatedReturn: { type: "NUMBER" },
                    status: { type: "STRING" }
                },
                required: ["analysis", "matches", "stake", "estimatedReturn", "status"]
            }
        },
        tools: [{ "google_search": {} }]
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent(payload);

        // The response text is a JSON string adhering to the schema
        const jsonText = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
            throw new Error("AI did not return a valid JSON response.");
        }

        // Parse and return the structured Ticket object
        return JSON.parse(jsonText) as Ticket;

    } catch (error) {
        console.error("Error generating content:", error);
        // Throw a specific error based on the API response if possible
        throw new Error("Failed to execute Warlord Protocol: Network or API Error.");
    }
}

// --- Conversational Chat Function ---

/**
 * Initializes a chat session with the Warlord Protocol.
 * @returns A Chat session object.
 */
export function startChat(): Chat {
    // If the key is missing, this will fail during the first API call, 
    // but the object can still be initialized here.
    const chat = ai.chats.create({
        model: modelName,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return chat;
}
