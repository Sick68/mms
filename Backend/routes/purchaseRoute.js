import express from "express";
import { addPurchase, makeInvoice  } from "../controllers/purchaseController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/purchase", authMiddleware, addPurchase);
router.get("/purchases/:purchase_id/invoice", authMiddleware,  makeInvoice);

export default router;