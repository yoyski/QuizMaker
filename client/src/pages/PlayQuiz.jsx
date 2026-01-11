import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "@/stores/quizStore";

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

          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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