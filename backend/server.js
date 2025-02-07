require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5001;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Connect to SQLite database (creates a file locally)
const db = new sqlite3.Database("./tierra.db", (err) => {
  if (err) console.error("Error connecting to database", err);
  else console.log("Connected to SQLite database.");
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    terra INTEGER DEFAULT 0,
    investmentTokens INTEGER DEFAULT 0,
    dealTokens INTEGER DEFAULT 0,
    borrowTokens INTEGER DEFAULT 0,
    voteTokens INTEGER DEFAULT 0,
    developTokens INTEGER DEFAULT 0
  )`);
});

// API to create a player
app.post("/create-player", (req, res) => {
  const { name } = req.body;
  db.run(`INSERT INTO players (name) VALUES (?)`, [name], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ success: true, playerId: this.lastID });
  });
});

// API to fetch all players
app.get("/players", (req, res) => {
  db.all(`SELECT * FROM players`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API to roll dice
app.post("/update-token", (req, res) => {
  const { playerId, field } = req.body;

  if (!playerId || !field) {
    return res.status(400).json({ error: "Missing playerId or field" });
  }

  db.run(`UPDATE players SET ${field} = ${field} + 1 WHERE id = ?`, [playerId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: `${field} updated!` });
  });
});

// API to get player details
app.get("/player/:id", (req, res) => {
  db.get(`SELECT * FROM players WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
