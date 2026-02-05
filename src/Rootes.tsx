import React from "react";
import { Routes, Route, Outlet } from "react-router";
import SignUp from "./auth/Signup";
import SignIn from "./auth/Signin";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ArticlePage from "./pages/ArticlePage";

export default function Rootes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/quiz" element={<Outlet />}>
        <Route index element={<QuizPage />} />
        <Route path="/article" element={<ArticlePage />} />
      </Route>
    </Routes>
  );
}
