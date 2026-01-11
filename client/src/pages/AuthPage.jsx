import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router-dom";

const AuthPages = () => {
  const signup = useAuthStore((state) => state.signup);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;

    if (isLogin) {
      try {
        await login(email, password);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    } else {
      try {
        await signup(name, email, password);
        setIsLogin(true);
        setFormData({ email: "", password: "" });
        setError("");
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            QuizMaker
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
          {/* Tab Switcher */}
          <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                !isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => {
                setIsLogin(false);
                setFormData({ name: "", email: "", password: "" });
                setError("");
              }}
            >
              Sign Up
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => {
                setIsLogin(true);
                setFormData({ name: "", email: "", password: "" });
                setError("");
              }}
            >
              Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-colors text-gray-900"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;