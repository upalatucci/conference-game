import { NextResponse } from "next/server"

// In-memory game state (in a real app, use a database or Redis)
const gameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
}

// Update countdown if active
function updateCountdown() {
  if (gameState.isCountdownActive) {
    const now = Date.now()
    const remaining = Math.max(0, Math.ceil((gameState.countdownEndTime - now) / 1000))

    gameState.countdown = remaining

    if (remaining === 0) {
      gameState.isCountdownActive = false
    }
  }
}

export async function GET() {
  updateCountdown()

  return NextResponse.json(gameState)
}

