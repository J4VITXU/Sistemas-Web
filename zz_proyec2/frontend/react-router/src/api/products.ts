// frontend/src/api/products.ts
import { apiFetch } from "./clients";
import type { Product } from "../models/products";

// Lista productos (con búsqueda opcional)
export async function listProducts(q?: string): Promise<Product[]> {
  const query = q && q.trim().length > 0 ? `?q=${encodeURIComponent(q.trim())}` : "";
  return apiFetch<Product[]>(`/products/${query}`);
}

// Obtener producto por ID
export async function getProduct(productId: number): Promise<Product> {
  return apiFetch<Product>(`/products/${productId}`);
}

// (Opcional) Obtener producto por slug
export async function getProductBySlug(slug: string): Promise<Product> {
  return apiFetch<Product>(`/products/slug/${encodeURIComponent(slug)}`);
}
