import { auth } from "../firebase/firebaseconfig";
import { useNavigate } from "react-router";
import React from "react";

export default function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  async function generateQuestions() {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language: "German", level: "A2" }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      console.log("Generated questions:", data);
    } catch (err) {
      console.error("Failed to generate questions:", err);
    }
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
          <button className="btn btn-primary" onClick={() => navigate("/quiz")}>
            Übersetzungs-Quiz
          </button>

          <button className="btn btn-secondary" onClick={generateQuestions}>
            Neue Fragen generieren
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/article")}
          >
            Artikel-Quiz
          </button>
        </div>

        <section className="dashboard-stats" aria-hidden>
          {/* Stats / progress can go here */}
        </section>
      </main>
    </div>
  );
}
