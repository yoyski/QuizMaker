import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuizStore } from "@/stores/quizStore";
import { FaTrash, FaBars, FaTimes, FaGlobe, FaLock } from "react-icons/fa";

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
    if (!title.trim()) {
      alert("Quiz title is required");
      return;
    }
    if (questions.some((q) => !q.text.trim())) {
      alert("All questions must have text");
      return;
    }
    if (questions.some((q) => q.correctIndex === null)) {
      alert("Each question must have a correct answer");
      return;
    }

    try {
      if (isEditMode) {
        await updateQuiz(quizId, title, questions, isPublished);
      } else {
        await createQuiz(title, questions, isPublished);
      }
      navigate("/MyQuizzes");
    } catch (error) {
      alert("Failed to save quiz", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          className="sm:hidden fixed top-20 left-4 z-20 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars className="text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-10 top-0 left-0 h-full w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:relative sm:translate-x-0 flex flex-col
        `}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <span className="font-semibold text-gray-900">Questions</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-lg transition-colors relative ${
                isPublished ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isPublished ? <FaGlobe size={14} /> : <FaLock size={14} />}
            </button>
            
            <button
              className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          {showMenu && (
            <div className="absolute right-4 top-14 bg-white border border-gray-200 rounded-lg shadow-lg w-40 z-20">
              <button
                onClick={() => {
                  setIsPublished(true);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                  isPublished && "text-blue-600 bg-blue-50"
                }`}
              >
                <FaGlobe size={12} /> Public
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
                <FaLock size={12} /> Private
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
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
                  <div className="pr-8 truncate text-sm font-medium text-gray-900">
                    {q.text || `Question ${i + 1}`}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {q.options.length} options
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
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
        </div>

        {/* Add Question Button */}
        {!loading && (
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={addQuestion}
              className="w-full py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              + Add Question
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="h-10 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 text-2xl md:text-3xl font-semibold border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 bg-transparent outline-none pb-2 text-gray-900"
                placeholder="Quiz title"
              />
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {isEditMode ? "Update" : "Save Quiz"}
              </button>
            </div>

            {/* Question Editor */}
            {questions[selectedQuestion] && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question {selectedQuestion + 1}
                  </label>
                  <input
                    value={questions[selectedQuestion].text}
                    onChange={(e) =>
                      handleQuestionChange(selectedQuestion, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
                    placeholder="Enter your question"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer Options
                  </label>
                  {questions[selectedQuestion].options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={questions[selectedQuestion].correctIndex === i}
                        onChange={() => setCorrectOption(selectedQuestion, i)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <input
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(selectedQuestion, i, e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
                        placeholder={`Option ${i + 1}`}
                      />
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
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateQuizForm;