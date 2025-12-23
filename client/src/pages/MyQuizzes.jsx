import { useAuthStore } from "../stores/authStore";
import { FaEdit, FaPlay, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

const MyQuizzes = () => {
  const logout = useAuthStore((state) => state.logout);

  const items = [
    {
      title: "Literature Test",
      noOfQuestions: "12 Questions",
      created: "2023-05-05",
    },
    {
      title: "Literature Test",
      noOfQuestions: "12 Questions",
      created: "2023-05-05",
    },
    {
      title: "Literature Test",
      noOfQuestions: "12 Questions",
      created: "2023-05-05",
    },
    {
      title: "Literature Test",
      noOfQuestions: "12 Questions",
      created: "2023-05-05",
    },
  ]; // it should take from database

  return (
    <div className="px-1 md:px-10 lg:px-25 py-15 bg-[#e3e7e9] h-full min-h-screen">
      <div className="col-span-6 p-4 flex justify-between items-center">
        <div className="font-bold text-xl">My Quizzes</div>
        <Link to="/CreateQuizForm">
          <Button>
            <FaPlus /> Create New Quiz
          </Button>
        </Link>
      </div>
      <button onClick={logout}>Logout</button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-3">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-100 rounded-lg shadow-md">
            <div className="px-4 py-4">
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-1">{item.noOfQuestions}</p>
              <p className="text-gray-600 text-">Created on: {item.created}</p>
            </div>
            <div className="text-[#74777e] text-lg space-x-4 flex justify-end bg-[#e3e7e9] p-3 rounded-b-lg">
              <button className="hover:text-blue-600 ">
                <FaEdit />
              </button>
              <button className="hover:text-blue-600">
                <FaPlay />
              </button>
              <button className="hover:text-red-600">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQuizzes;
