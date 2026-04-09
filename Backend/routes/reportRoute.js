import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { dailySalesReport, monthlySalesReport, expiryReport, stockReport } from "../controllers/reportsController.js";
const router = express.Router();




router.get("/daily", authMiddleware, authorizeRole(["staff"]), dailySalesReport);
router.get("/monthly", authMiddleware, authorizeRole(["staff"]), monthlySalesReport);
router.get("/stock", authMiddleware, authorizeRole(["staff"]), stockReport);
router.get("/expiry", authMiddleware, authorizeRole(["staff"]), expiryReport);

export default router;