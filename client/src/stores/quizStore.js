import { create } from "zustand";
import api from "@/lib/api"; // use the instance

export const useQuizStore = create((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  loading: false,

  getMyQuizzes: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/quiz/my");
      set({ quizzes: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      set({ loading: false });
    }
  },

  getAllQuizzes: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/quiz");
      set({ quizzes: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch all quizzes:", err);
      set({ loading: false });
    }
  },

  fetchQuizById: async (quizId) => {
    set({ loading: true });
    try {
      const res = await api.get(`/quiz/${quizId}`);
      set({ currentQuiz: res.data, loading: false });
      return res.data;
    } catch (err) {
      console.error("Failed to fetch quiz by ID:", err);
      set({ loading: false });
      throw err;
    }
  },

  clearCurrentQuiz: () => set({ currentQuiz: null }),

  updateQuiz: async (quizId, title, questions, isPublished) => {
    set({ loading: true });
    try {
      const res = await api.put(`/quiz/${quizId}`, {
        title,
        questions,
        isPublished,
      });

      const updatedQuizzes = get().quizzes.map((quiz) =>
        quiz._id === quizId ? res.data.quiz : quiz
      );

      set({ quizzes: updatedQuizzes, loading: false });
    } catch (err) {
      console.error("Failed to update quiz:", err);
      set({ loading: false });
      throw err;
    }
  },

  createQuiz: async (title, questions, isPublished) => {
    set({ loading: true });
    try {
      const res = await api.post("/quiz", {
        title,
        questions,
        isPublished,
      });
      set({ quizzes: [...get().quizzes, res.data], loading: false });
    } catch (err) {
      console.error("Failed to create quiz:", err);
      set({ loading: false });
      throw err;
    }
  },

  deleteQuiz: async (quizId) => {
    set({ loading: true });
    try {
      await api.delete(`/quiz/${quizId}`);
      const updatedQuizzes = get().quizzes.filter((quiz) => quiz._id !== quizId);
      set({ quizzes: updatedQuizzes, loading: false });
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      set({ loading: false });
    }
  },
}));