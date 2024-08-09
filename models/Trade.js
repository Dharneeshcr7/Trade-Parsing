import mongoose from "mongoose";

const TradeSchema=new mongoose.Schema({
    User_ID:{
        type:String,
        required:true
    },
    UTC_Time:{
        type:Date,
        required:true
    },
    Market:{
        type:String,
        required:true,
    },
    units:{
        type:Number,
        required:true,
    },
    Price:{
        type:Number,
        required:true,
    },
    Operation:{
        type:String,
        required:true,
    }

})
TradeSchema.index({UTC_Time:1});

export default mongoose.model("Trade",TradeSchema);