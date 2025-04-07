import { GoogleGenerativeAI } from "@google/generative-ai";

// A simple rate limiter: ensures at least 30 seconds between calls
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 30000; // 30 seconds

async function rateLimited<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_INTERVAL_MS) {
    const waitTime = MIN_INTERVAL_MS - timeSinceLast;
    console.log(`Rate limit active. Waiting ${waitTime}ms before next request.`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }
  lastRequestTime = Date.now();
  return await fn();
}

/**
 * Detects the number of people in an image using Gemini.
 * @param base64Image - Base64 encoded image data.
 * @returns The number of people detected or null if detection failed.
 */
export async function detectHeadcount(
  base64Image: string
): Promise<number | null> {
  try {
    // Initialize the Google Generative AI client with your API key.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    // Get the desired model.
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare the image part for the prompt.
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    // Shortened prompt to reduce input tokens.
    const prompt =
      "Count people in the image. Only output the number.";

    // Use the rate limiter to ensure no more than 2 requests per minute.
    const result = await rateLimited(() => model.generateContent([prompt, imagePart]));
    const response = await result.response;
    const text = response.text();

    // Extract the number from the response.
    const match = text.match(/\d+/);
    if (match) {
      return Number.parseInt(match[0], 10);
    }
    return null;
  } catch (error) {
    console.error("Error detecting headcount:", error);
    return null;
  }
}
