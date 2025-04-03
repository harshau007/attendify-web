"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import type { HeadcountRecord } from "@/types"
import { formatDate } from "@/lib/utils"
import { getFilteredRecords } from "@/app/actions"
import { Loader2 } from "lucide-react"

interface RecordsClientProps {
  initialRecords: HeadcountRecord[]
}

export function RecordsClient({ initialRecords }: RecordsClientProps) {
  const [records, setRecords] = useState<HeadcountRecord[]>(initialRecords)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const handleDateRangeChange = async (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const handleFilter = async () => {
    setIsLoading(true)
    try {
      const filteredRecords = await getFilteredRecords(dateRange)
      setRecords(filteredRecords)
    } catch (error) {
      console.error("Error filtering records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async () => {
    setIsLoading(true)
    setDateRange(undefined)
    try {
      const allRecords = await getFilteredRecords()
      setRecords(allRecords)
    } catch (error) {
      console.error("Error resetting records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Records</CardTitle>
        <CardDescription>View all headcount detection records from your submissions.</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleFilter} disabled={isLoading || !dateRange}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Apply Filter"
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} disabled={isLoading || !dateRange}>
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            No records found. {dateRange ? "Try a different date range." : "Submit a form to get started."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Lab/Classroom</TableHead>
                  <TableHead className="text-right">Headcount</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.facultyName}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>{record.labClassroomNo}</TableCell>
                    <TableCell className="text-right font-medium">{record.headcount}</TableCell>
                    <TableCell className="text-right">{formatDate(record.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

