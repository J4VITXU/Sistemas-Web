// frontend/src/pages/Checkout.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthToken } from "../api/clients";
import { validateCheckout, type CheckoutValidateOut } from "../api/checkout";
import { createOrder } from "../api/orders";

type CartItem = {
  product_id: number;
  quantity: number;
};

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function clearCart() {
  localStorage.removeItem("cart");
}

export default function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [result, setResult] = useState<CheckoutValidateOut | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    const cart = loadCart();
    setCartItems(cart);

    async function runValidation() {
      setLoading(true);
      setError(null);

      if (cart.length === 0) {
        setResult(null);
        setLoading(false);
        return;
      }

      try {
        const data = await validateCheckout({ items: cart, currency: "USD" });
        setResult(data);
      } catch (e: any) {
        setError(e?.message || "Checkout validation failed");
      } finally {
        setLoading(false);
      }
    }

    runValidation();
  }, []);

  async function handleConfirmOrder() {
    setConfirmError(null);

    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    if (!result) return;

    if (result.items.length === 0) {
      setConfirmError("No valid items to order.");
      return;
    }

    setConfirming(true);
    try {
      const payload = {
        items: result.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        currency: result.currency,
      };

      await createOrder(payload);

      clearCart();
      navigate("/orders");
    } catch (e: any) {
      setConfirmError(e?.message || "Order creation failed");
    } finally {
      setConfirming(false);
    }
  }

  if (loading) return <p style={{ padding: 16 }}>Validating checkout…</p>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        <Link to="/cart">← Back to cart</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Go shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <h1>Checkout</h1>

      <Link to="/cart">← Back to cart</Link>

      {!result ? (
        <p>Could not validate cart.</p>
      ) : (
        <>
          <h3 style={{ marginTop: 16 }}>Validated items</h3>

          {result.items.length === 0 ? (
            <p>No valid items.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {result.items.map((it) => (
                <div
                  key={it.product_id}
                  style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}
                >
                  <strong>{it.title}</strong>
                  <div style={{ opacity: 0.8, marginTop: 6 }}>
                    Qty: {it.quantity} · Unit: {(it.unit_price_cents / 100).toFixed(2)}{" "}
                    {it.currency} · Subtotal: {(it.subtotal_cents / 100).toFixed(2)} {it.currency}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                    Stock available: {it.stock_available}
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.invalid_items.length > 0 && (
            <>
              <h3 style={{ marginTop: 16 }}>Invalid items</h3>
              <ul>
                {result.invalid_items.map((it) => (
                  <li key={`${it.product_id}-${it.reason}`}>
                    Product #{it.product_id} (qty {it.quantity}) — {it.reason}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 18 }}>
                Total:{" "}
                <strong>
                  {(result.total_cents / 100).toFixed(2)} {result.currency}
                </strong>
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              {confirmError && (
                <div style={{ color: "red", marginBottom: 8 }}>{confirmError}</div>
              )}

              <button onClick={handleConfirmOrder} disabled={confirming}>
                {confirming ? "Creating order…" : "Confirm order"}
              </button>

              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
                You must be logged in to confirm.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
