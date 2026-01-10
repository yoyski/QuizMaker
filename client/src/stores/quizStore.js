import { create } from "zustand";
import axios from "axios";

export const useQuizStore = create((set, get) => ({
  quizzes: [],
  loading: false,

  getMyQuizzes: async () => {
    set({ loading: true });

    try {
      const res = await axios.get("/api/quiz/my", {
        withCredentials: true,
      });
      set({ quizzes: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  },

  getAllQuizzes: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/quiz", {
        withCredentials: true,
      });
      set({ quizzes: res.data, loading: false });
    } catch (err) {
      console.error("Failed to fetch all quizzes:", err);
    }
  },

  fetchQuizById: async (quizId) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/api/quiz/${quizId}`, {
        withCredentials: true,
      });
      set({ loading: false });
      return res.data;
    } catch (err) {
      console.error("Failed to fetch quiz by ID:", err);
      throw err;
    }
  },

  updateQuiz: async (quizId, title, questions, isPublished) => {
    set({ loading: true });
    try {
      const res = await axios.put(
        `/api/quiz/${quizId}`,
        {
          title,
          questions,
          isPublished,
        },
        {
          withCredentials: true,
        }
      );
      const updatedQuizzes = get().quizzes.map((quiz) =>
        quiz._id === quizId ? res.data.quiz : quiz
      );

      set({ quizzes: updatedQuizzes, loading: false });
    } catch (err) {
      console.error("Failed to update quiz:", err);
      throw err;
    }
  },

  createQuiz: async (title, questions, isPublished) => {
    set({ loading: true });

    try {
      const res = await axios.post(
        "/api/quiz",
        {
          title,
          questions,
          isPublished,
        },
        {
          withCredentials: true,
        }
      );

      set({ quizzes: [...get().quizzes, res.data], loading: false });
    } catch (err) {
      console.error("Failed to create quiz:", err);
      throw err;
    }
  },
}));
