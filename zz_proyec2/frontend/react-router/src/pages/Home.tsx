import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listProducts } from "../api/products";
import type { Product } from "../models/products";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return <p style={{ padding: 16 }}>Loading products…</p>;
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: "red" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Products</h1>

      <form onSubmit={handleSearch} style={{ margin: "16px 0" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, marginRight: 8 }}
        />
        <button type="submit">Search</button>
      </form>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((p) => (
            <li
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p>
                <strong>
                  {(p.price_cents / 100).toFixed(2)} {p.currency}
                </strong>
              </p>
              <Link to={`/products/${p.id}`}>View details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
