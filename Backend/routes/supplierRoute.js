import express from "express"
import { addSupplierDetails, UpdateSupplierInfo, getSupplierPurchases, getSupplier } from "../controllers/supplierController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/supplier", authMiddleware, authorizeRole(['staff']),  addSupplierDetails);
router.put("/supplier/:supplier_id", authMiddleware , authorizeRole(['staff']), UpdateSupplierInfo);
router.get("/supplier", authMiddleware, authorizeRole(['staff']), getSupplier)

export default router;
router.get("/suppliers/:supplier_id/purchases", authMiddleware, getSupplierPurchases);