"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/date-range-picker";
import type { HeadcountRecord } from "@/types";
import { formatDate } from "@/lib/utils";
import { getFilteredRecords } from "@/app/actions";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface RecordsClientProps {
  initialRecords: HeadcountRecord[];
}

export function RecordsClient({ initialRecords }: RecordsClientProps) {
  const [records, setRecords] = useState<HeadcountRecord[]>(initialRecords);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleDateRangeChange = async (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleFilter = async () => {
    setIsLoading(true);
    setCurrentPage(1); // Reset to first page when filtering
    try {
      const filteredRecords = await getFilteredRecords(dateRange);
      setRecords(filteredRecords);
    } catch (error) {
      console.error("Error filtering records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    setDateRange(undefined);
    setCurrentPage(1); // Reset to first page when clearing filters
    try {
      const allRecords = await getFilteredRecords();
      setRecords(allRecords);
    } catch (error) {
      console.error("Error resetting records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(records.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRecords = records.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Records</CardTitle>
        <CardDescription>
          View all headcount detection records from your submissions.
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
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
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading || !dateRange}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            No records found.{" "}
            {dateRange
              ? "Try a different date range."
              : "Submit a form to get started."}
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
                {paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.facultyName}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>{record.labClassroomNo}</TableCell>
                    <TableCell className="text-right font-medium">
                      {record.headcount}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(record.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {records.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, records.length)}{" "}
                  of {records.length} records
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, current page, last page and one page before and after current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }

                        // Show ellipsis for gaps
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={`ellipsis-${page}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }

                        return null;
                      }
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
