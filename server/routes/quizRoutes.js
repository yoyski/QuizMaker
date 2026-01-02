import express from "express";
import { createQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createQuiz);

export default router;