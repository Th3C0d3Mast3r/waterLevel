import express from "express";
const router = express.Router();

// SHARED STATE
export const waterLevelState = {
  distance: null,
  unit: "cm",
  lastUpdated: null,
  ip: null
}

// ESP sends water level
router.post("/", (req, res) => {
  const { distance, ip } = req.body;

  if (typeof distance !== "number") {
    return res.status(400).json({ error: "Invalid distance" });
  }

  waterLevelState.distance = distance;
  waterLevelState.lastUpdated = Date.now();
  waterLevelState.ip = ip;

  return res.status(200).json({ ok: true });
});

// Frontend fetches water level
router.get("/", (req, res) => {
  return res.status(200).json(waterLevelState);
});

export default router;