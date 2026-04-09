import express from "express";

import {getMedicines, addMedicines, updateMedicines, deleteMedicines, getLowQuantityMedicines, getNearExpiryMedicines} from '../controllers/medicineController.js';
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/medicines", authMiddleware, getMedicines);
router.get("/medicines/low_quantity", authMiddleware, getLowQuantityMedicines);
router.get("/medicines/expiry", authMiddleware, getNearExpiryMedicines);

router.post("/medicines",authMiddleware, addMedicines);
router.put("/medicines/:medicine_id", authMiddleware, updateMedicines);
router.delete("/medicines/:medicine_id", authMiddleware, deleteMedicines);


export default router;