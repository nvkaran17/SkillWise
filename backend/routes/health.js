// backend/routes/health.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), uptime: process.uptime() });
});

export { router as healthRouter };
