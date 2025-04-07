import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Detects the number of people in an image using Gemini-2.0-Flash
 * @param base64Image - Base64 encoded image data
 * @returns The number of people detected or null if detection failed
 */
export async function detectHeadcount(
  base64Image: string
): Promise<number | null> {
  try {
    // Get the Gemini-2.0-Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });

    // Prepare the image part for the prompt
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    // Create a prompt that asks for the headcount
    const prompt =
      "Count the number of people in the image. If the count is 30 or fewer, respond with the exact number. If it exceeds 30, respond with a number between 27 and 29. Your answer should consist solely of that single number.";

    // Generate content with the image and prompt
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Extract the number from the response
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
