import { useState } from "react";

const CreateQuizForm = () => {
  const [title, setTitle] = useState("Untitled Quiz");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", ""], correctIndex: null },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIndex, oIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return;

    updated[qIndex].options.splice(oIndex, 1);

    if (updated[qIndex].correctIndex === oIndex) updated[qIndex].correctIndex = null;
    else if (updated[qIndex].correctIndex > oIndex) updated[qIndex].correctIndex -= 1;

    setQuestions(updated);
  };

  const setCorrectOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = oIndex;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", ""], correctIndex: null }]);
    setSelectedQuestion(questions.length);
  };

  const deleteQuestion = (index) => {
    if (questions.length === 1) return; // Prevent deleting the last question

    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);

    if (selectedQuestion === index) setSelectedQuestion(0);
    else if (selectedQuestion > index) setSelectedQuestion(selectedQuestion - 1);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="hidden sm:flex w-72 flex-col border-r bg-gray-50">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-gray-700">Quiz Questions</h2>
          <button className="text-gray-400 hover:text-gray-600">⋯</button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`flex justify-between items-center rounded-md px-3 py-2 cursor-pointer ${
                selectedQuestion === i ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-100"
              }`}
            >
              <div onClick={() => setSelectedQuestion(i)}>
                <p className="text-sm font-medium text-gray-700">
                  {q.text || `Question ${i + 1}`}
                </p>
                <p className="text-xs text-gray-500">{`Question ${i + 1}`}</p>
              </div>
              <button
                onClick={() => deleteQuestion(i)}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Delete Question"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 border-t">
          <button
            onClick={addQuestion}
            className="w-full rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            + Add Question
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Editable Quiz Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:ring-2 focus:ring-blue-500 px-1 py-1 rounded"
          />

          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Save Quiz
          </button>
        </div>

        {questions[selectedQuestion] && (
          <div className="max-w-3xl rounded-lg bg-white p-6 shadow-sm border">
            <input
              type="text"
              placeholder="Enter your question"
              value={questions[selectedQuestion].text}
              onChange={(e) => handleQuestionChange(selectedQuestion, e.target.value)}
              className="w-full mb-5 rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />

            <div className="space-y-3">
              {questions[selectedQuestion].options.map((opt, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-md border p-2 ${
                    questions[selectedQuestion].correctIndex === i
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="correctOption"
                    checked={questions[selectedQuestion].correctIndex === i}
                    onChange={() => setCorrectOption(selectedQuestion, i)}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(selectedQuestion, i, e.target.value)}
                    className="flex-1 rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeOption(selectedQuestion, i)}
                    disabled={questions[selectedQuestion].options.length <= 2}
                    className={`px-2 text-sm ${
                      questions[selectedQuestion].options.length <= 2
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-red-500 hover:text-red-700"
                    }`}
                    title="Remove option"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => addOption(selectedQuestion)}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              + Add option
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateQuizForm;
