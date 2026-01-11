import { NavLink } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaTimes,
  FaHome,
  FaStar,
  FaClipboardList,
} from "react-icons/fa";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingOn, setIsSettingOn] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-center md:justify-start gap-2 p-2
     cursor-pointer transition-colors duration-200
     ${
       isActive
         ? "text-blue-600 border-b-2 border-blue-500"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
     }`;

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-10 py-1 border-b bg-white">
      {/* LEFT — LOGO */}
      <div className="flex items-center">
        <div className="hidden md:block font-semibold text-xl bg-red-300 px-2 py-1 rounded-md">
          QuizMaker
        </div>
        <div className="block md:hidden text-red-500 text-2xl font-bold">Q</div>
      </div>

      {/* CENTER — NAV LINKS */}
      <ul className="flex gap-3 md:gap-4 font-medium">
        <li>
          <NavLink to="/" className={navItemClass}>
            <span className="hidden sm:inline">Home</span>
            <span className="sm:hidden text-xl">
              <FaHome />
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/MyQuizzes" className={navItemClass}>
            <span className="hidden sm:inline">My Quizzes</span>
            <span className="sm:hidden text-xl">
              <FaClipboardList />
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/Favorite" className={navItemClass}>
            <span className="hidden sm:inline">Favorite</span>
            <span className="sm:hidden text-xl">
              <FaStar />
            </span>
          </NavLink>
        </li>
      </ul>

      {/* RIGHT — SEARCH, PROFILE */}
      <div className="flex items-center gap-4 md:gap-6 relative">
        {/* Search Icon */}
        <div
          className="bg-[#f0f2f5] p-2 rounded-full flex items-center justify-center
                     cursor-pointer transition
                     hover:bg-gray-200 active:scale-95"
          onClick={() => setIsExpanded(true)}
        >
          <FaSearch className="text-gray-600" size={18} />
        </div>

        {/* Expanded Search */}
        {isExpanded && (
          <div
            className="fixed top-4 right-4 w-72 h-10 bg-[#f0f2f5] rounded-full
                        flex items-center px-4 shadow-lg z-50"
          >
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              className="bg-transparent flex-1 outline-none text-sm"
            />
            <button
              onClick={() => setIsExpanded(false)}
              className="ml-2 text-gray-600 cursor-pointer hover:text-red-500"
            >
              <FaTimes size={14} />
            </button>
          </div>
        )}

        {/* Profile Icon */}
        <FaUser
          className="text-gray-600 cursor-pointer hover:text-blue-600 transition"
          onClick={() => setIsSettingOn(!isSettingOn)}
          size={18}
        />

        {/* Settings Popup */}
        {isSettingOn && (
          <div
            className="fixed top-4 right-4 w-52 bg-white rounded-lg
                       shadow-xl border border-gray-200 z-50
                       flex flex-col p-3 transition-all duration-200 ease-in-out"
          >
            {/* Header with Back button */}
            <div className="flex items-center justify-between mb-2">
              <button
                className="text-gray-500 hover:text-gray-800 px-2 py-1 rounded-md
                           transition-colors duration-150"
                onClick={() => setIsSettingOn(false)}
              >
                ← Back
              </button>
              <span className="text-gray-800 font-semibold">Settings</span>
            </div>

            {/* User Email */}
            {user?.email && (
              <div className="text-gray-700 text-sm mb-2 px-3 py-1 border-b border-gray-200">
                {user.email}
              </div>
            )}

            {/* Logout Button */}
            <button
              className="w-full text-left text-red-500 hover:bg-red-50 px-3 py-2
                         rounded-md transition-colors duration-150"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};