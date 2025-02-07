import { useState, useEffect } from "react";
import DiceRoller from "./DiceRoller";

export default function PlayerCard({ player, onRollComplete }) {
  const [displayedValues, setDisplayedValues] = useState({
    terra: player.terra,
    investmentTokens: player.investmentTokens,
    dealTokens: player.dealTokens,
    borrowTokens: player.borrowTokens,
    voteTokens: player.voteTokens,
    developTokens: player.developTokens,
  });

  const [animatingField, setAnimatingField] = useState(null); // Track which token is animating

  useEffect(() => {
    Object.keys(displayedValues).forEach((field) => {
      if (player[field] !== displayedValues[field]) {
        animateNumberChange(field, player[field]);
      }
    });
  }, [player]);

  function animateNumberChange(field, targetValue) {
    let currentValue = displayedValues[field];
    const step = (targetValue - currentValue) / 20; // Adjust speed

    setAnimatingField(field); // Track the field being updated

    const interval = setInterval(() => {
      currentValue += step;
      if (Math.abs(currentValue - targetValue) < 0.5) {
        clearInterval(interval);
        setDisplayedValues((prev) => ({ ...prev, [field]: targetValue }));
        setAnimatingField(null); // Remove animation effect after finishing
      } else {
        setDisplayedValues((prev) => ({ ...prev, [field]: Math.round(currentValue) }));
      }
    }, 50);
  }

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800">{player.name}</h3>
  
      {/* ✅ Wrap all tokens inside a flex-col div */}
      <div className="mt-2 text-lg flex flex-col space-y-2">
        <div className={`animated-number ${animatingField === "terra" ? "animate" : ""}`}>
          💰 Terra: <span>{displayedValues.terra}</span>
        </div>
        <div className={`animated-number ${animatingField === "investmentTokens" ? "animate" : ""}`}>
          🏡 Investment Tokens: <span>{displayedValues.investmentTokens}</span>
        </div>
        <div className={`animated-number ${animatingField === "dealTokens" ? "animate" : ""}`}>
          📜 Deal Tokens: <span>{displayedValues.dealTokens}</span>
        </div>
        <div className={`animated-number ${animatingField === "borrowTokens" ? "animate" : ""}`}>
          🏦 Borrow Tokens: <span>{displayedValues.borrowTokens}</span>
        </div>
        <div className={`animated-number ${animatingField === "voteTokens" ? "animate" : ""}`}>
          🗳 Vote Tokens: <span>{displayedValues.voteTokens}</span>
        </div>
        <div className={`animated-number ${animatingField === "developTokens" ? "animate" : ""}`}>
          🚀 Develop Tokens: <span>{displayedValues.developTokens}</span>
        </div>
      </div>
  
      <DiceRoller player={player} onRollComplete={onRollComplete} />
    </div>
  );    
}
