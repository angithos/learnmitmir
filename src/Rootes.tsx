import React from "react";
import { Routes, Route} from "react-router";
import SignUp from "./auth/Signup";
import SignIn from "./auth/Signin";
import Dashboard from "./pages/Dashboard";
import QuestionRenderer from "./pages/QuestionRenderer";
import Vocabulary from "./pages/Vocabulary";
import GrammarPage from "./pages/GrammarPage";


export default function Rootes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/vocabulary" element={<Vocabulary />} />
      <Route path="/grammarPage" element={<GrammarPage />} />
      {/* <Route path="/quiz" element={<Outlet />}> */}
      <Route path="/question_renderer" element={<QuestionRenderer/>}/>
      {/* </Route> */}
    </Routes>
  );
}

