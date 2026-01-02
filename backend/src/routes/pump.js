import express from 'express';
import pumpActivityModel from '../model/pumpActivity.model.js';
const router = express.Router();

let currentState="OFF";


// see the status of the pump, whether  its on or off
router.get("/status", async(req, res)=>{
    res.status(200).json({state:currentState});
});


// toggle the pump's state
router.post("/toggle", async(req, res)=>{
    try{
        const {state, source, note}=req.body;
        
        if(!state || !source){
            return res.status(401).json({message:"State and Source are REQUIRED fields"});
        }
        if (!["ON", "OFF"].includes(state)) {
            return res.status(400).json({ error: "Invalid state" });
        }

        if (!["MANUAL", "ESP", "AUTO"].includes(source)) {
            return res.status(400).json({ error: "Invalid source" });
        }

        currentState=state;
        await pumpActivityModel.create({state, source, note});
        return res.status(200).json({message: "Pump state Updated- "+state});
    }
    catch(error){
        res.status(500).json({message: "Something went wrong", error:error.message});
        return
    }
});

// for the below dashboard, where all this is needed-we have this present
router.get("/activity", async (req, res)=>{
    const logs = await pumpActivityModel.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
});

export default router;