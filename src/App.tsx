import "./App.css";
import { BrowserRouter, Link } from "react-router";
import Rootes from "./Rootes";
import "./styles/styles.css";
function App() {
  return (
    <div>
      <BrowserRouter>
        <nav className="nav-bar">
          <div className="nav-content">
            <Link to="/" className="nav-logo">
              LangLearn
            </Link>
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/quiz" className="nav-link">
                Quiz
              </Link>
              <div className="nav-user">{/* User info here */}</div>
            </div>
          </div>
        </nav>
        <main className="main-container">
          <Rootes />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
