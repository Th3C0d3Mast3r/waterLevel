import express from 'express';
const router=express.Router();

router.post("/",(req,res)=>{
  const {distance,ip}=req.body;

  espStatus.isConnected=true;
  espStatus.lastSeen=Date.now();
  espStatus.ipAddress=ip;
  espStatus.level=distance;

  res.status(200).json({ok:true});
});

// Frontend fetches latest water level
router.get("/", (req, res) => {
  res.status(200).json(waterLevelState);
});

export default router;