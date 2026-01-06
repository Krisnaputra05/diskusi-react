import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingBar from "react-redux-loading-bar"; // <--- UBAH INI (Library Import)
import { asyncPreloadProcess } from "./features/auth/authSlice";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import Navigation from "./components/Navigation";

function App() {
  const { isPreload } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return null; // Atau loading spinner sederhana
  }

  return (
    <>
      {/* UPDATE DI SINI: Styling agar menempel di atas */}
      <LoadingBar
        style={{
          zIndex: 9999,
          backgroundColor: "blue",
          position: "fixed",
          top: 0,
          width: "100%",
          height: "3px",
        }}
      />

      <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
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
