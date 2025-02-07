import PlayerCard from "./PlayerCard";

export default function PlayerList({ players, onRollComplete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.length > 0 ? (
        players.map((player) => (
          <PlayerCard key={player.id} player={player} onRollComplete={onRollComplete} />
        ))
      ) : (
        <p className="text-center col-span-3 text-lg text-gray-300">
          No players yet. Add one to start the game!
        </p>
      )}
    </div>
  );
}
