import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"; // ✅ Uses .env value

export async function fetchPlayers() {
  const res = await axios.get(`${BASE_URL}/players`);
  return res.data;
}

export async function createPlayer(name) {
  await axios.post(`${BASE_URL}/create-player`, { name });
}

export async function updatePlayerToken(playerId, field) {
  await axios.post(`${BASE_URL}/update-token`, { playerId, field });
}
