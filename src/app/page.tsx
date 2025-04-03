import { HeadcountForm } from "@/components/headcount-form";

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
      </div>
    </main>
  );
}
