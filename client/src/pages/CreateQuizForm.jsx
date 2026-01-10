import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuizStore } from "@/stores/quizStore";
import { FaTrash, FaEllipsisV, FaTimes, FaBars } from "react-icons/fa";

const CreateQuizForm = () => {
  const { quizId } = useParams();
  const isEditMode = Boolean(quizId);

  const navigate = useNavigate();
  const createQuiz = useQuizStore((state) => state.createQuiz);
  const updateQuiz = useQuizStore((state) => state.updateQuiz);
  const fetchQuizById = useQuizStore((state) => state.fetchQuizById);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Untitled Quiz");
  const [visibility, setVisibility] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // small device toggle

  const [questions, setQuestions] = useState([
    { text: "", options: ["", ""], correctIndex: null },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  /* LOAD QUIZ DATA FOR EDIT MODE */
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      fetchQuizById(quizId)
        .then((quiz) => {
          setTitle(quiz.title);
          setQuestions(quiz.questions);
          setVisibility(Boolean(quiz.visibility));
        })
        .finally(() => setLoading(false));
    }
  }, [quizId, isEditMode, fetchQuizById]);

  /* QUESTION HANDLERS */
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

  /* SUBMIT */
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
        await updateQuiz(quizId, title, questions, visibility);
      } else {
        await createQuiz(title, questions, visibility);
      }
      navigate("/MyQuizzes");
    } catch (error) {
      alert("Failed to save quiz", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* TOGGLE BUTTON FOR SMALL SCREENS */}
      {!sidebarOpen && (
        <button
          className="sm:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded shadow"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed z-10 top-0 left-0 h-full w-72 bg-gray-50 border-r transform
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:relative sm:translate-x-0 sm:flex flex-col
        `}
      >
        {/* HEADER */}
        <div className="px-4 py-3 border-b flex items-center justify-between font-semibold relative">
          <span>Quiz Questions</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-2 rounded hover:bg-gray-200"
            >
              <FaEllipsisV />
            </button>
            {/* BACK BUTTON ONLY FOR SMALL DEVICES */}
            <button
              className="sm:hidden p-2 rounded hover:bg-gray-200"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {showMenu && (
            <div className="absolute right-3 top-12 bg-white border rounded shadow w-40 z-20">
              <button
                onClick={() => {
                  setVisibility(true);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  visibility === true && "font-semibold text-blue-600"
                }`}
              >
                🌍 Public
              </button>

              <button
                onClick={() => {
                  setVisibility(false);
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  visibility === false && "font-semibold text-blue-600"
                }`}
              >
                🔒 Private
              </button>
            </div>
          )}
        </div>

        {/* QUESTIONS LIST / SKELETON */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-300 rounded animate-pulse"
                />
              ))
            : questions.map((q, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedQuestion(i);
                    setSidebarOpen(false); // close sidebar on selection for small screens
                  }}
                  className={`p-2 rounded cursor-pointer relative ${
                    selectedQuestion === i ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="w-50 truncate">
                    {q.text || `Question ${i + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">Question {i + 1}</div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(i);
                    }}
                    disabled={questions.length === 1}
                    className={`absolute top-3 right-3 p-2 rounded ${
                      questions.length === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
        </div>

        {/* ADD QUESTION */}
        {!loading && (
          <div className="p-3 border-t">
            <button
              onClick={addQuestion}
              className="w-full border border-dashed py-2 text-sm"
            >
              + Add Question
            </button>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-1/2 bg-gray-300 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 p-3 rounded">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full sm:flex-1 text-2xl font-bold border-b bg-transparent outline-none p-2"
                placeholder="Enter quiz title"
              />

              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isEditMode ? "Update Quiz" : "Save Quiz"}
              </button>
            </div>

            {questions[selectedQuestion] && (
              <div className="bg-white p-6 rounded shadow">
                <input
                  value={questions[selectedQuestion].text}
                  onChange={(e) =>
                    handleQuestionChange(selectedQuestion, e.target.value)
                  }
                  className="w-full mb-4 border p-2"
                  placeholder="Question text"
                />

                {questions[selectedQuestion].options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      checked={questions[selectedQuestion].correctIndex === i}
                      onChange={() => setCorrectOption(selectedQuestion, i)}
                    />
                    <input
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(selectedQuestion, i, e.target.value)
                      }
                      className="flex-1 border p-2"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addOption(selectedQuestion)}
                  className="text-sm text-blue-600 mt-2"
                >
                  + Add option
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CreateQuizForm;
