require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const { getDb } = require("./db");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const quizRoutes = require("./routes/quiz");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET || !process.env.ADMIN_SECRET) {
  console.warn(
    "\n⚠️  Warning: JWT_SECRET / ADMIN_SECRET not set. Copy .env.example to .env and fill it in.\n"
  );
}

// Make sure the database + tables exist before we start handling requests
getDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.listen(PORT, () => {
  console.log(`Quizonix server running at http://localhost:${PORT}`);
});
