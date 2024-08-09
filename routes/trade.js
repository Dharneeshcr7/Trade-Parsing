import express from "express";
import multer from "multer";
import { addData,getBalance } from "../controllers/trade.js";

const router=express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/addTrade",upload.single('file'),addData);
router.get("/getBalance",getBalance);

export default router;