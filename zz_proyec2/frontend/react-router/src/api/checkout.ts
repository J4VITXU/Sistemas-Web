// frontend/src/api/checkout.ts
import { apiFetch } from "./clients";

export type CheckoutValidateIn = {
  items: { product_id: number; quantity: number }[];
  currency?: string;
};

export type CheckoutValidatedItem = {
  product_id: number;
  title: string;
  unit_price_cents: number;
  quantity: number;
  subtotal_cents: number;
  stock_available: number;
  currency: string;
};

export type CheckoutInvalidItem = {
  product_id: number;
  quantity: number;
  reason: string; // "not_found" | "insufficient_stock"
};

export type CheckoutValidateOut = {
  currency: string;
  items: CheckoutValidatedItem[];
  invalid_items: CheckoutInvalidItem[];
  total_cents: number;
};

export async function validateCheckout(payload: CheckoutValidateIn): Promise<CheckoutValidateOut> {
  return apiFetch<CheckoutValidateOut>("/checkout/validate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
