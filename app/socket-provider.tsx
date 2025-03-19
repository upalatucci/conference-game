"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket, disconnectSocket, type GameState } from "@/lib/socket";

// Default game state
const defaultGameState: GameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
};

// Socket context type
type SocketContextType = {
  socket: Socket | null;
  gameState: GameState;
  startCountdown: (duration: number) => void;
  setAction: (action: string) => void;
  getRandomAction: () => void;
  resetGame: () => void;
  isConnected: boolean;
};

// Create context
const SocketContext = createContext<SocketContextType>({
  socket: null,
  gameState: defaultGameState,
  startCountdown: () => {},
  setAction: () => {},
  getRandomAction: () => {},
  resetGame: () => {},
  isConnected: false,
});

// Socket provider component
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [isConnected, setIsConnected] = useState(false);
  const [useWebSockets, setUseWebSockets] = useState(true);

  useEffect(() => {
    // Try to use WebSockets first
    try {
      const socketInstance = getSocket();
      setSocket(socketInstance);

      // Socket event handlers
      const onConnect = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);
      };

      const onDisconnect = () => {
        console.log("Disconnected from WebSocket server");
        setIsConnected(false);

        // Fall back to polling if WebSockets fail
      };

      const onGameState = (newState: GameState) => {
        console.log("Received game state:", newState);
        setGameState(newState);
      };

      console.log("sockets");
      // Register event handlers
      socketInstance.on("connect", onConnect);
      socketInstance.on("disconnect", onDisconnect);
      socketInstance.on("gameState", onGameState);
      socketInstance.on("connect_error", () => {
        console.log("WebSocket connection error, falling back to polling");
      });

      // Check if already connected
      if (socketInstance.connected) {
        setIsConnected(true);
      }

      // Cleanup on unmount
      return () => {
        socketInstance.off("connect", onConnect);
        socketInstance.off("disconnect", onDisconnect);
        socketInstance.off("gameState", onGameState);
        disconnectSocket();
      };
    } catch (error) {
      console.error("Error initializing WebSockets:", error);
    }
  }, []);

  // Socket action functions
  const startCountdown = (duration: number) => {
    if (useWebSockets) {
      console.log("Starting countdown via WebSocket:", duration);
      socket?.emit("startCountdown", duration);
    } else {
      console.log("Starting countdown via fallback:", duration);
    }
  };

  const setAction = (action: string) => {
    if (useWebSockets) {
      console.log("Setting action via WebSocket:", action);
      socket?.emit("setAction", action);
    } else {
      console.log("Setting action via fallback:", action);
    }
  };

  const getRandomAction = () => {
    if (useWebSockets) {
      console.log("Getting random action via WebSocket");
      socket?.emit("randomAction");
    } else {
      console.log("Getting random action via fallback");
    }
  };

  const resetGame = () => {
    if (useWebSockets) {
      console.log("Resetting game via WebSocket");
      socket?.emit("resetGame");
    } else {
      console.log("Resetting game via fallback");
    }
  };

  // Use either WebSocket or fallback values
  const contextValue = {
    socket,
    gameState,
    startCountdown,
    setAction,
    getRandomAction,
    resetGame,
    isConnected,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom hook to use the socket context
export const useSocket = () => useContext(SocketContext);
