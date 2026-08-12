import { useState } from "react";

interface GrammarSandboxInputProps {
  onGenerate: (topic: string) => Promise<void>;
}

export default function GrammarSandboxInput({ onGenerate }: GrammarSandboxInputProps) {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onGenerate(topic.trim());
      setTopic(""); 
    } catch (error) {
      console.error("Sandbox component error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        border: "1px solid #eef2f6",
        maxWidth: "540px",
        margin: "32px auto",
        padding: "28px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b", margin: "0 0 6px 0", letterSpacing: "-0.025em" }}>
          Grammar Sandbox AI
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
          Type any German grammar topic to generate a dynamic custom practice session instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div 
          style={{ 
            display: "flex", 
            width: "100%", 
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: isFocused ? "0 0 0 3px rgba(52, 152, 219, 0.25)" : "none",
            transition: "box-shadow 0.2s ease",
            border: `1px solid ${isFocused ? "#3498db" : "#cbd5e1"}`,
          }}
        >
          <input
            type="text"
            placeholder="e.g., Akkusativ, Wechselpräpositionen, Passiv..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "14px 16px",
              border: "none",
              outline: "none",
              fontSize: "0.95rem",
              color: "#334155",
              background: isLoading ? "#f8fafc" : "#ffffff",
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            style={{
              padding: "0 24px",
              background: topic.trim() && !isLoading ? "#3498db" : "#94a3b8",
              color: "#ffffff",
              border: "none",
              cursor: topic.trim() && !isLoading ? "pointer" : "not-allowed",
              fontWeight: "600",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background 0.2s ease",
            }}
          >
            {isLoading ? (
              <>
                <span 
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #ffffff",
                    borderBottomColor: "transparent",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "rotation 1s linear infinite",
                  }}
                />
                <style>{`
                  @keyframes rotation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </form>

      {/* Suggestion tags block */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginTop: "16px" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Suggestions:
        </span>
        {["Akkusativ", "Dativ", "Trennbare Verben"].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={isLoading}
            onClick={() => setTopic(suggestion)}
            style={{
              background: "#f1f5f9",
              color: "#475569",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "500",
              padding: "5px 12px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              if(!isLoading) {
                e.currentTarget.style.background = "#e2e8f0";
                e.currentTarget.style.color = "#1e293b";
              }
            }}
            onMouseOut={(e) => {
              if(!isLoading) {
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.color = "#475569";
              }
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}