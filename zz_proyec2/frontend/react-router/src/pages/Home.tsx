import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listProducts } from "../api/products";
import type { Product } from "../models/products";

import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts(q?: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts(q);
      setProducts(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchProducts(query);
  }

  if (loading) {
    return (
      <div className="home">
        <div className="home__container">
          <p className="home__state">Loading products…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="home__container">
          <div className="home__state home__state--error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home__container">
        <h1 className="home__title">Products</h1>

        <div className="home__toolbar">
          <form className="search" onSubmit={handleSearch}>
            <input
              className="search__input"
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search__button" type="submit">
              Search
            </button>
          </form>
        </div>

        {products.length === 0 ? (
          <p className="home__state">No products found</p>
        ) : (
          <ul className="grid" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {products.map((p) => (
              <li key={p.id} className="card">
                <h3 className="card__title">{p.title}</h3>
                <p className="card__desc">{p.description}</p>
                <p className="card__price">
                  {(p.price_cents / 100).toFixed(2)} {p.currency}
                </p>
                <Link className="card__link" to={`/products/${p.id}`}>
                  View details →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
