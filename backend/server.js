import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {connectDB} from "./src/db/database.js";
import espAckRoute from "./src/routes/esp-ack.js";
import pumpRoute from "./src/routes/pump.js";
import waterLevelRoute from "./src/routes/waterLevel.js";
import analyticsRoute from "./src/routes/analytics.js";


const app=express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
dotenv.config();

connectDB();
const PORT=process.env.PORT || 8808;


app.get("/",(req,res)=>{
    res.send("Water Level Monitoring Backend is running");
});

// register route
app.use("/esp-ack", espAckRoute);

// pump based activities in the DB
app.use("/pump", pumpRoute);

// constant water level measurement route
app.use("/waterLevel", waterLevelRoute)

// this is the route that I use for the graphs and stuff
app.use("/analytics", analyticsRoute);

app.listen(PORT, "0.0.0.0",()=>{
    console.log(`Server is running on port ${PORT}`);
});