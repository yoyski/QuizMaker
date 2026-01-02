import { useAuthStore } from "../stores/authStore";
import { FaEdit, FaPlay, FaTrash, FaPlus, FaSearch, FaGlobe, FaLock } from "react-icons/fa";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

const MyQuizzes = () => {
  const logout = useAuthStore((state) => state.logout);

  const items = [
    {
      title: "Literature Test",
      noOfQuestions: "12 Questions",
      created: "2023-05-05",
      isPublished: true,
    },
    {
      title: "Math Quiz",
      noOfQuestions: "8 Questions",
      created: "2023-06-01",
      isPublished: false,
    },
    {
      title: "Science Exam",
      noOfQuestions: "15 Questions",
      created: "2023-06-10",
      isPublished: false,
    },
  ]; // later this comes from database

  return (
    <div className="px-1 md:px-10 lg:px-25 py-15 bg-[#e3e7e9] h-full min-h-screen">
      {/* HEADER */}
      <div className="col-span-6 p-4 flex justify-between items-center">
        <div className="font-bold text-xl">My Quizzes</div>
        <Link to="/CreateQuizForm">
          <Button>
            <FaPlus /> Create New Quiz
          </Button>
        </Link>
      </div>

      <button onClick={logout} className="ml-4 mb-3 text-sm text-red-600">
        Logout
      </button>

      {/* SEARCH */}
      <div className="p-3">
        <div className="flex items-center w-full bg-white rounded-md px-3 py-2 shadow-sm">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search quizzes..."
            className="flex-1 outline-none bg-transparent text-gray-700"
          />
        </div>
      </div>

      {/* QUIZ GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-3">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
            {/* CARD BODY */}
            <div className="px-4 py-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>

                {/* PUBLISH STATUS BADGE */}
                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    item.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.isPublished ? <FaGlobe /> : <FaLock />}
                  {item.isPublished ? "Public" : "Private"}
                </span>
              </div>

              <p className="text-gray-600 mb-1">{item.noOfQuestions}</p>
              <p className="text-gray-600 text-sm">
                Created on: {item.created}
              </p>
            </div>

            {/* ACTION BAR */}
            <div className="text-[#74777e] text-lg space-x-4 flex justify-between items-center bg-[#e3e7e9] p-3">
              {/* PUBLISH TOGGLE (UI ONLY) */}
              <button
                className="text-sm flex items-center gap-1 hover:text-blue-600"
                title="Toggle Publish"
              >
                {item.isPublished ? <FaLock /> : <FaGlobe />}
                {item.isPublished ? "Unpublish" : "Publish"}
              </button>

              {/* ACTION ICONS */}
              <div className="flex space-x-4">
                <button className="hover:text-blue-600" title="Edit">
                  <FaEdit />
                </button>
                <button className="hover:text-blue-600" title="Play">
                  <FaPlay />
                </button>
                <button className="hover:text-red-600" title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQuizzes;
