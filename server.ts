import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");
const SECRET = process.env.JWT_SECRET || "career-path-secret-2026";

// Initialize low-fidelity DB
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], profiles: [] }));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const saveDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

app.use(cors());
app.use(express.json());

// Auth API
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const db = getDB();
  if (db.users.find((u: any) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), email, password: hashedPassword, name };
  db.users.push(newUser);
  saveDB(db);
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET);
  res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Profile API
app.get("/api/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded: any = jwt.verify(token, SECRET);
    const db = getDB();
    const profile = db.profiles.find((p: any) => p.userId === decoded.id) || null;
    res.json(profile);
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/api/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded: any = jwt.verify(token, SECRET);
    const db = getDB();
    const existingIndex = db.profiles.findIndex((p: any) => p.userId === decoded.id);
    const profile = { ...req.body, userId: decoded.id };
    if (existingIndex > -1) {
      db.profiles[existingIndex] = profile;
    } else {
      db.profiles.push(profile);
    }
    saveDB(db);
    res.json(profile);
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
