import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { addUsers, updateRole, DeleteUser, getUser, getSetting, updateSettings  } from "../controllers/adminController.js";


const router = express.Router();


router.get("/admin/get-user", authMiddleware, authorizeRole(["admin"]), getUser);
router.get("/admin/getsetting",authMiddleware, authorizeRole(["admin"]), getSetting);

router.post("/admin/add-user", authMiddleware, authorizeRole(["admin"]), addUsers);
router.put("/admin/update-role/:id", authMiddleware, authorizeRole(["admin"]), updateRole);
router.put("/admin/update-setting/:key", authMiddleware, authorizeRole(["admin"]), updateSettings);
router.delete("/admin/delete-user/:id", authMiddleware, authorizeRole(["admin"]), DeleteUser);





export default router;