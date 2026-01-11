import { useAuthStore } from "../stores/authStore";
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
import { useEffect } from "react";

const MyQuizzes = () => {
  const quizzes = useQuizStore((state) => state.quizzes);
  const getMyQuizzes = useQuizStore((state) => state.getMyQuizzes);
  const deleteQuiz = useQuizStore((state) => state.deleteQuiz);
  const loading = useQuizStore((state) => state.loading);

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

  return (
    <div className="px-1 md:px-10 lg:px-25 py-15 bg-[#e3e7e9] min-h-screen">
      {/* HEADER */}
      <div className="p-4 flex justify-between items-center">
        <div className="font-bold text-xl">My Quizzes</div>
        <Link to="/CreateQuizForm">
          <Button>
            <FaPlus /> Create New Quiz
          </Button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="p-3">
        <div className="flex items-center bg-white rounded-md px-3 py-2 shadow-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search quizzes..."
            className="flex-1 outline-none bg-transparent text-gray-700"
          />
        </div>
      </div>

      {/* QUIZ GRID / SKELETON */}
      {loading ? (
        /* 🔹 SKELETON GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              {/* CARD BODY */}
              <div className="px-4 py-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-5 w-40 bg-gray-300 rounded" />
                  <div className="h-5 w-20 bg-gray-300 rounded-full" />
                </div>

                <div className="h-4 w-28 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>

              {/* ACTION BAR */}
              <div className="flex justify-end bg-[#e3e7e9] p-3">
                <div className="flex space-x-4">
                  <div className="h-5 w-5 bg-gray-300 rounded" />
                  <div className="h-5 w-5 bg-gray-300 rounded" />
                  <div className="h-5 w-5 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 🔹 REAL QUIZZES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-gray-100 rounded-lg shadow-md overflow-hidden"
            >
              {/* CARD BODY */}
              <div className="px-4 py-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold">{quiz.title}</h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                      quiz.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {quiz.isPublished ? <FaGlobe /> : <FaLock />}
                    {quiz.isPublished ? "Public" : "Private"}
                  </span>
                </div>

                <p className="text-gray-600 mt-1">
                  {quiz.questions?.length ?? 0} Questions
                </p>

                <p className="text-gray-600 text-sm">
                  Created on: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* ACTION BAR */}
              <div className="flex items-center bg-[#e3e7e9] p-3 text-lg text-[#74777e] justify-end">
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate(`/CreateQuizForm/${quiz._id}`)}
                    className="hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>

                  <button className="hover:text-blue-600">
                    <FaPlay />
                  </button>

                  <button
                    onClick={() => handleDelete(quiz._id)}
                    className="hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {quizzes.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No quizzes found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
