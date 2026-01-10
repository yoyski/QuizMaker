import './App.css'
import { Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Home from './pages/Home'
import { useAuthStore } from './stores/authStore'
import { useEffect } from 'react'
import MainLayout from '././components/MainLayout' //
import MyQuizzes from './pages/MyQuizzes'
import Favorite from './pages/Favorite'
import CreateQuizForm from './pages/CreateQuizForm'

function App() {

  const checkAuth = useAuthStore(state => state.checkAuth);
  const loading = useAuthStore(state => state.loading);

  useEffect(() => {
    
    checkAuth(); 
  }, [checkAuth]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/MyQuizzes" element={<MyQuizzes />} />
          <Route path="/Favorite" element={<Favorite />} />
        </Route>
        <Route path="/AuthPage" element={<AuthPage />} />
        <Route path="/CreateQuizForm" element={<CreateQuizForm />} />
        <Route path="/CreateQuizForm/:quizId" element={<CreateQuizForm />} />
      </Routes>
    </>
  )
}


export default App
