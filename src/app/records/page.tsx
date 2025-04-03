import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getRecords } from "@/lib/db";
import { RecordsClient } from "./client";

export default async function RecordsPage() {
  // Get all records initially (without date filter)
  const records = await getRecords();

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Form
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Headcount Records
          </h1>
        </div>

        <RecordsClient initialRecords={records} />
      </div>
    </main>
  );
}
