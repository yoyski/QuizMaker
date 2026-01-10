import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useQuizStore } from "@/stores/quizStore";
import { FaEdit, FaPlay, FaTrash, FaSearch } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const quizzes = useQuizStore((state) => state.quizzes);
  const getAllQuizzes = useQuizStore((state) => state.getAllQuizzes);
  const loading = useQuizStore((state) => state.loading);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllQuizzes();
  }, [getAllQuizzes]);

  // 🔹 Only published quizzes + search filter
  const filteredQuizzes = quizzes
    .filter((quiz) => quiz.isPublished)
    .filter((quiz) =>
      quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const defaultProfile =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div className="min-h-screen bg-[#e3e7e9] px-4 md:px-10 lg:px-20 py-20">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Explore Quizzes</h1>
      </div>

      {isAuthenticated && (
        <button
          onClick={logout}
          className="mb-4 text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      )}

      {/* SEARCH */}
      <div className="mb-6">
        <div className="flex items-center bg-white rounded-full shadow-sm px-4 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search quizzes..."
            className="flex-1 outline-none bg-transparent text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* QUIZ LIST / SKELETON */}
      {loading ? (
        /* 🔹 SKELETON LOADING */
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div>
                  <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="h-5 w-48 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        /* 🔹 ACTUAL QUIZ LIST */
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              {/* Creator info */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={quiz.userId?.profilePicture || defaultProfile}
                    alt={quiz.userId?.name || "Author"}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/profile/${quiz.userId?._id}`)}
                  />
                  <div>
                    <p className="font-semibold">
                      {quiz.userId?.name || "Unknown Author"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {quiz.createdAt
                        ? new Date(quiz.createdAt).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quiz info */}
              <h2 className="text-xl font-bold mb-1">{quiz.title}</h2>
              <p className="text-gray-600 mb-3">
                {quiz.questions?.length ?? 0} Questions
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 text-gray-600">
                <button
                  className="hover:text-blue-600"
                  title="Play Quiz"
                  onClick={() => navigate(`/quiz/${quiz._id}`)}
                >
                  <FaPlay size={18} />
                </button>

                {isAuthenticated && user?._id === quiz.userId?._id && (
                  <>
                    <button
                      className="hover:text-blue-600"
                      title="Edit Quiz"
                      onClick={() => navigate(`/quiz/edit/${quiz._id}`)}
                    >
                      <FaEdit size={18} />
                    </button>

                    <button
                      className="hover:text-red-600"
                      title="Delete Quiz"
                      onClick={() => console.log("Delete quiz", quiz._id)}
                    >
                      <FaTrash size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredQuizzes.length === 0 && (
            <p className="text-center text-gray-500">No quizzes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
