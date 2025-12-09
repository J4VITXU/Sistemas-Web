import { useEffect, useState } from "react";
/**
 * useNavigate: Hook for programmatic navigation.
 * - Returns a function to navigate to different routes
 * - Used here to redirect user to create page if no heroes exist
 */
import { useNavigate } from "react-router";
import type { Hero } from "../models/hero";
import { getHeroes, deleteHero } from "../api/heroes";
import "./DeleteHero.css";

export default function DeleteHero() {
  const navigate = useNavigate();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  /**
   * useEffect with empty dependency array []:
   * - Runs only ONCE when component mounts
   * - Fetches the list of heroes to display
   */
  useEffect(() => {
    fetchHeroes();
  }, []); // Empty array = run only on mount

  async function fetchHeroes() {
    try {
      const data = await getHeroes();
      setHeroes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(heroId: number, heroName: string) {
    if (!confirm(`Are you sure you want to delete ${heroName}?`)) {
      return;
    }

    setDeleting(heroId);
    try {
      await deleteHero(heroId);

      // Remove hero from list
      setHeroes(heroes.filter((h) => h.id !== heroId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return <div className="loading">Loading heroes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="delete-hero">
      <h1>Delete heroes</h1>
      <p className="subtitle">Select a hero to delete from the database.</p>
      {heroes.length === 0 ? (
        <div className="no-heroes">
          <p>No heroes to delete.</p>
          {/* Programmatic navigation via onClick */}
          <button onClick={() => navigate("/create")} className="create-btn">
            Create a Hero
          </button>
        </div>
      ) : (
        <div className="heroes-delete-list">
          {heroes.map((hero) => (
            <div key={hero.id} className="hero-delete-item">
              <div className="hero-info">
                <h3>{hero.name}</h3>
                {hero.age && <span className="hero-age">Age: {hero.age}</span>}
              </div>
              <button
                onClick={() => handleDelete(hero.id, hero.name)}
                disabled={deleting === hero.id}
                className="delete-btn"
              >
                {deleting === hero.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
