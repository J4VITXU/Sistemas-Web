import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthToken } from "../api/clients";
import { listOrders, type Order } from "../api/orders";

import "./Orders.css";

function statusClass(status: string) {
  const s = status.toLowerCase();
  if (["paid", "completed", "delivered", "success"].some((k) => s.includes(k))) {
    return "badge badge--success";
  }
  if (["pending", "processing", "unpaid"].some((k) => s.includes(k))) {
    return "badge badge--warn";
  }
  return "badge badge--neutral";
}

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

  if (loading) {
    return (
      <div className="orders">
        <div className="orders__container">
          <div className="orders__state">Loading orders…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <div className="orders__container">
          <div className="orders__state orders__state--error">Error: {error}</div>
          <div style={{ marginTop: 10 }}>
            <Link className="orders__back" to="/">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders__container">
        <h1 className="orders__title">My Orders</h1>
        <Link className="orders__back" to="/">
          ← Back to products
        </Link>

        {orders.length === 0 ? (
          <div className="orders__state" style={{ marginTop: 12 }}>
            No orders yet.
          </div>
        ) : (
          <div className="orders__grid">
            {orders.map((o) => (
              <div key={o.id} className="orderCard">
                <div className="orderCard__top">
                  <span className="orderCard__id">Order #{o.id}</span>
                  <span className="orderCard__date">
                    {new Date(o.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="orderCard__meta">
                  <span>
                    Status:{" "}
                    <span className={statusClass(o.status)}>{o.status}</span>
                  </span>

                  <span>
                    Total:{" "}
                    <strong>
                      {(o.total_cents / 100).toFixed(2)} {o.currency}
                    </strong>
                  </span>
                </div>

                <div className="orderCard__itemsTitle">Items</div>
                <ul className="orderCard__items">
                  {o.items.map((it) => (
                    <li key={it.id}>
                      Product #{it.product_id} — qty {it.quantity} — unit{" "}
                      {(it.unit_price_cents / 100).toFixed(2)} {o.currency}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
