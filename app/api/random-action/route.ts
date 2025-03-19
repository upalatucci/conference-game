import { NextResponse } from "next/server";

// List of fun, appropriate actions for conference attendees (in Italian)
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
];

// Reference to the in-memory game state
const gameState = {
  action: "",
  isCountdownActive: false,
  countdown: 0,
  countdownEndTime: 0,
};

export async function POST() {
  // Generate a random action
  const randomIndex = Math.floor(Math.random() * ACTIONS.length);
  const action = ACTIONS[randomIndex];

  // Set the action
  gameState.action = action;

  return NextResponse.json({ success: true, action });
}
