"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Zap,
  Rocket,
  PartyPopper,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useSocket } from "./socket-provider";

export default function ConferenceGame() {
  const { gameState, setAction, isConnected } = useSocket();
  const [isMounted, setIsMounted] = useState(false);
  const [localGameState, setLocalGameState] = useState("waiting"); // waiting, ready, countdown, completed

  // Generate a random action
  const generateAction = () => {
    const ACTIONS = [
      "Fai la tua migliore posa da supereroe",
      "Fai la tua migliore impressione di un robot",
      "Fingi di scattare un selfie",
      "Fai una faccia sorpresa",
      "Fingi di digitare molto velocemente",
      "Fai un assolo di chitarra immaginaria",
      "Fingi di rispondere a una telefonata importante",
      "Mostra il tuo miglior passo di danza",
      "Fingi di aver appena vinto un premio",
      "Fai la tua migliore posa da supereroe",
      "Fingi di nuotare",
      "Muoviti come se fossi al rallentatore",
      "Fingi di dirigere un&apos;orchestra",
      "Mostra la tua migliore impressione di una statua",
      "Comportati come se stessi camminando contro un vento forte",
      "Fingi di essere in una scatola invisibile",
      "Fai la tua migliore impressione di un albero",
      "Comportati come se avessi appena avuto un&apos;idea brillante",
      "Fingi di scattare una foto del palco",
      "Mostra la tua migliore impressione di una rockstar",
    ];
    const randomIndex = Math.floor(Math.random() * ACTIONS.length);
    return ACTIONS[randomIndex];
  };

  // Set a new action (for visitors to see)
  const setNewAction = () => {
    const newAction = generateAction();
    setAction(newAction);
    setLocalGameState("ready");
  };

  // Trigger confetti explosion
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  // Update local game state based on socket game state
  useEffect(() => {
    if (gameState.action && localGameState === "waiting") {
      setLocalGameState("ready");
    }

    if (gameState.isCountdownActive) {
      setLocalGameState("countdown");
    } else if (gameState.countdown === 0 && localGameState === "countdown") {
      setLocalGameState("completed");
      triggerConfetti();
    }

    if (!gameState.action && localGameState !== "waiting") {
      setLocalGameState("waiting");
    }
  }, [gameState, localGameState]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-yellow-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {isMounted && (
          <AnimatePresence>
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                initial={{
                  x:
                    Math.random() *
                    (typeof window !== "undefined" ? window.innerWidth : 1000),
                  y:
                    Math.random() *
                    (typeof window !== "undefined" ? window.innerHeight : 800),
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
                animate={{
                  y: [
                    null,
                    Math.random() *
                      (typeof window !== "undefined"
                        ? window.innerHeight
                        : 800),
                  ],
                  x: [
                    null,
                    Math.random() *
                      (typeof window !== "undefined"
                        ? window.innerWidth
                        : 1000),
                  ],
                  transition: {
                    duration: Math.random() * 20 + 10,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  },
                }}
                style={{
                  width: `${Math.random() * 100 + 20}px`,
                  height: `${Math.random() * 100 + 20}px`,
                }}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
              <span className="inline-block bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Azione Pazza!
              </span>
            </h1>
            <div className="mt-2 flex justify-center">
              {isConnected ? (
                <div className="flex items-center gap-1 text-green-400">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">Connesso</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs">Disconnesso</span>
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {localGameState === "waiting" && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/10 p-8 backdrop-blur-lg"
              >
                <div className="mb-8 flex flex-col items-center space-y-6">
                  <div className="flex h-40 w-40 items-center justify-center">
                    <PartyPopper className="h-32 w-32 text-yellow-300" />
                  </div>
                  <p className="text-center text-xl font-medium text-white/90">
                    Preparati per il divertimento! L&apos;organizzatore mostrerà
                    presto un&apos;azione.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={setNewAction}
                    disabled={!isConnected}
                    className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-6 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-pink-500/25 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Mostra Nuova Azione
                    </span>
                    <span className="absolute inset-0 z-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  </Button>
                </div>
              </motion.div>
            )}

            {localGameState === "ready" && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/10 p-8 backdrop-blur-lg"
              >
                <div className="mb-8 space-y-6">
                  <div className="rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-8">
                    <h2 className="mb-4 text-2xl font-bold text-white/90">
                      Preparati a:
                    </h2>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">
                      {gameState.action}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-white/90">
                      <Zap className="h-5 w-5 text-yellow-300" />
                      <p className="text-lg font-medium">
                        Aspetta il conto alla rovescia!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {localGameState === "countdown" && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/10 p-8 backdrop-blur-lg"
              >
                <div className="mb-8 space-y-6">
                  <div className="rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-8">
                    <h2 className="mb-4 text-2xl font-bold text-white/90">
                      Preparati a:
                    </h2>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">
                      {gameState.action}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-pink-500/30"></div>
                      <motion.div
                        key={gameState.countdown}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                      >
                        <span className="text-8xl font-extrabold">
                          {gameState.countdown}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {localGameState === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white/10 p-8 backdrop-blur-lg"
              >
                <div className="mb-8 space-y-6">
                  <motion.div
                    className="rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="mb-4 text-2xl font-bold text-white/90">
                      Tutti insieme:
                    </h2>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400">
                      {gameState.action}
                    </p>
                    <p className="mt-4 text-xl font-medium text-white/90">
                      Fallo ora!
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex justify-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={setNewAction}
                      disabled={!isConnected}
                      className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-6 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-pink-500/25 disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Rocket className="h-5 w-5" />
                        Nuova Azione
                      </span>
                      <span className="absolute inset-0 z-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
