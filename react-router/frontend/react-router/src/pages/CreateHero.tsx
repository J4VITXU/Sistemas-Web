import { useState } from "react";
/**
 * useNavigate: Hook for programmatic navigation.
 * - Returns a function to navigate to different routes
 * - Useful after form submissions, button clicks, etc.
 * - Unlike <Link>, this is used in event handlers, not JSX
 */
import { useNavigate } from "react-router";
import { createHero } from "../api/heroes";
import "./CreateHero.css";

export default function CreateHero() {
  // Get the navigate function to redirect user after actions
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [secretName, setSecretName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createHero({
        name,
        secret_name: secretName,
        age: age ? parseInt(age) : null,
      });

      // Programmatic navigation: redirect to home after successful creation
      // This is equivalent to clicking a <Link to="/">
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-hero">
      <h1>Create new hero</h1>
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="name">Hero name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter hero name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="secretName">Secret name</label>
          <input
            type="text"
            id="secretName"
            value={secretName}
            onChange={(e) => setSecretName(e.target.value)}
            placeholder="Enter secret identity"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter hero age"
            min="0"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating..." : "Create Hero"}
          </button>
          {/* navigate() can also be called in onClick handlers */}
          <button type="button" onClick={() => navigate("/")} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
