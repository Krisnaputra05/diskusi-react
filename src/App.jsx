import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPreloadProcess } from './features/auth/authSlice';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Navigation from './components/Navigation';
import LoadingBar from './components/LoadingBar'; // Visual enhancement

function App() {
  const { isPreload } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return (
        <div className="flex justify-center items-center h-screen">
             <div className="text-xl font-bold text-primary">Loading...</div>
        </div>
    );
  }

  return (
    <>
      <LoadingBar />
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <header>
             <Navigation />
        </header>
        <main className="pt-4">
           <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/threads/:id" element={<DetailPage />} />
             <Route path="/login" element={<LoginPage />} />
             <Route path="/register" element={<RegisterPage />} />
             <Route path="/leaderboards" element={<LeaderboardPage />} />
           </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
