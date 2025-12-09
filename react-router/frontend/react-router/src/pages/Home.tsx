import { useEffect, useState } from "react";
/**
 * Link: Component for navigation without page reload.
 * - Works like <a> but uses client-side routing
 * - The `to` prop specifies the destination path
 */
import { Link } from "react-router";
import type { Hero } from "../models/hero";
import { getHeroes } from "../api/heroes";
import "./Home.css";

export default function Home() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect: Hook to perform side effects (API calls, subscriptions, etc.)
   * 
   * Syntax: useEffect(effectFunction, dependencyArray)
   * 
   * - The effect function runs AFTER the component renders
   * - The dependency array [] (empty) means: run only ONCE when component mounts
   * - If we had [someVar], it would re-run whenever someVar changes
   * 
   * Common use cases:
   * - Fetching data from an API
   * - Setting up subscriptions
   * - Updating the document title
   */
  useEffect(() => {
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

    fetchHeroes();
  }, []); // Empty array = run only on mount (component first appears)

  if (loading) {
    return <div className="loading">Loading heroes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home">
      <h1>Hero database</h1>
      <p className="subtitle">
        Welcome to the Hero database! Click on a hero to see their details.
      </p>
      {heroes.length === 0 ? (
        <p className="no-heroes">No heroes found. Add some heroes to get started!</p>
      ) : (
        <div className="heroes-grid">
          {heroes.map((hero) => (
            // Link navigates to /heroes/1, /heroes/2, etc. without page reload
            <Link key={hero.id} to={`/heroes/${hero.id}`} className="hero-card">
              <h2>{hero.name}</h2>
              {hero.age && <p className="hero-age">Age: {hero.age}</p>}
              <span className="view-details">View details →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
