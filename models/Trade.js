import mongoose from "mongoose";

const TradeSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    utc_time:{
        type:Date,
        required:true
    },
    market:{
        type:String,
        required:true,
    },
    units:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    cumumtative:{
        type:Object,
    }

})
TradeSchema.index({utc_time:1});

export default mongoose.model("Trade",TradeSchema);