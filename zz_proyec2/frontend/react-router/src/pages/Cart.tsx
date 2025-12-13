// frontend/src/pages/Cart.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { Product } from "../models/products";
import { getProduct } from "../api/products";

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

  if (loading) return <p style={{ padding: 16 }}>Loading cart…</p>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        <Link to="/">Back</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Go shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <h1>Cart</h1>

      {items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) return null;

        return (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <h3>{product.title}</h3>
            <p>
              {(product.price_cents / 100).toFixed(2)} {product.currency}
            </p>

            <label>
              Qty:{" "}
              <input
                type="number"
                min={0}
                max={product.stock}
                value={item.quantity}
                onChange={(e) => updateQty(product.id, Number(e.target.value))}
              />
            </label>

            <p>
              Subtotal:{" "}
              <strong>
                {((product.price_cents * item.quantity) / 100).toFixed(2)}{" "}
                {product.currency}
              </strong>
            </p>

            <button onClick={() => removeItem(product.id)}>Remove</button>
          </div>
        );
      })}

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
        <button onClick={clearCart}>Clear cart</button>

        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 18 }}>
            Total: <strong>{(totalCents / 100).toFixed(2)}</strong>
          </p>
          <button onClick={() => navigate("/checkout")}>Checkout</button>
        </div>
      </div>
    </div>
  );
}
