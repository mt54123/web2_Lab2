import express, {} from "express";
import { pool } from "../db/db.js";
const router = express.Router();
// Globalno stanje Secure Mode
let secureMode = false;
// Middleware za provjeru rola (samo ako je secureMode ON)
function requireRole(role) {
    return (req, res, next) => {
        const user = req.session.user;
        if (!user)
            return res.status(401).json({ error: "Niste prijavljeni" });
        if (secureMode && user.role !== role)
            return res.status(403).json({ error: "Nemate ovlasti" });
        next();
    };
}
// Dobivanje svih korisnika
router.get("/users", requireRole("admin"), async (_req, res) => {
    try {
        const result = await pool.query("SELECT id, username, role FROM usersbac");
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Greška na serveru" });
    }
});
// Toggle secure mode
router.post("/toggleSecurity", (_req, res) => {
    secureMode = !secureMode;
    res.json({ secureMode });
});
// Admin Panel stranica
router.get("/", (req, res) => {
    const user = req.session.user;
    if (secureMode && (!user || user.role !== "admin")) {
        return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="hr">
      <head><meta charset="UTF-8"><title>Pristup odbijen</title></head>
      <body>
        <h1>Pristup odbijen</h1>
        <p>Nemate ovlasti za ovu stranicu!</p>
        <a href="/badauth.html">← Povratak na BAC stranicu</a>
      </body>
      </html>
    `);
    }
    res.send(`
    <!DOCTYPE html>
    <html lang="hr">
    <head><meta charset="UTF-8"><title>Admin Panel</title></head>
    <body>
      <h1>Admin mogućnosti</h1>
      <p>Samo admin korisnici mogu ovo vidjeti kad je Secure Mode ON.</p>
      <a href="/badauth.html">Povratak na BAC stranicu</a>
    </body>
    </html>
  `);
});
// GET trenutno stanje secureMode
router.get("/secureMode", (_req, res) => {
    res.json({ secureMode });
});
export default router;
//# sourceMappingURL=adminRoutes.js.map