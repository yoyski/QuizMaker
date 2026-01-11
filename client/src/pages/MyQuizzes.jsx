import { useQuizStore } from "@/stores/quizStore";
import {
  FaEdit,
  FaPlay,
  FaTrash,
  FaPlus,
  FaSearch,
  FaGlobe,
  FaLock,
} from "react-icons/fa";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const MyQuizzes = () => {
  const quizzes = useQuizStore((state) => state.quizzes);
  const getMyQuizzes = useQuizStore((state) => state.getMyQuizzes);
  const deleteQuiz = useQuizStore((state) => state.deleteQuiz);
  const loading = useQuizStore((state) => state.loading);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getMyQuizzes();
  }, [getMyQuizzes]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmed) return;

    await deleteQuiz(id);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 lg:px-20 py-6 md:py-12 md:mt-5 mt-13">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 md:mb-12">
        <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">My Quizzes</h1>
          <Link to="/CreateQuizForm">
            <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white text-sm md:text-base font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <FaPlus size={12} className="md:hidden" />
              <FaPlus size={14} className="hidden md:block" />
              Create Quiz
            </button>
          </Link>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <FaSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search your quizzes..."
            className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 text-sm md:text-base bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* QUIZ GRID / SKELETON */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          /* SKELETON GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 w-40 bg-gray-200 rounded" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  </div>

                  <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-36 bg-gray-100 rounded" />
                </div>

                <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                  <div className="h-5 w-5 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* REAL QUIZZES */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-all group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                      {quiz.title}
                    </h2>

                    <span
                      className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap ${
                        quiz.isPublished
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {quiz.isPublished ? <FaGlobe size={10} /> : <FaLock size={10} />}
                      {quiz.isPublished ? "Public" : "Private"}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-1">
                    {quiz.questions?.length ?? 0} Questions
                  </p>

                  <p className="text-gray-400 text-xs">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-end gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-600">
                  <button
                    onClick={() => navigate(`/CreateQuizForm/${quiz._id}`)}
                    className="hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>

                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                    className="hover:text-blue-600 transition-colors"
                    title="Play"
                  >
                    <FaPlay size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}

            {filteredQuizzes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">No quizzes found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;