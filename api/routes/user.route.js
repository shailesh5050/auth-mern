import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { updateUser, deleteUser } from "../controller/user.controller.js";
const router = express.Router();

router.post("/update/:id", verifyToken, updateUser);
router.post("/delete/:id", verifyToken, deleteUser);

export default router;
