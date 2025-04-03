import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Get credentials from environment variables
    const validUsername = process.env.AUTH_USERNAME;
    const validPassword = process.env.AUTH_PASSWORD;

    // Check if environment variables are set
    if (!validUsername || !validPassword) {
      console.error("Authentication environment variables not set");
      return NextResponse.json(
        { message: "Authentication not configured properly" },
        { status: 500 }
      );
    }

    // Validate credentials
    if (username === validUsername && password === validPassword) {
      // Create a simple session token (in production, use a more secure method)
      const sessionToken = Buffer.from(
        `${username}:${Date.now()}:${Math.random()
          .toString(36)
          .substring(2, 15)}`
      ).toString("base64");

      // Set the session cookie
      (
        await // Set the session cookie
        cookies()
      ).set({
        name: "auth-session",
        value: sessionToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
      });

      return NextResponse.json({ success: true });
    }

    // Invalid credentials
    console.log("Invalid login attempt for username:", username);
    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { message: "An error occurred during authentication" },
      { status: 500 }
    );
  }
}
