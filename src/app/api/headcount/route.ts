import { detectHeadcount } from "@/lib/gemini";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert the image to base64
    const buffer = await image.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Process the image with Gemini API
    const headcount = await detectHeadcount(base64Image);

    if (headcount === null) {
      return NextResponse.json(
        { success: false, error: "Failed to detect headcount" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, headcount });
  } catch (error) {
    console.error("Error processing headcount:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process image" },
      { status: 500 }
    );
  }
}
