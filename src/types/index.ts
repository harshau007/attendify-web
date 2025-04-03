import type { DateRange } from "react-day-picker"

export interface HeadcountRecord {
  id?: number
  facultyName: string
  subject: string
  labClassroomNo: string
  headcount: number
  timestamp: Date
}

export interface DateRangeFilter {
  dateRange: DateRange | undefined
}

