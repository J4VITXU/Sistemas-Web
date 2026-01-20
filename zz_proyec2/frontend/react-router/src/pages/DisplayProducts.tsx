import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProduct } from "../api/products";
import type { Product } from "../models/products";

import "./DisplayProducts.css";

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
    if (idx >= 0) cart[idx].quantity += safeQty;
    else cart.push({ product_id: product.id, quantity: safeQty });

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  }

  if (loading) {
    return (
      <div className="productPage">
        <div className="productPage__container">
          <div className="productPage__state">Loading product…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productPage">
        <div className="productPage__container">
          <div className="productPage__state productPage__state--error">
            Error: {error}
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="productPage__back" to="/">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="productPage">
        <div className="productPage__container">
          <div className="productPage__state">Product not found</div>
          <div style={{ marginTop: 10 }}>
            <Link className="productPage__back" to="/">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="productPage">
      <div className="productPage__container">
        <Link className="productPage__back" to="/">
          ← Back to products
        </Link>

        <div className="productCard">
          <h1 className="productCard__title">{product.title}</h1>
          <p className="productCard__desc">{product.description}</p>

          <div className="productCard__price">
            {(product.price_cents / 100).toFixed(2)} {product.currency}
          </div>

          <div className="productCard__stock">
            Stock: <strong>{product.stock}</strong>{" "}
            {outOfStock && <span className="badgeOut">Out of stock</span>}
          </div>

          <div className="productActions">
            <label className="qtyLabel">
              Qty:
              <input
                className="qtyInput"
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={outOfStock}
              />
            </label>

            <button
              className="primaryBtn"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              {outOfStock ? "Out of stock" : "Add to cart"}
            </button>

            <Link className="secondaryLink" to="/cart">
              Go to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
