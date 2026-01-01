import express from "express";
const router = express.Router();

let espStatus = {
  isConnected:false,
  ipAddress:null,
  lastSeen:0
};

// POST: ESP sends ACK
router.post("/", (req, res) => {
  const { ip } = req.body;

  espStatus.isConnected = true;
  espStatus.ipAddress = ip;
  espStatus.lastSeen = Date.now();

  return res.status(200).json({ message: "ACK Received" });
});

// router.post("/", (req, res) => {
//   console.log("🔥 POST /esp-ack HIT");
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);

//   res.status(200).json({ ok: true });
// });


// GET: Frontend fetches status
router.get("/", (req, res) => {
  const now = Date.now();
  
  if(now-espStatus.lastSeen>15000) {
    espStatus.isConnected=false;
    espStatus.ipAddress=null;
  }

  res.status(200).json(espStatus);
});

export default router;
