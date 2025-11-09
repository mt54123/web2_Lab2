import express, { type Request, type Response } from "express";

const router = express.Router();

const comments: Array<{ id: number; text: string }> = [];
let nextId = 1;

let vulnerable = true;

router.post("/toggle", (_req: Request, res: Response) => {
  vulnerable = !vulnerable;
  res.json({ vulnerable });
});

router.get("/state", (_req: Request, res: Response) => {
  res.json({ vulnerable });
});


router.get("/comments", (_req: Request, res: Response) => {
  res.json({ comments, vulnerable });
});


router.post("/comments", (req: Request, res: Response) => {
  const { text = "" } = req.body ?? {};
  const c = { id: nextId++, text: String(text) };
  comments.push(c);
  res.json({ ok: true, comment: c });
});

export default router;
