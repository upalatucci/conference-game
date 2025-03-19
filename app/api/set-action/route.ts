import { NextResponse } from "next/server";

// Reference to the in-memory game state
const gameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
};

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    // Validate action
    if (typeof action !== "string" || !action.trim()) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Set the action
    gameState.action = action;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
