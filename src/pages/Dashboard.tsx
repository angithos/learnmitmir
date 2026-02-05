import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseconfig";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<
  "translation" | "article" | null
>(null);
  const generateQuestions = async () => {
    if (!user) return;
    const token = await user.getIdToken();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        token,
        language: "German",
        level: "A2",
      }),
    });

    const data = await res.json();
    console.log(data);
  };
  const handleCardClick = (domain: string) => {
    navigate("/quiz/" + domain)
  }
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Willkommen beim Dashboard</h1>
        <p className="dashboard-subtitle">
          Wählen Sie eine Übungsart, um mit dem Lernen zu beginnen
        </p>
      </header>

      <div className="dashboard-content">
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={() => {
              setActiveType("translation")
              navigate("quiz/"+activeType)
            }}
          >
            Übersetzungs-Quiz
          </button>

          <button
            className="btn btn-secondary"
          // onClick={generateQuestions}
          >
            Neue Fragen generieren
          </button>

          <button
            className="btn btn-outline"
            onClick={() => {
              setActiveType("article")
              navigate("quiz/"+activeType)
            }}
          >
            Artikel-Quiz (bald verfügbar)
          </button>
        </div>

        <div className="dashboard-stats">
          {/* Add stats or progress indicators here */}
        </div>
      </div>
    </div>
  );
}