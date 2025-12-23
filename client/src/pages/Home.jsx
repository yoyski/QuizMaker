import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { FaEdit, FaPlay, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const HomePage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      // Mock data for now
      const data = [
        { id: 1, title: "Literature Test", noOfQuestions: 12, created: "2023-05-05", creator: "Alice", creatorId: 1, avatar: "https://i.pravatar.cc/40?img=1" },
        { id: 2, title: "Math Quiz", noOfQuestions: 10, created: "2023-06-12", creator: "Bob", creatorId: 2, avatar: "https://i.pravatar.cc/40?img=2" },
        { id: 3, title: "History Exam", noOfQuestions: 15, created: "2023-07-20", creator: "Charlie", creatorId: 3, avatar: "https://i.pravatar.cc/40?img=3" },
        { id: 4, title: "Science Test", noOfQuestions: 8, created: "2023-08-02", creator: "Alice", creatorId: 1, avatar: "https://i.pravatar.cc/40?img=1" },
      ];
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-10 lg:px-20 py-20">
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

      <div className="space-y-4">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
            {/* Header with creator */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={quiz.avatar}
                  alt={quiz.creator}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  onClick={() => navigate(`/user/${quiz.creatorId}`)}
                />
                <div>
                  <p
                    className="font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate(`/user/${quiz.creatorId}`)}
                  >
                    {quiz.creator}
                  </p>
                  <p className="text-gray-500 text-sm">{quiz.created}</p>
                </div>
              </div>
            </div>

            {/* Quiz content */}
            <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-3">{quiz.noOfQuestions} Questions</p>

            {/* Action buttons */}
            <div className="flex items-center gap-4 text-gray-600">
              <button className="hover:text-blue-600">
                <FaPlay size={18} />
              </button>
              {isAuthenticated && user?.id === quiz.creatorId && (
                <>
                  <button className="hover:text-blue-600">
                    <FaEdit size={18} />
                  </button>
                  <button className="hover:text-red-600">
                    <FaTrash size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
