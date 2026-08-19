const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../db");

const router = express.Router();

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 8, // 8 hours
};

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password, role, adminSecret } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  let finalRole = "user";
  if (role === "admin") {
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: "Incorrect admin signup code." });
    }
    finalRole = "admin";
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)")
    .run(name.trim(), email.toLowerCase().trim(), hash, finalRole);

  const user = { id: info.lastInsertRowid, name, email: email.toLowerCase(), role: finalRole };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.cookie("token", token, COOKIE_OPTS);
  res.json({ user });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (!row || !bcrypt.compareSync(password, row.password)) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.cookie("token", token, COOKIE_OPTS);
  res.json({ user });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ user: null });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user });
  } catch {
    res.json({ user: null });
  }
});

module.exports = router;
