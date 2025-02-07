import { useState } from "react";
import Image from "next/image";
import { getRandomDiceRoll, getTokenFromRoll } from "../utils/diceLogic";
import { updatePlayerToken } from "../services/api";

export default function DiceRoller({ player, onRollComplete }) {
  const [diceRoll, setDiceRoll] = useState(null);
  const [rolledTokenName, setRolledTokenName] = useState("");
  const [isRolling, setIsRolling] = useState(false);

  async function rollDice() {
    setIsRolling(true);

    let tempRoll = 1;
    const rollingInterval = setInterval(() => {
      tempRoll = getRandomDiceRoll();
      setDiceRoll(tempRoll);
    }, 100);

    setTimeout(async () => {
      clearInterval(rollingInterval);
      const finalRoll = getRandomDiceRoll();
      setDiceRoll(finalRoll);
      setIsRolling(false);

      const { field, name } = getTokenFromRoll(finalRoll);
      setRolledTokenName(name);

      await updatePlayerToken(player.id, field);
      onRollComplete(); // Refresh player data
    }, 2000);
  }

  return (
    <div className="text-center">
      {diceRoll !== null && (
        <div className="mb-4">
          <Image
            src={`/dice/dice${diceRoll}.png`}
            alt={`Dice ${diceRoll}`}
            width={80}
            height={80}
            className={`transition-transform ${isRolling ? "animate-dice-roll" : ""}`}
          />
        </div>
      )}
      <button
        onClick={rollDice}
        className={`p-3 w-full ${
          isRolling ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        } text-white rounded-md`}
        disabled={isRolling}
      >
        🎲 Roll Dice
      </button>
      {!isRolling && rolledTokenName && (
        <p className="text-green-300">You received a {rolledTokenName}!</p>
      )}
    </div>
  );
}
