import express from "express"

// import authmiddleware for protected route
import authMiddleware from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { addSales } from "../controllers/salesController.js";

const router = express.Router();

router.post("/sales", authMiddleware,authorizeRole(["staff"]), addSales);


export default router;
