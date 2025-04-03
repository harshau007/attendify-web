import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // Clear the auth session cookie
  (
    await // Clear the auth session cookie
    cookies()
  ).delete("auth-session");

  return NextResponse.json({ success: true });
}
