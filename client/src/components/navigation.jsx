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
import logo from "../assets/logo.png";

export const Navigation = () => {
  const [isSettingOn, setIsSettingOn] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navItemClass = ({ isActive }) =>
    `flex items-center justify-center md:justify-start gap-2 px-4 py-2
     cursor-pointer transition-all duration-200 font-medium
     ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`;

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-10 h-16 border-b border-gray-200 bg-white z-40">
      {/* LEFT — LOGO */}
      <div className="flex items-center">
        <div className="font-semibold text-xl text-gray-900">
          <span className="hidden md:inline">QuizMaker</span>
          <span className="md:hidden">
            <img src={logo} alt="App Logo" className=" h-9 rounded-full" />
          </span>
        </div>
      </div>

      {/* CENTER — NAV LINKS */}
      <ul className="flex gap-1 md:gap-2">
        <li>
          <NavLink to="/" className={navItemClass}>
            <span className="hidden sm:inline">Home</span>
            <span className="sm:hidden text-lg">
              <FaHome />
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/MyQuizzes" className={navItemClass}>
            <span className="hidden sm:inline">My Quizzes</span>
            <span className="sm:hidden text-lg">
              <FaClipboardList />
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/Favorite" className={navItemClass}>
            <span className="hidden sm:inline">Favorite</span>
            <span className="sm:hidden text-lg">
              <FaStar />
            </span>
          </NavLink>
        </li>
      </ul>

      {/* RIGHT — PROFILE */}
      <div className="flex items-center gap-3 relative">
        {/* Profile Icon */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsSettingOn(!isSettingOn)}
        >
          <FaUser className="text-gray-600" size={16} />
        </button>

        {/* Settings Dropdown */}
        {isSettingOn && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSettingOn(false)}
            />

            {/* Dropdown Menu */}
            <div className="absolute top-12 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* User Info */}
              {user?.email && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
              )}

              {/* Menu Items */}
              <div className="py-2">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setIsSettingOn(false);
                    // Navigate to profile or settings
                  }}
                >
                  Profile Settings
                </button>

                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => {
                    logout();
                    setIsSettingOn(false);
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};
