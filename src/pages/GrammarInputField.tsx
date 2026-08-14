import { useState } from "react";

interface GrammarSandboxInputProps {
  onGenerate: (topic: string) => Promise<void>;
}

export default function GrammarSandboxInput({
  onGenerate,
}: GrammarSandboxInputProps) {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = ["Akkusativ", "Dativ", "Trennbare Verben"];

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
    <div className="grammar-sandbox">

      <form onSubmit={handleSubmit} className="grammar-sandbox-form">
        <div
          className={`grammar-input-wrapper ${
            isFocused ? "grammar-input-focused" : ""
          }`}
        >
          <input
            type="text"
            placeholder="e.g. Akkusativ, Wechselpräpositionen, Passiv..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            className="grammar-topic-input"
          />

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="grammar-generate-button"
          >
            {isLoading ? (
              <>
                <span className="grammar-spinner" />
                Generating...
              </>
            ) : (
              "Generate Quiz →"
            )}
          </button>
        </div>
      </form>

      <div className="grammar-suggestions">
        <span className="grammar-suggestions-label">
          Suggestions
        </span>

        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={isLoading}
            onClick={() => setTopic(suggestion)}
            className="grammar-suggestion"
          >
            {suggestion}
          </button>
        ))}
      </div>

    </div>
  );
}