import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

import bgImage from "/img1.jpg";
import { AuthContext } from "../context/AuthContext";

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="bg-contain" style={{ backgroundImage: `url(${bgImage})` }}>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
};

export default App;