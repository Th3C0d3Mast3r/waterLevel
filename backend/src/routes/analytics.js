import express from "express";
import PumpActivity from "../model/pumpActivity.model.js";

const router = express.Router();

router.get("/daily", async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Only OFF events represent completed cycles
    const records = await PumpActivity.find({
      state: "OFF",
      createdAt: { $gte: since },
    });

    const buckets = {};

    records.forEach((r) => {
      const hour = new Date(r.createdAt).getHours();
      const key = `${hour}:00`;

      if (!buckets[key]) {
        buckets[key] = {
          time: key,
          cycles: 0,
          totalDuration: 0,
          totalWater: 0,
        };
      }

      buckets[key].cycles += 1;
      buckets[key].totalDuration += r.duration ?? 0;
      buckets[key].totalWater += r.waterLevel;
    });

    const result = Object.values(buckets)
      .map((b) => ({
        time: b.time,
        cycles: b.cycles,
        avgDuration: Math.round(b.totalDuration / b.cycles),
        waterLevel: Math.round(b.totalWater / b.cycles),
      }))
      .sort((a, b) => parseInt(a.time) - parseInt(b.time));

    res.status(200).json(result);
  } catch (err) {
    console.error("Daily analytics error:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
