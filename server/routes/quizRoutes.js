import express from "express";
import { createQuiz, getMyQuizzes, getAllQuizzes, getQuizById,updateQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createQuiz);
router.get("/my", protect, getMyQuizzes);
router.get("/:id", protect, getQuizById);
router.put("/:id", protect, updateQuiz);
router.get("/", getAllQuizzes);

export default router;