import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

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
    <div className="flex flex-col items-center justify-center md:flex-row md:items-center md:mx-2 min-h-screen bg-gray-100">
      {/* Title */}
      <div className="flex flex-col md:flex-1 items-center mb-6">
        <h1 className=" text-2xl md:text-3xl font-extrabold text-gray-800">
          QuizMaker
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-lg">
          Welcome back! Please enter your details.
        </p>
      </div>

      <div className="md:flex-1 bg-white shadow-2xl rounded-2xl p-8 md:mx-20">
        <div className="flex mb-6">
          <button
            className={`flex-1 text-center py-2 font-semibold cursor-pointer border-b-2 ${
              !isLogin
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent"
            }`}
            onClick={() => {
              setIsLogin(false);
              setFormData({ email: "", password: "" });
              setError("");
            }}
          >
            Register
          </button>
          <button
            className={`flex-1 text-center py-2 font-semibold cursor-pointer border-b-2 ${
              isLogin
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent"
            }`}
            onClick={() => {
              setIsLogin(true);
              setFormData({ email: "", password: "" });
              setError("");
            }}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full md:px-4 md:py-2 p-1 bg-gray-50 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full md:px-4 md:py-2 p-1 bg-gray-50 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={formData.password}
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full md:px-4 md:py-2 p-1 bg-gray-50 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit */}
          <Button type="submit" variant="default">
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthPages;
