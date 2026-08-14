import { Link, useNavigate } from "react-router";
import { auth } from "../firebase/firebaseconfig";
import { useState } from "react";
import { fetchDueReviews } from "../utils/fetchQuestions";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startReviewDeck = async () => {
    setLoading(true);

    try {
      // Temporary TRUE for testing.
      // Change to FALSE when the real review logic is ready.
      const dueItems = await fetchDueReviews(true);

      if (dueItems.length === 0) {
        alert("You're all caught up! No reviews are due right now.");
        return;
      }

      navigate("/question_renderer", {
        state: { customQuestions: dueItems },
      });
    } catch (error) {
      console.error("Failed to load review deck:", error);
      alert("Something went wrong while loading your reviews.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard">
      <div className="dashboard-container">

        {/* Header */}

        <header className="dashboard-header">
          <h1 className="dashboard-title">
            Guten Morgen, {user?.displayName || "Angith"} 👋
          </h1>

          <p className="dashboard-subtitle">
            Welcome back! Ready to learn some German?
          </p>
        </header>


        {/* Review */}

        <section className="review-section">

          <div className="review-content">
            <div className="review-icon">
              🔄
            </div>

            <div>
              <p className="section-label">
                REVIEW
              </p>

              <h2>
                Keep your learning going
              </h2>

              <p className="review-description">
                12 questions are waiting for you.
              </p>
            </div>
          </div>

          <button
            className="review-button"
            onClick={startReviewDeck}
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Review →"}
          </button>

        </section>


        {/* Practice */}

        <section className="practice-section">

          <div className="section-heading">
            <h2>Practice</h2>

            <p>
              Choose how you want to practice.
            </p>
          </div>


          <div className="practice-grid">

            {/* Grammar */}

            <article className="practice-card">

              <div className="practice-card-icon grammar-icon">
                🧠
              </div>

              <div className="practice-card-content">
                <h3>
                  Practice German
                </h3>

                <p>
                  Practice grammar with custom AI quizzes
                  or random questions.
                </p>
              </div>

              <button
                className="practice-button"
                onClick={() => navigate("/grammarPage")}
              >
                Start →
              </button>

            </article>


            {/* Vocabulary */}

            <article className="practice-card">

              <div className="practice-card-icon vocabulary-icon">
                📚
              </div>

              <div className="practice-card-content">
                <h3>
                  Vocabulary
                </h3>

                <p>
                  Add new German words or practice
                  vocabulary you've already learned.
                </p>
              </div>

              <Link
                to="/vocabulary"
                className="practice-button"
              >
                Open →
              </Link>

            </article>

          </div>

        </section>


        {/* Progress */}

        <section className="progress-section">

          <div className="section-heading">
            <h2>Your Progress</h2>

            <p>
              Keep track of your learning journey.
            </p>
          </div>


          <div className="progress-grid">

            <div className="progress-card">
              <span className="progress-value">
                42
              </span>

              <span className="progress-label">
                Words learned
              </span>
            </div>


            <div className="progress-card">
              <span className="progress-value">
                128
              </span>

              <span className="progress-label">
                Reviews completed
              </span>
            </div>


            <div className="progress-card">
              <span className="progress-value">
                23
              </span>

              <span className="progress-label">
                Quizzes completed
              </span>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}