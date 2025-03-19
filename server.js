const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Game state
const gameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
}

// Store active countdown interval
let countdownInterval = null

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  // Socket.IO connection handler
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Send current game state to new client
    socket.emit("gameState", gameState)

    // Handle admin actions
    socket.on("startCountdown", (duration) => {
      if (!gameState.action) return

      gameState.isCountdownActive = true
      gameState.countdown = duration
      gameState.countdownEndTime = Date.now() + duration * 1000

      // Clear any existing interval
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }

      // Start countdown timer
      countdownInterval = setInterval(() => {
        if (!gameState.isCountdownActive) {
          if (countdownInterval) clearInterval(countdownInterval)
          return
        }

        const now = Date.now()
        const remaining = Math.max(0, Math.ceil((gameState.countdownEndTime - now) / 1000))

        gameState.countdown = remaining

        if (remaining === 0) {
          gameState.isCountdownActive = false
          if (countdownInterval) clearInterval(countdownInterval)
        }

        // Broadcast updated countdown to all clients
        io.emit("gameState", gameState)
      }, 1000)

      // Broadcast to all clients
      io.emit("gameState", gameState)
    })

    socket.on("setAction", (action) => {
      gameState.action = action
      io.emit("gameState", gameState)
    })

    socket.on("randomAction", () => {
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
        "Fingi di dirigere un'orchestra",
        "Mostra la tua migliore impressione di una statua",
        "Comportati come se stessi camminando contro un vento forte",
        "Fingi di essere in una scatola invisibile",
        "Fai la tua migliore impressione di un albero",
        "Comportati come se avessi appena avuto un'idea brillante",
        "Fingi di scattare una foto del palco",
        "Mostra la tua migliore impressione di una rockstar",
      ]

      const randomIndex = Math.floor(Math.random() * ACTIONS.length)
      gameState.action = ACTIONS[randomIndex]
      io.emit("gameState", gameState)
    })

    socket.on("resetGame", () => {
      gameState.action = ""
      gameState.isCountdownActive = false
      gameState.countdown = 0
      gameState.countdownEndTime = 0

      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }

      io.emit("gameState", gameState)
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  // Start the server
  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})

