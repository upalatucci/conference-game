import { io, type Socket } from "socket.io-client";

// Game state type
export type GameState = {
  action: string;
  isCountdownActive: boolean;
  countdown: number;
  countdownEndTime: number;
};

// Create a singleton socket instance
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // Get the correct WebSocket URL based on environment
    const socketUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    socket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
      path: "/socket.io", // Default Socket.IO path
      transports: ["websocket", "polling"], // Try WebSocket first, then fall back to polling
    });

    // Add error logging
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
