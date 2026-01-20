import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuthToken } from "../api/clients";
import { validateCheckout, type CheckoutValidateOut } from "../api/checkout";
import { createOrder } from "../api/orders";

import "./Checkout.css";

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
        items: result.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
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

  if (loading) {
    return (
      <div className="checkout">
        <div className="checkout__container">
          <div className="checkout__state">Validating checkout…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout">
        <div className="checkout__container">
          <div className="checkout__state checkout__state--error">
            Error: {error}
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="checkout__back" to="/cart">
              ← Back to cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <div className="checkout__container">
          <h1 className="checkout__title">Checkout</h1>
          <div className="checkout__state">
            <p style={{ margin: 0 }}>Your cart is empty.</p>
            <div style={{ marginTop: 8 }}>
              <Link className="checkout__back" to="/">
                Go shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__container">
        <h1 className="checkout__title">Checkout</h1>

        <Link className="checkout__back" to="/cart">
          ← Back to cart
        </Link>

        {!result ? (
          <div className="checkout__state">Could not validate cart.</div>
        ) : (
          <>
            <div className="checkout__grid">
              <div>
                <h3 className="checkout__sectionTitle">Validated items</h3>

                {result.items.length === 0 ? (
                  <div className="checkout__state">No valid items.</div>
                ) : (
                  <div className="checkout__items">
                    {result.items.map((it) => (
                      <div key={it.product_id} className="itemCard">
                        <p className="itemCard__title">{it.title}</p>

                        <div className="itemCard__meta">
                          Qty: {it.quantity} · Unit:{" "}
                          {(it.unit_price_cents / 100).toFixed(2)} {it.currency}
                          {" · "}
                          Subtotal:{" "}
                          {(it.subtotal_cents / 100).toFixed(2)} {it.currency}
                        </div>

                        <div className="itemCard__stock">
                          Stock available: {it.stock_available}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {result.invalid_items.length > 0 && (
                  <>
                    <h3 className="checkout__sectionTitle">Invalid items</h3>
                    <div className="invalidBox">
                      <ul className="invalidBox__list">
                        {result.invalid_items.map((it) => (
                          <li key={`${it.product_id}-${it.reason}`}>
                            Product #{it.product_id} (qty {it.quantity}) —{" "}
                            {it.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <aside className="summary">
                <p className="summary__row">
                  <span className="summary__label">Total</span>
                  <span className="summary__value">
                    {(result.total_cents / 100).toFixed(2)} {result.currency}
                  </span>
                </p>

                {confirmError && (
                  <div className="summary__error">{confirmError}</div>
                )}

                <button
                  className="summary__button"
                  onClick={handleConfirmOrder}
                  disabled={confirming}
                >
                  {confirming ? "Creating order…" : "Confirm order"}
                </button>

                <div className="summary__hint">
                  You must be logged in to confirm.
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
