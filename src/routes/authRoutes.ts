import express, { type Request, type Response } from "express";
import { pool } from "../db/db.js";

const router = express.Router();

// login
router.post("/login", async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, username, role FROM usersbac WHERE username = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Korisnik ne postoji" });
    }

    const user = result.rows[0];
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    res.json({ message: `Prijavljen kao ${user.username}`, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška na serveru" });
  }
});

// logout
router.post("/logout", (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Greška pri odjavi" });
    res.json({ message: "Odjavljeno" });
  });
});

// trenutni user (persistent login)
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({
      username: req.session.user.username,
      role: req.session.user.role
    });
  } else {
    res.status(401).json({ error: "Nije prijavljen" });
  }
});

export default router;
