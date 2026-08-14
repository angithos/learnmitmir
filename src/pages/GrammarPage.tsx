import { useNavigate } from "react-router";
import { auth } from "../firebase/firebaseconfig";
import GrammarSandboxInput from "./GrammarInputField";
import "../styles/GrammarPage.css";

export default function GrammarPage() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleAISandboxCall = async (selectedTopic: string) => {
    if (!user) {
      alert("Please log in to generate sandbox questions.");
      return;
    }

    try {
      const token = await user.getIdToken();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic: selectedTopic }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const result = await res.json();

      if (result.data.length > 0) {
        navigate("/question_renderer", {
          state: { customQuestions: result.data },
        });
      } else {
        alert(
          "The AI couldn't formulate questions for that topic. Try a different grammar keyword!"
        );
      }
    } catch (err) {
      console.error("Failed to generate sandbox questions:", err);
      alert("Something went wrong connecting to the generation server.");
    }
  };

  const handleRandomQuiz = () => {
    // Random grammar quiz logic will be implemented later.
  };

  return (
    <main className="grammar-page">
      <div className="grammar-container">

        <button
          className="grammar-back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <header className="grammar-header">
          <h1>Grammar Practice</h1>
          <p>Practice German grammar your way.</p>
        </header>

        <section className="grammar-options">

          {/* Custom AI Practice */}

          <article className="grammar-card">
            <div className="grammar-card-header">
              <div className="grammar-card-icon">
                ✨
              </div>

              <div>
                <h2>Custom AI Practice</h2>

                <p>
                  Want to practice a specific grammar concept?
                  Enter a topic and let AI create a custom quiz for you.
                </p>
              </div>
            </div>

            <GrammarSandboxInput
              onGenerate={handleAISandboxCall}
            />
          </article>

          {/* Random Practice */}

          <article className="grammar-card">
            <div className="grammar-card-header">
              <div className="grammar-card-icon">
                🎲
              </div>

              <div>
                <h2>Random Grammar Practice</h2>

                <p>
                  Not sure what to practice? Get a random selection
                  of grammar questions from your existing collection.
                </p>
              </div>
            </div>

            <button
              className="grammar-action-button"
              onClick={handleRandomQuiz}
            >
              Start Random Quiz →
            </button>
          </article>

        </section>

      </div>
    </main>
  );
}