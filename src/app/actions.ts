"use server"

import { revalidatePath } from "next/cache"
import { detectHeadcount } from "@/lib/gemini"
import { insertRecord, getRecords } from "@/lib/db"
import type { HeadcountRecord } from "@/types"
import type { DateRange } from "react-day-picker"

type FormData = {
  facultyName: string
  subject: string
  labClassroomNo: string
  imageUrl: string
}

type ProcessResult = {
  success: boolean
  headcount?: number
  error?: string
}

export async function processHeadcount(data: FormData): Promise<ProcessResult> {
  try {
    // Extract the base64 image data from the data URL
    const base64Image = data.imageUrl.split(",")[1]

    if (!base64Image) {
      return {
        success: false,
        error: "Invalid image format",
      }
    }

    // Process the image with Gemini API
    const headcount = await detectHeadcount(base64Image)

    if (headcount === null) {
      return {
        success: false,
        error: "Failed to detect headcount",
      }
    }

    // Create a record for the database
    const record: HeadcountRecord = {
      facultyName: data.facultyName,
      subject: data.subject,
      labClassroomNo: data.labClassroomNo,
      headcount,
      timestamp: new Date(),
    }

    // Insert the record into the database
    await insertRecord(record)

    // Revalidate the page to show updated data
    revalidatePath("/")
    revalidatePath("/records")

    return {
      success: true,
      headcount,
    }
  } catch (error) {
    console.error("Error processing headcount:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getFilteredRecords(dateRange?: DateRange): Promise<HeadcountRecord[]> {
  try {
    return await getRecords(dateRange)
  } catch (error) {
    console.error("Error getting filtered records:", error)
    throw error
  }
}

