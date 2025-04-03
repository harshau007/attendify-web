import { HeadcountForm } from "@/components/headcount-form";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Headcount Detection
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Upload an image of your classroom or lab to automatically detect the
          number of people present.
        </p>
        <div className="w-full max-w-md">
          <HeadcountForm />
        </div>

        <div className="mt-8 pt-6 border-t w-full max-w-md flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">View Detection Records</h2>
          <Button asChild className="gap-2">
            <Link href="/records">
              <ClipboardList className="h-4 w-4" />
              View Records Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
