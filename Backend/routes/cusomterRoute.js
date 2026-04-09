import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addCustomerDetails, getPurchaseHistory, getCustomersList } from "../controllers/customerController.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
const router = express.Router();

router.post("/customer", authMiddleware, authorizeRole(['staff']), addCustomerDetails );
router.get("/customers/:customer_id", authMiddleware, authorizeRole(['staff']), getPurchaseHistory );
router.get("/customers", authMiddleware, authorizeRole(['staff', 'admin']), getCustomersList);

export default router;



