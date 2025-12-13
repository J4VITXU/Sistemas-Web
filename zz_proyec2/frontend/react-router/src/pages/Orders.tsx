// frontend/src/pages/Orders.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthToken } from "../api/clients";
import { listOrders, type Order } from "../api/orders";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listOrders();
        setOrders(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  if (loading) return <p style={{ padding: 16 }}>Loading orders…</p>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <h1>My Orders</h1>
      <Link to="/">← Back to products</Link>

      {orders.length === 0 ? (
        <p style={{ marginTop: 16 }}>No orders yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>Order #{o.id}</strong>
                <span style={{ opacity: 0.8 }}>
                  {new Date(o.created_at).toLocaleString()}
                </span>
              </div>

              <div style={{ marginTop: 6, opacity: 0.9 }}>
                Status: <strong>{o.status}</strong>
              </div>

              <div style={{ marginTop: 6 }}>
                Total:{" "}
                <strong>
                  {(o.total_cents / 100).toFixed(2)} {o.currency}
                </strong>
              </div>

              <div style={{ marginTop: 10 }}>
                <strong>Items</strong>
                <ul style={{ marginTop: 6 }}>
                  {o.items.map((it) => (
                    <li key={it.id}>
                      Product #{it.product_id} — qty {it.quantity} — unit{" "}
                      {(it.unit_price_cents / 100).toFixed(2)} {o.currency}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
