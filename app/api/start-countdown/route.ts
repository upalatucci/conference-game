import { NextResponse } from "next/server"

// Reference to the in-memory game state
const gameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
}

export async function POST(request: Request) {
  try {
    const { duration } = await request.json()

    // Validate duration
    if (typeof duration !== "number" || duration <= 0) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 })
    }

    // Don't start if no action is set
    if (!gameState.action) {
      return NextResponse.json({ error: "No action is set" }, { status: 400 })
    }

    // Set countdown
    gameState.isCountdownActive = true
    gameState.countdown = duration
    gameState.countdownEndTime = Date.now() + duration * 1000

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

