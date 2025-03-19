import { NextResponse } from "next/server";

// This is a placeholder route to keep the API endpoint valid
// The actual WebSocket connection will be handled by a separate server
export async function GET() {
  return NextResponse.json({ message: "WebSocket server endpoint" });
}
