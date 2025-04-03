import { LogoutButton } from "@/components/logout-button";
import type React from "react";

export default function RecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Records Dashboard</h1>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
