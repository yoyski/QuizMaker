import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "@/stores/quizStore";
import { FaCheck, FaTimes } from "react-icons/fa";

const PlayQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const fetchQuizById = useQuizStore((state) => state.fetchQuizById);
  const clearCurrentQuiz = useQuizStore((state) => state.clearCurrentQuiz);
  const quiz = useQuizStore((state) => state.currentQuiz);
  const loading = useQuizStore((state) => state.loading);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!quizId) {
      navigate("/");
      return;
    }
    fetchQuizById(quizId);
    return () => {
      clearCurrentQuiz();
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setShowScore(false);
      setShowReview(false);
    };
  }, [quizId, fetchQuizById, clearCurrentQuiz, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Quiz not found</p>
      </div>
    );
  }

  const questions = quiz.questions;

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
    }
  };

  const score = selectedAnswers.reduce((acc, answerIndex, i) => {
    if (answerIndex === questions[i].correctIndex) return acc + 1;
    return acc;
  }, 0);

  // Review Screen
  if (showReview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Quiz Review</h1>
            <p className="text-gray-600">
              You scored {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          {/* Questions Review */}
          {questions.map((question, qIndex) => {
            const userAnswer = selectedAnswers[qIndex];
            const correctAnswer = question.correctIndex;
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div
                key={qIndex}
                className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                  isCorrect ? "border-green-500" : "border-red-500"
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {qIndex + 1}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <FaCheck className="w-4 h-4" />
                          Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                          <FaTimes className="w-4 h-4" />
                          Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {question.text}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => {
                    const isUserAnswer = userAnswer === optIndex;
                    const isCorrectAnswer = correctAnswer === optIndex;

                    let optionClass = "bg-gray-50 border-gray-200";
                    
                    if (isCorrectAnswer) {
                      optionClass = "bg-green-50 border-green-500";
                    } else if (isUserAnswer && !isCorrect) {
                      optionClass = "bg-red-50 border-red-500";
                    }

                    return (
                      <div
                        key={optIndex}
                        className={`px-4 py-3 rounded-lg border-2 ${optionClass}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900">{option}</span>
                          <div className="flex items-center gap-2">
                            {isUserAnswer && !isCorrect && (
                              <span className="text-xs text-red-600 font-medium">
                                Your answer
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <span className="flex items-center gap-1 text-green-600">
                                <FaCheck className="w-4 h-4" />
                                <span className="text-xs font-medium">
                                  Correct answer
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowReview(false);
                setShowScore(true);
              }}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Results
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Score Screen
  if (showScore) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#dbeafe"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#2563eb"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">{percentage}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-blue-600">Quiz Complete</h1>
            <p className="text-gray-500">
              {score} out of {questions.length} correct
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowReview(true)}
              className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Review Answers
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  const question = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="space-y-6">
          <p className="text-xl text-gray-900 font-medium">{question.text}</p>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left px-6 py-4 bg-white border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all text-gray-700"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayQuiz;