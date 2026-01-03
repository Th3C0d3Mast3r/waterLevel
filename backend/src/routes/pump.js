import express from 'express';
import pumpActivityModel from '../model/pumpActivity.model.js';
import { waterLevelState } from './waterLevel.js'

const router = express.Router()

let currentState = "OFF"

// GET pump status
router.get("/status", (req, res) => {
  res.status(200).json({
    state: currentState
  })
})

// TOGGLE pump (MANUAL / ESP)
router.post("/toggle", async (req, res) => {
  try {
    const { state, source, note } = req.body

    if (!state || !source) {
      return res.status(400).json({ message: "State and Source required" })
    }

    if (!["ON", "OFF"].includes(state)) {
      return res.status(400).json({ error: "Invalid state" })
    }

    if (!["MANUAL", "ESP", "AUTO"].includes(source)) {
      return res.status(400).json({ error: "Invalid source" })
    }

    currentState = state

    await pumpActivityModel.create({
      state,
      source,
      note,
      waterLevel: waterLevelState.distance ?? 0 // ✅ FIX
    })

    res.status(200).json({ state })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ACTIVITY LOG
router.get("/activity", async (req, res) => {
  const logs = await pumpActivityModel
    .find()
    .sort({ createdAt: -1 })
    .limit(50)

  res.json(logs)
})

// DAILY EVENTS
router.get("/dailyEvents", async (req, res) => {
  try {
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setHours(23, 59, 59, 999)

    const events = await pumpActivityModel.find({
      createdAt: { $gte: start, $lte: end }
    })

    res.json({
      totalEvents: events.length,
      onEvents: events.filter(e => e.state === "ON").length,
      offEvents: events.filter(e => e.state === "OFF").length
    })
  } catch {
    res.status(500).json({ error: "Failed to fetch daily events" })
  }
})

export default router