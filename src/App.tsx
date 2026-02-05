
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import SignUp from '../src/auth/Signup'
import SignIn from '../src/auth/Signin'
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import "./styles/styles.css";
import { useState } from 'react';
function App() {
  const [topname, setTopname] = useState("")

  return <div>
    <BrowserRouter>
    <nav className="nav-bar">
        <div className="nav-content">
          <Link to="/" className="nav-logo">LangLearn</Link>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/quiz" className="nav-link">Quiz</Link>
            <div className="nav-user">
              {/* User info here */}
            </div>
          </div>
        </div>
      </nav>
      <main className="main-container">
    <Routes>
        <Route path="/" element={<SignIn/>}/>
        <Route path="/signup"  element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* <Route path="/quiz" element={<QuizPage />}/> */}
        <Route path="/quiz:topname" element={<QuizPage domain={topname} />}/>
    </Routes>
    </main>
    </BrowserRouter>
  </div>
}

export default App;