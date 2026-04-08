require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname)));

const DB = "./db.json";

// DB helpers
function readDB() {
  if (!fs.existsSync(DB)) {
    fs.writeFileSync(DB, JSON.stringify({ users: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB));
}

function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Signup
app.post("/signup", (req, res) => {
  let db = readDB();
  let { username, password } = req.body;

  if (db.users.find(u => u.username === username)) {
    return res.json({ success: false });
  }

  db.users.push({ username, password, history: [] });
  writeDB(db);

  res.json({ success: true });
});

// Login
app.post("/login", (req, res) => {
  let db = readDB();
  let { username, password } = req.body;

  let user = db.users.find(
    u => u.username === username && u.password === password
  );

  res.json({ success: !!user });
});

// Save history
app.post("/history", (req, res) => {
  let db = readDB();
  let { username, topic } = req.body;

  let user = db.users.find(u => u.username === username);
  if (!user) return res.json({ success: false });

  if (!user.history) user.history = [];

  user.history.unshift(topic);
  user.history = [...new Set(user.history)].slice(0, 10);

  writeDB(db);
  res.json({ success: true });
});

// Get history
app.get("/history/:username", (req, res) => {
  let db = readDB();
  let user = db.users.find(u => u.username === req.params.username);
  res.json(user ? user.history : []);
});

// AI Notes
app.post("/ai-notes", async (req, res) => {
  const { topic } = req.body;

  if (!topic) return res.status(400).json({ error: "Topic required" });
  if (!process.env.GROQ_API_KEY)
    return res.status(500).json({ error: "API key missing" });

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.GROQ_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: `Create structured exam notes for: ${topic}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      text: data.choices?.[0]?.message?.content || "AI failed"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ IMPORTANT FIX (Render compatibility)
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
