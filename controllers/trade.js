import csv from "csv-parser";
import {Readable} from "stream";
import Trade from "../models/Trade.js";
import moment from "moment";
export const addData = async (req, res, next) => {
    try {
        const fileData = req.file.buffer;
        const stream = Readable.from(fileData);
        let prev = await Trade.findOne().sort({ UTC_Time: -1 });

        const rows = [];
        stream.pipe(csv())
            .on('data', (row) => {
                rows.push(row); 
            })
            .on('end', async () => {
                for (const row of rows) {
                    row['units']=row['Buy/Sell Amount']
                    delete row['Buy/Sell Amount'];
                    const mark=row.Market.split("/")[0]
                    
                    const new_trade=new Trade(row)

                    await new_trade.save();
                }
                res.status(200).json({ message: 'Data added successfully!' });
            })
            .on('error', (err) => {
                next(err); 
            });

    } catch (err) {
        next(err); 
    }
};

export const getBalance = async (req, res) => {
    
    const new_date=moment(req.body.timestamp, 'YYYY-MM-DD HH:mm:ss').toDate();
    
    const trades = await Trade
            .find({ UTC_Time: { $lte: new_date } }) 
            .sort({ UTC_Time: 1 })
    let cumm={}
    
    for (const trade of trades){
        const mark=trade.Market.split("/")[0]
        
        if (typeof cumm[mark] !== 'number') {
            cumm[mark] = 0; 
        }
        if(trade.Operation=='Sell'){

        cumm[mark]-=parseInt(trade.units)  
        }     
        else{
        cumm[mark]+=parseInt(trade.units)
        }

        if(cumm[mark]==0)
            delete cumm[mark]

    }
    return res.status(200).json(cumm)
            
    
};


