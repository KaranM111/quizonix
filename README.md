# Quizonix

An AI-powered quiz platform:
- **Admin** uploads a PPT, writes a prompt, and AI turns it into 30 MCQs.
- **Students** register/login and take the quiz (30 MCQs, 45 min timer, early submit).
- **Leaderboard** shows rankings overall, by Unit, or by a specific PPT/quiz.

Everything used here is **100% free**:
- **Database:** SQLite (a single file on your own disk — no server, no signup, no bill).
- **AI:** Google Gemini `gemini-1.5-flash` free tier (free API key, no credit card).

---

## 1. Install requirements

You need **Node.js 18+** installed on your computer. Check with:
```
node -v
```
If that fails, download it from https://nodejs.org (LTS version).

---

## 2. Get the project running

```bash
cd quizonix
npm install
```

This downloads all the free libraries the app needs (Express, better-sqlite3, etc.) into a `node_modules` folder.

---

## 3. Create the database (this is the part you asked about)

Quizonix uses **SQLite** through the `better-sqlite3` library. SQLite is not a separate program you install — it's just a `.db` file that lives inside your project. There is nothing to sign up for.

Steps:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in:
   - `JWT_SECRET` — any long random string (used to sign login sessions).
   - `ADMIN_SECRET` — a secret code of your choice. Anyone registering with role "Admin" must type this code — this is what stops random visitors from becoming admins.
   - `GEMINI_API_KEY` — get a **free** key:
     1. Go to https://aistudio.google.com/apikey
     2. Sign in with any Google account.
     3. Click "Create API key" — no credit card required for the free tier.
     4. Paste the key into `.env`.
3. Create the database and tables:
   ```bash
   npm run initdb
   ```
   You'll see: `Quizonix database ready at: .../data/quizonix.db`

   That's it — the database now exists as `data/quizonix.db`. You never need to touch it directly; the app reads/writes it automatically. (If you ever want a clean slate, just stop the server and delete the `data` folder, then run `npm run initdb` again.)

---

## 4. Run the site

```bash
npm start
```

Open **http://localhost:3000** in your browser.

- Go to **Register**, choose "Admin", enter the `ADMIN_SECRET` from your `.env`, and create your admin account.
- Log in as admin → go to the **Admin Panel** → upload a `.pptx`, give it a title/unit, optionally add a prompt (e.g. "focus on definitions"), and click **Generate Quiz with AI**.
- Register a second account as a normal "Student" to try taking the quiz.
- Check the **Leaderboard** page to see rankings by quiz, by unit, or overall.

---

## 5. Putting it online for free (optional)

If you want students to access this from anywhere (not just your own computer), you can deploy it for free on a host like **Render.com** (free web service tier) or **Railway.app**:

1. Push this project to a GitHub repository.
2. Create a new Web Service on Render/Railway pointing at that repo.
3. Set the same environment variables (`JWT_SECRET`, `ADMIN_SECRET`, `GEMINI_API_KEY`) in the host's dashboard.
4. Set the start command to `npm start`.

⚠️ Note: on most free hosting tiers, the disk resets on redeploy, which would wipe your SQLite file and uploaded PPTs. For a class project or short-term use this is usually fine. If you need the data to survive long-term on a free host, look into the host's free "persistent disk" add-on, or swap SQLite for a free-tier hosted database like Turso or Supabase later — the `db.js` file is the only place you'd need to change.

---

## Project structure

```
quizonix/
├── server.js              # App entry point
├── db.js                  # SQLite schema + connection
├── middleware/auth.js      # Login/role checks
├── routes/
│   ├── auth.js             # Register/login/logout
│   ├── admin.js            # PPT upload + AI quiz generation
│   ├── quiz.js              # Taking quizzes + submitting
│   └── leaderboard.js      # Rankings
├── utils/ai.js             # Calls the free Gemini API
├── public/                 # All the HTML/CSS/JS the browser loads
└── data/quizonix.db        # Created automatically — your database
```

## How the AI question generation works

1. When you upload a PPT in the Admin Panel, the server extracts the text from every slide locally (free, using the `officeparser` library — no API call for this step).
2. That text, plus your optional prompt, is sent to Google's free Gemini model, which returns 30 MCQs as structured JSON.
3. The questions are saved to the database and immediately published for students to take.

## Troubleshooting

- **"GEMINI_API_KEY is missing"** — you forgot to fill it into `.env`, or forgot to restart the server after editing `.env`.
- **"Only .ppt or .pptx files are allowed"** — convert your file to `.pptx` first (Google Slides and PowerPoint can both export to `.pptx`).
- **Login doesn't persist** — make sure you're opening the site as `http://localhost:3000` (not `127.0.0.1`) consistently, since cookies are tied to the exact host.
