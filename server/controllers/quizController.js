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
