"use client";

import { processHeadcount } from "@/app/actions";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  facultyName: z.string().min(2, { message: "Faculty name is required" }),
  subject: z.string().min(2, { message: "Subject is required" }),
  labClassroomNo: z
    .string()
    .min(1, { message: "Lab/Classroom number is required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export function HeadcountForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headcount, setHeadcount] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facultyName: "",
      subject: "",
      labClassroomNo: "",
      imageUrl: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      setHeadcount(null);

      const result = await processHeadcount(data);

      if (result.success) {
        setHeadcount(result.headcount!);
        toast.success("Success!", {
          description: `Detected ${result.headcount} people in the image.`,
        });
      } else {
        toast.error("Error", {
          description: result.error || "Failed to process image",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Headcount Detection Form</CardTitle>
        <CardDescription>
          Fill in the details and upload an image to detect the number of
          people.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="facultyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faculty Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter faculty name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="labClassroomNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab/Classroom No.</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter lab or classroom number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept="image/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Detect Headcount"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      {headcount !== null && (
        <CardFooter className="flex flex-col items-center justify-center border-t pt-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Detection Result</h3>
            <p className="mt-2 text-3xl font-bold">
              {headcount} people detected
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
