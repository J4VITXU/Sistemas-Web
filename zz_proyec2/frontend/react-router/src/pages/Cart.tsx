import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Product } from "../models/products";
import { getProduct } from "../api/products";

import "./Cart.css";

type CartItem = {
  product_id: number;
  quantity: number;
};

const CART_KEY = "cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cart = loadCart();
    setItems(cart);

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const loaded: Product[] = [];
        for (const item of cart) {
          const product = await getProduct(item.product_id);
          loaded.push(product);
        }
        setProducts(loaded);
      } catch (e: any) {
        setError(e?.message || "Failed to load cart products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function updateQty(productId: number, qty: number) {
    const updated = items
      .map((i) => (i.product_id === productId ? { ...i, quantity: qty } : i))
      .filter((i) => i.quantity > 0);

    setItems(updated);
    saveCart(updated);
  }

  function removeItem(productId: number) {
    const updated = items.filter((i) => i.product_id !== productId);
    setItems(updated);
    saveCart(updated);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }

  function clearCart() {
    setItems([]);
    setProducts([]);
    localStorage.removeItem(CART_KEY);
  }

  const totalCents = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product_id);
      return product ? sum + product.price_cents * item.quantity : sum;
    }, 0);
  }, [items, products]);

  if (loading) {
    return (
      <div className="cart">
        <div className="cart__container">
          <div className="cart__state">Loading cart…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart">
        <div className="cart__container">
          <div className="cart__state cart__state--error">Error: {error}</div>
          <div style={{ marginTop: 10 }}>
            <Link to="/">Back</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart">
        <div className="cart__container">
          <h1 className="cart__title">Cart</h1>
          <div className="cart__state">
            <p style={{ margin: 0 }}>Your cart is empty.</p>
            <div style={{ marginTop: 8 }}>
              <Link to="/">Go shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__container">
        <h1 className="cart__title">Cart</h1>

        <div className="cart__list">
          {items.map((item) => {
            const product = products.find((p) => p.id === item.product_id);
            if (!product) return null;

            return (
              <div key={product.id} className="cartItem">
                <div>
                  <h3 className="cartItem__title">{product.title}</h3>
                  <p className="cartItem__price">
                    {(product.price_cents / 100).toFixed(2)} {product.currency}
                  </p>

                  <div className="cartItem__controls">
                    <label className="cartItem__qtyLabel">
                      Qty:
                      <input
                        className="cartItem__qtyInput"
                        type="number"
                        min={0}
                        max={product.stock}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQty(product.id, Number(e.target.value))
                        }
                      />
                    </label>

                    <button
                      className="cartItem__remove"
                      onClick={() => removeItem(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div>
                  <p className="cartItem__subtotal">
                    Subtotal:{" "}
                    <strong>
                      {((product.price_cents * item.quantity) / 100).toFixed(2)}{" "}
                      {product.currency}
                    </strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart__footer">
          <button className="cart__clear" onClick={clearCart}>
            Clear cart
          </button>

          <div className="cart__summary">
            <p className="cart__summaryRow">
              <span className="cart__totalLabel">Total</span>
              <span className="cart__totalValue">
                {(totalCents / 100).toFixed(2)}
              </span>
            </p>
            <button
              className="cart__checkout"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
