import express from "express";
import { addData,getBalance } from "../controllers/trade";

const router=express.Router();

router.post("/addTrade",addData);
router.get("/getBalance",getBalance);