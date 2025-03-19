"use client";

import { useState, useEffect } from "react";

// Game state type
type GameState = {
  action: string;
  isCountdownActive: boolean;
  countdown: number;
  countdownEndTime: number;
};

// Default game state
const defaultGameState: GameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
};

// Fallback implementation that uses polling instead of WebSockets
export function useFallbackGameState() {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPollTime, setLastPollTime] = useState(0);

  // Poll for game state
  useEffect(() => {
    let isMounted = true;
    setIsConnected(true);

    const pollGameState = async () => {
      if (!isMounted) return;

      try {
        const response = await fetch("/api/game-status");
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        if (isMounted) {
          setGameState(data);
          setIsConnected(true);
          setLastPollTime(Date.now());
        }
      } catch (error) {
        console.error("Error polling game status:", error);
        if (isMounted) {
          setIsConnected(false);
        }
      }

      // Schedule next poll
      if (isMounted) {
        setTimeout(pollGameState, 1000);
      }
    };

    // Start polling
    pollGameState();

    // Check connection status
    const connectionCheck = setInterval(() => {
      if (Date.now() - lastPollTime > 5000) {
        setIsConnected(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(connectionCheck);
      setIsConnected(false);
    };
  }, [lastPollTime]);

  // Action functions with retry logic
  const executeWithRetry = async (
    apiEndpoint: string,
    method: string,
    body?: any
  ) => {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await fetch(apiEndpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error(`Error (attempt ${retries + 1}/${maxRetries}):`, error);
        retries++;

        if (retries >= maxRetries) {
          console.error("Max retries reached, giving up");
          setIsConnected(false);
          return null;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  const startCountdown = async (duration: number) => {
    return executeWithRetry("/api/start-countdown", "POST", { duration });
  };

  const setAction = async (action: string) => {
    return executeWithRetry("/api/set-action", "POST", { action });
  };

  const getRandomAction = async () => {
    return executeWithRetry("/api/random-action", "POST");
  };

  const resetGame = async () => {
    return executeWithRetry("/api/reset-game", "POST");
  };

  return {
    gameState,
    isConnected,
    startCountdown,
    setAction,
    getRandomAction,
    resetGame,
  };
}
