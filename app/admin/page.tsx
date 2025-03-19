"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Play, RefreshCw, Sparkles, Plus, Music, Wifi, WifiOff } from "lucide-react"
import { useSocket } from "../socket-provider"

export default function AdminPage() {
  const { gameState, startCountdown, setAction, getRandomAction, resetGame, isConnected } = useSocket()
  const [countdownDuration, setCountdownDuration] = useState("5")
  const [customAction, setCustomAction] = useState("")

  // Set a custom action
  const handleSetAction = () => {
    if (!customAction.trim()) return
    console.log("Setting custom action:", customAction)
    setAction(customAction)
    setCustomAction("")
  }

  // Start the countdown
  const handleStartCountdown = () => {
    console.log("Starting countdown with duration:", countdownDuration)
    startCountdown(Number.parseInt(countdownDuration))
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pannello di Controllo
              </span>
            </h1>
            <div className="mt-2 flex justify-center items-center gap-2">
              <Music className="h-8 w-8 text-pink-400" />
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
          </div>

          <div className="space-y-8">
            {/* Current Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg"
            >
              <h2 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Stato Attuale
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white/5 p-4">
                  <h3 className="mb-2 text-sm font-medium text-white/60">Azione Corrente</h3>
                  <p className="text-lg font-semibold text-white">{gameState.action || "Nessuna azione impostata"}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <h3 className="mb-2 text-sm font-medium text-white/60">Conto alla Rovescia</h3>
                  <div className="flex items-center gap-2">
                    {gameState.isCountdownActive ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                        <p className="text-lg font-semibold text-white">Attivo ({gameState.countdown}s)</p>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 rounded-full bg-white/30"></div>
                        <p className="text-lg font-semibold text-white">Non attivo</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg"
            >
              <h2 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Imposta Azione
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={getRandomAction}
                    disabled={!isConnected}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Azione Casuale
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={customAction}
                    onChange={(e) => setCustomAction(e.target.value)}
                    placeholder="Inserisci un'azione personalizzata..."
                    className="flex-1 border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                  <Button
                    onClick={handleSetAction}
                    disabled={!customAction.trim() || !isConnected}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Imposta
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Countdown Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white/10 p-6 backdrop-blur-lg"
            >
              <h2 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Avvia Conto alla Rovescia
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="w-full sm:w-40">
                  <Label htmlFor="countdown-duration" className="text-white/80">
                    Durata (secondi)
                  </Label>
                  <Select value={countdownDuration} onValueChange={setCountdownDuration}>
                    <SelectTrigger id="countdown-duration" className="border-white/20 bg-white/5 text-white">
                      <SelectValue placeholder="Seleziona durata" />
                    </SelectTrigger>
                    <SelectContent className="bg-indigo-900 text-white">
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleStartCountdown}
                  disabled={gameState.isCountdownActive || !gameState.action || !isConnected}
                  className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  Avvia Conto alla Rovescia
                </Button>
              </div>
            </motion.div>

            {/* Reset Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end"
            >
              <Button
                variant="outline"
                onClick={resetGame}
                disabled={!isConnected}
                className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reimposta Gioco
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

