import { auth } from "../firebase/firebaseconfig";
import { Link, useNavigate } from "react-router";
import React, { useState } from "react";
import { fetchDueReviews } from "../utils/fetchQuestions";
import GrammarSandboxInput from "./GrammarInputField";

export default function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAISandboxCall = async (selectedTopic: string) => {
    if (!user) {
      alert("Please log in to generate sandbox questions.");
      return;
    }

    try {
      // 1. Fetch the user's Auth Token to pass through the Vercel middleware security check
      const token = await user.getIdToken();

      // 2. Send the topic query string straight to your updated Vercel serverless function
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
      debugger

      // 3. Check if we received back the array of questions successfully
      if (result.data.length > 0) {
        // 4. Pass the array of AI questions directly down to your renderer view state!
        navigate("/question_renderer", { state: { customQuestions: result.data } });
      } else {
        alert("The AI couldn't formulate questions for that topic. Try a different grammar keyword!");
      }
    } catch (err) {
      console.error("Failed to generate sandbox questions:", err);
      alert("Something went wrong connecting to the generation server.");
    }
  };

  const startReviewDeck = async () => {
    setLoading(true);
    
    // Set parameter to TRUE for testing, so you can see tomorrow's items today!
    const dueItems = await fetchDueReviews(true); 
    
    setLoading(false);

    if (dueItems.length === 0) {
      alert("No reviews due right now! Great job.");
      return;
    }

    // Navigate to your quiz view and pass the custom review deck as state
    navigate("/question_renderer", { state: { customQuestions: dueItems } });
  };
  const handleVocabulary = () =>{

  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Willkommen beim Dashboard</h1>
        <p className="dashboard-subtitle">
          Wählen Sie eine Übungsart, um mit dem Lernen zu beginnen
        </p>
      </header>

      <main className="dashboard-content">
        <div className="button-group">
          
          <button 
            className="btn btn-primary" 
            onClick={startReviewDeck} 
            disabled={loading}
            style={{ marginBottom: "20px", display: "block", background: "#9b59b6", color: "white" }}
          >
            
            {loading ? "Loading Deck..." : "Review Due Items "}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={startReviewDeck} 
            disabled={loading}
            style={{ marginBottom: "20px", display: "block", background: "#9b59b6", color: "white" }}

          >
{"Generate Quiz"}
</button>
<Link to="/vocabulary" className="btn btn-primary" style={{ marginBottom: "20px", display: "block", background: "#9b59b6", color: "white" }}>
  Practice vocabulary
</Link>
          {/* Integrated AI text input sandbox bar */}
          {/* <GrammarSandboxInput onGenerate={handleAISandboxCall}/> */}
        
        </div>

        <section className="dashboard-stats" aria-hidden>
          {/* Stats / progress can go here */}
        </section>
      </main>
    </div>
  );
}