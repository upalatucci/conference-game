import { NextResponse } from "next/server"

// Reference to the in-memory game state
const gameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
}

export async function POST() {
  // Reset game state
  gameState.action = ""
  gameState.isCountdownActive = false
  gameState.countdown = 0
  gameState.countdownEndTime = 0

  return NextResponse.json({ success: true })
}

