import { useEffect, useState } from "react";
/**
 * useParams: Hook to access URL parameters defined in the route.
 * - For route "heroes/:heroId", useParams() returns { heroId: "123" }
 * 
 * Link: Component for navigation without page reload.
 */
import { useParams, Link } from "react-router";
import type { Hero } from "../models/hero";
import { getHero } from "../api/heroes";
import "./HeroDetail.css";

export default function HeroDetail() {
  // Extract heroId from URL. For "/heroes/5", heroId will be "5"
  const { heroId } = useParams();
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * useEffect with [heroId] dependency:
   * - Runs when component mounts (first render)
   * - Runs again whenever heroId changes (user navigates to different hero)
   * 
   * This ensures we fetch the correct hero data when:
   * 1. User first visits /heroes/5
   * 2. User navigates from /heroes/5 to /heroes/10
   */
  useEffect(() => {
    async function fetchHero() {
      try {
        const data = await getHero(heroId!);
        setHero(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchHero();
  }, [heroId]); // Re-run effect when heroId changes

  if (loading) {
    return <div className="loading">Loading hero details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error">Error: {error}</p>
        {/* Link navigates back to home without page reload */}
        <Link to="/" className="back-link">Back to home</Link>
      </div>
    );
  }

  if (!hero) {
    return null;
  }

  return (
    <div className="hero-detail">
      <Link to="/" className="back-link">Back to Home</Link>
      <div className="hero-detail-card">
        <div className="hero-avatar">🦸</div>
        <h1>{hero.name}</h1>
        <div className="hero-info">
          <div className="info-item">
            <span className="label">ID:</span>
            <span className="value">{hero.id}</span>
          </div>
          {hero.age && (
            <div className="info-item">
              <span className="label">Age:</span>
              <span className="value">{hero.age} years old</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
