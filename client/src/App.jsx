import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useAuthStore } from "./stores/authStore";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "./components/LoadingScreen";
import LoadingOverlay from "./components/LoadingOverlay";

// Lazy load pages
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Home = lazy(() => import("./pages/Home"));
const MyQuizzes = lazy(() => import("./pages/MyQuizzes"));
const Favorite = lazy(() => import("./pages/Favorite"));
const CreateQuizForm = lazy(() => import("./pages/CreateQuizForm"));
const PlayQuiz = lazy(() => import("./pages/PlayQuiz"));
const MainLayout = lazy(() => import("./components/MainLayout"));

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔥 TEMP FIX: DON'T BLOCK UI
  return (
    <>
      <Toaster position="top-center" />

      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route
            path="/AuthPage"
            element={
              isAuthenticated ? <Navigate to="/" /> : <AuthPage />
            }
          />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/MyQuizzes" element={<MyQuizzes />} />
            <Route path="/Favorite" element={<Favorite />} />
          </Route>

          <Route
            path="/CreateQuizForm"
            element={<CreateQuizForm />}
          />

          <Route
            path="/quiz/:quizId"
            element={<PlayQuiz />}
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;