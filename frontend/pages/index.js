import { useState, useEffect } from "react";
import { fetchPlayers, createPlayer } from "../services/api";
import PlayerList from "../components/PlayerList";
import MuralCanvas from "@/components/MuralCanvas";

export default function TierraGame() {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    const data = await fetchPlayers();
    setPlayers(data);
  }

  async function handleCreatePlayer() {
    if (!newPlayer.trim()) return;
    await createPlayer(newPlayer);
    setNewPlayer("");
    loadPlayers();
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white p-10">
      <h1 className="text-4xl font-bold text-center mb-6">🎲 Tierra - Local Game</h1>
      <div>
      <h1>Welcome to The Wall</h1>
      <MuralCanvas />
    </div>
      {/* Create Player */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Enter player name"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          className="p-3 text-black rounded-md border border-gray-300"
        />
        <button onClick={handleCreatePlayer} className="ml-2 p-3 bg-green-500 text-white rounded-md">
          Create Player
        </button>
      </div>

      {/* Player List */}
      <PlayerList players={players} onRollComplete={loadPlayers} />
    </div>
  );
}
