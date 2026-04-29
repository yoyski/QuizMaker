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
  const loading = useAuthStore((state) => state.loading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // ✅ FIX: run only once
  useEffect(() => {
    checkAuth();
  }, []); // ❌ removed dependency

  // ✅ SINGLE SOURCE OF TRUTH (important fix)
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 1000 }}
      />

      {/* Optional overlay (only when NOT initial load) */}
      {!loading && <LoadingOverlay />}

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Route */}
          <Route
            path="/AuthPage"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
            }
          />

          {/* Protected Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/MyQuizzes" element={<MyQuizzes />} />
            <Route path="/Favorite" element={<Favorite />} />
          </Route>

          {/* Protected Pages */}
          <Route
            path="/CreateQuizForm"
            element={
              isAuthenticated ? (
                <CreateQuizForm />
              ) : (
                <Navigate to="/AuthPage" replace />
              )
            }
          />

          <Route
            path="/CreateQuizForm/:quizId"
            element={
              isAuthenticated ? (
                <CreateQuizForm />
              ) : (
                <Navigate to="/AuthPage" replace />
              )
            }
          />

          <Route
            path="/quiz/:quizId"
            element={
              isAuthenticated ? <PlayQuiz /> : <Navigate to="/AuthPage" replace />
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;