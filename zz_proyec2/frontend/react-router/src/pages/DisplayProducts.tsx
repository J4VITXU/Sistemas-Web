import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProduct } from "../api/products";
import type { Product } from "../models/products";

type CartItem = {
  product_id: number;
  quantity: number;
};

export default function DisplayProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const productId = Number(id);
      if (!productId || Number.isNaN(productId)) {
        setError("Invalid product id");
        setLoading(false);
        return;
      }

      try {
        const data = await getProduct(productId);
        setProduct(data);
        setQty(1);
      } catch (e: any) {
        setError(e?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function handleAddToCart() {
    if (!product) return;

    const safeQty = Math.max(1, Math.min(qty, product.stock));

    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const idx = cart.findIndex((i) => i.product_id === product.id);
    if (idx >= 0) {
      cart[idx].quantity += safeQty;
    } else {
      cart.push({ product_id: product.id, quantity: safeQty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  }

  if (loading) return <p style={{ padding: 16 }}>Loading product…</p>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 16 }}>
        <p>Product not found</p>
        <Link to="/">← Back</Link>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <Link to="/">← Back to products</Link>

      <h1 style={{ marginTop: 12 }}>{product.title}</h1>
      <p style={{ opacity: 0.8 }}>{product.description}</p>

      <p style={{ fontSize: 18 }}>
        <strong>
          {(product.price_cents / 100).toFixed(2)} {product.currency}
        </strong>
      </p>

      <p style={{ opacity: 0.8 }}>Stock: {product.stock}</p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          Qty:
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            style={{ width: 80, padding: 8 }}
            disabled={outOfStock}
          />
        </label>

        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          style={{ padding: "10px 14px", borderRadius: 10, cursor: "pointer" }}
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>

        <Link to="/cart">Go to cart</Link>
      </div>
    </div>
  );
}
