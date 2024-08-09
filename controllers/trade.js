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
                    
                    prev = await addtoDB(prev, row);
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
    
    const trade = await Trade
            .find({ UTC_Time: { $lte: new_date } }) 
            .sort({ UTC_Time: -1 })
            .limit(1) 
    console.log(trade)
    res.status(200).json(trade[0].cumm)
};

const addtoDB = async (prev, row) => {

    row['units']=row['Buy/Sell Amount']
    delete row['Buy/Sell Amount'];
    const mark=row.Market.split("/")[0]
    if(prev)
      row.cumm = { ...prev.cumm };
    else
       row.cumm = {};

    
    if (typeof row.cumm[mark] !== 'number') {
        row.cumm[mark] = 0; 
    }
    if(row.Operation=='Sell'){

       row.cumm[mark]-=parseInt(row.units)  
    }     
    else{
      row.cumm[mark]+=parseInt(row.units)
    }

    if(row.cumm[mark]==0)
        delete row.cumm[mark]

    const new_trade=new Trade(row)

    await new_trade.save();

    return new_trade


};

