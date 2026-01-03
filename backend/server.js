import axios from "axios";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {connectDB} from "./src/db/database.js";
import configureRouter from "./src/routes/esp-ack.js";
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
const PORT=process.env.PORT || 7892;


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

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});