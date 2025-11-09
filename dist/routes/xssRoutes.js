import express, {} from "express";
const router = express.Router();
const comments = [];
let nextId = 1;
let vulnerable = true;
router.post("/toggle", (_req, res) => {
    vulnerable = !vulnerable;
    res.json({ vulnerable });
});
router.get("/state", (_req, res) => {
    res.json({ vulnerable });
});
router.get("/comments", (_req, res) => {
    res.json({ comments, vulnerable });
});
router.post("/comments", (req, res) => {
    const { text = "" } = req.body ?? {};
    const c = { id: nextId++, text: String(text) };
    comments.push(c);
    res.json({ ok: true, comment: c });
});
export default router;
//# sourceMappingURL=xssRoutes.js.map