import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuizStore } from "@/stores/quizStore";
import {
  FaTrash,
  FaGlobe,
  FaLock,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const CreateQuizForm = () => {
  const { quizId } = useParams();
  const isEditMode = Boolean(quizId);
  const navigate = useNavigate();
  const createQuiz = useQuizStore((state) => state.createQuiz);
  const updateQuiz = useQuizStore((state) => state.updateQuiz);
  const fetchQuizById = useQuizStore((state) => state.fetchQuizById);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Untitled Quiz");
  const [isPublished, setIsPublished] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([
    { text: "", options: ["", ""], correctIndex: null },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      fetchQuizById(quizId)
        .then((quiz) => {
          setTitle(quiz.title);
          setQuestions(quiz.questions);
          setIsPublished(Boolean(quiz.isPublished));
        })
        .finally(() => setLoading(false));
    }
  }, [quizId, isEditMode, fetchQuizById]);

  const handleQuestionChange = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text: value } : q))
    );
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === oIndex ? value : opt)),
            }
          : q
      )
    );
  };

  const setCorrectOption = (qIndex, oIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, correctIndex: oIndex } : q))
    );
  };

  const addOption = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const deleteOption = (qIndex, oIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIndex) {
          const newOptions = q.options.filter((_, j) => j !== oIndex);
          let newCorrectIndex = q.correctIndex;

          // Adjust correctIndex if needed
          if (q.correctIndex === oIndex) {
            newCorrectIndex = null;
          } else if (q.correctIndex > oIndex) {
            newCorrectIndex = q.correctIndex - 1;
          }

          return { ...q, options: newOptions, correctIndex: newCorrectIndex };
        }
        return q;
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: "", options: ["", ""], correctIndex: null },
    ]);
    setSelectedQuestion(questions.length);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setSelectedQuestion(0);
  };

  const handleSubmit = async () => {
    if (!title.trim() || title === "Untitled Quiz") {
      toast.dismiss();
      toast.error("Quiz title is required");
      return;
    }

    if (questions.some((q) => !q.text.trim())) {
      toast.dismiss();
      toast.error("All questions must have text");
      return;
    }

    if (questions.some((q) => q.options.some((opt) => !opt.trim()))) {
      toast.dismiss();
      toast.error("All options must have text");
      return;
    }

    if (questions.some((q) => q.correctIndex === null)) {
      toast.dismiss();
      toast.error("Each question must have a correct answer");
      return;
    }

    try {
      if (isEditMode) {
        toast.dismiss();
        await toast.promise(updateQuiz(quizId, title, questions, isPublished), {
          loading: "Updating quiz...",
          success: "Quiz updated successfully!",
          error: "Failed to update quiz",
        });
      } else {
        toast.dismiss();
        await toast.promise(createQuiz(title, questions, isPublished), {
          loading: "Saving quiz...",
          success: "Quiz created successfully!",
          error: "Failed to create quiz",
        });
      }
      navigate("/MyQuizzes");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white relative p-4 md:p-0">
      {/* Sidebar - Desktop (Left) / Mobile (Bottom) */}
      <div
        className={`md:static md:w-80 md:border-r bg-white border-gray-200 flex flex-col transition-all duration-300
          fixed bottom-0 left-0 right-0 z-50 border-t md:border-t-0
          ${sidebarOpen ? "max-h-[70vh]" : "max-h-16"}
          md:max-h-none md:inset-auto md:translate-y-0`}
      >
        {/* Mobile Toggle Header */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden flex items-center justify-between py-4 px-8 border-b border-gray-200 bg-white"
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Questions</span>
            <span className="text-sm text-gray-500">
              {selectedQuestion + 1} / {questions.length}
            </span>
          </div>
          {sidebarOpen ? <FaChevronDown /> : <FaChevronUp />}
        </button>

        {/* Header - Desktop Only */}
        <div className="hidden md:block p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2 rounded-lg transition-colors relative ${
                  isPublished
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isPublished ? <FaGlobe /> : <FaLock />}
              </button>
            </div>
          </div>

          {showMenu && (
            <div className="absolute right-4 top-16 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => {
                  setIsPublished(true);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  isPublished && "text-blue-600 bg-blue-50"
                }`}
              >
                <FaGlobe />
                Public
              </button>
              <button
                onClick={() => {
                  setIsPublished(false);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  !isPublished && "text-gray-900 bg-gray-50"
                }`}
              >
                <FaLock />
                Private
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-lg animate-pulse"
                />
              ))
            : questions.map((q, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedQuestion(i);
                    setSidebarOpen(false);
                  }}
                  className={`p-3 rounded-lg cursor-pointer relative transition-colors ${
                    selectedQuestion === i
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <div className="pr-8">
                    <p className="font-medium text-gray-900 truncate">
                      {q.text || `Question ${i + 1}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {q.options.length} options
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(i);
                    }}
                    disabled={questions.length === 1}
                    className={`absolute top-3 right-3 p-1.5 rounded transition-colors ${
                      questions.length === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
        </div>

        {/* Add Question Button */}
        {!loading && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={addQuestion}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Add Question
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex-1 p-8 space-y-4 mb-20 md:mb-0">
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      ) : (
        <div className="flex-1 md:p-8 mb-20 md:mb-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 min-w-0 text-lg md:text-3xl font-semibold border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 bg-transparent outline-none md:pb-2 text-gray-900"
              placeholder="Quiz title"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Public/Private Toggle */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`md:hidden p-2 rounded-lg transition-colors relative ${
                  isPublished
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isPublished ? <FaGlobe /> : <FaLock />}
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                {isEditMode ? "Update" : "Save Quiz"}
              </button>
            </div>
          </div>

          {/* Mobile Public/Private Menu */}
          {showMenu && (
            <div className="md:hidden absolute right-4 top-20 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => {
                  setIsPublished(true);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  isPublished && "text-blue-600 bg-blue-50"
                }`}
              >
                <FaGlobe />
                Public
              </button>
              <button
                onClick={() => {
                  setIsPublished(false);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  !isPublished && "text-gray-900 bg-gray-50"
                }`}
              >
                <FaLock />
                Private
              </button>
            </div>
          )}

          {/* Question Editor */}
          {questions[selectedQuestion] && (
            <div className="max-w-3xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question {selectedQuestion + 1}
                </label>
                <input
                  type="text"
                  value={questions[selectedQuestion].text}
                  onChange={(e) =>
                    handleQuestionChange(selectedQuestion, e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options
                </label>
                <div className="space-y-3">
                  {questions[selectedQuestion].options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <input
                        type="radio"
                        name="correctOption"
                        checked={questions[selectedQuestion].correctIndex === i}
                        onChange={() => setCorrectOption(selectedQuestion, i)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(
                            selectedQuestion,
                            i,
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
                        placeholder={`Option ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(selectedQuestion, i)}
                        disabled={
                          questions[selectedQuestion].options.length <= 2
                        }
                        className={`p-2 rounded transition-colors ${
                          questions[selectedQuestion].options.length <= 2
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title={
                          questions[selectedQuestion].options.length <= 2
                            ? "Minimum 2 options required"
                            : "Delete option"
                        }
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(selectedQuestion)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add option
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateQuizForm;
