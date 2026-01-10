import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const { id } = req.user; // from decoded in protect

    if (!title) {
      return res.status(400).json({
        message: "Quiz title is required",
      });
    }

    // Basic validation
    if (!questions || questions.length === 0) {
      return res.status(400).json({
        message: "Quiz must have at least one question",
      });
    }

    for (const q of questions) {
      if (!q.text || q.text.trim() === "") {
        return res.status(400).json({
          message: "Each question must have text",
        });
      }

      if (!q.options || q.options.length < 2) {
        return res.status(400).json({
          message: "Each question must have at least 2 options",
        });
      }

      if (q.correctIndex === null || q.correctIndex === undefined) {
        return res.status(400).json({
          message: "Each question must have a correct answer",
        });
      }
    }

    const quiz = new Quiz({
      title,
      questions,
      userId: id,
    });

    await quiz.save();
    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create quiz",
    });
  }
};

export const getMyQuizzes = async (req, res) => {
  try {
    const { id } = req.user; // from decoded in protect
    const quizzes = await Quiz.find({ userId: id });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch quizzes",
    });
  }
};

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true }).populate(
      "userId",
      "name email"
    ); // Populate user details
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questions, isPublished } = req.body;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }


    if (title !== undefined) quiz.title = title;
    if (questions !== undefined) quiz.questions = questions;
    if (isPublished !== undefined) quiz.isPublished = isPublished;

    await quiz.save();

    res.json({
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update quiz",
    });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};
