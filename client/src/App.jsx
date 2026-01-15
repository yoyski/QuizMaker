import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
import MainLayout from "./components/MainLayout";
import MyQuizzes from "./pages/MyQuizzes";
import Favorite from "./pages/Favorite";
import CreateQuizForm from "./pages/CreateQuizForm";
import PlayQuiz from "./pages/PlayQuiz";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "./components/LoadingScreen";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const loading = useAuthStore((state) => state.loading);
  const isInitialLoad = useAuthStore((state) => state.isInitialLoad);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show full loading screen on initial app load
  if (isInitialLoad && loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 1000 }} />
      
      {/* Show overlay for subsequent loads (page refresh) */}
      {!isInitialLoad && loading && <LoadingOverlay />}
      
      <Routes>
        {/* Public Route */}
        <Route 
          path="/AuthPage" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} 
        />

        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/MyQuizzes" element={<MyQuizzes />} />
          <Route path="/Favorite" element={<Favorite />} />
        </Route>

        <Route 
          path="/CreateQuizForm" 
          element={isAuthenticated ? <CreateQuizForm /> : <Navigate to="/AuthPage" replace />} 
        />
        <Route 
          path="/CreateQuizForm/:quizId" 
          element={isAuthenticated ? <CreateQuizForm /> : <Navigate to="/AuthPage" replace />} 
        />
        <Route 
          path="/quiz/:quizId" 
          element={isAuthenticated ? <PlayQuiz /> : <Navigate to="/AuthPage" replace />} 
        />
      </Routes>
    </>
  );
}

export default App;