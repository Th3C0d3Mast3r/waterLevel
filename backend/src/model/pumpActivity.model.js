import mongoose from 'mongoose';
const pumpActivitySchema = new mongoose.Schema(
  {
    state:{
        type: String, enum: ['ON', 'OFF'],
        required: true,
    },
    source:{
        type:String, enum: ["MANUAL", "ESP", "FRONTEND"],
        required: true,
    },
    waterLevel: {
      type: Number, // in cm
      required: true
    },
    duration: {
      type: Number, // minutes pump was ON
      default: null
    },
    note:{
        type:String,
    },
    lastToggleTime:{
        type:Date, 
        default: Date.now,
    },
  },
  {timestamps: true,}
);

export default mongoose.model('PumpActivity', pumpActivitySchema);