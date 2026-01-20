import { apiFetch } from "./clients";

export type OrderCreateIn = {
  items: { product_id: number; quantity: number }[];
  currency?: string;
};

export type OrderItem = {
  id: number;
  product_id: number;
  unit_price_cents: number;
  quantity: number;
};

export type Order = {
  id: number;
  user_id: number;
  status: string;
  total_cents: number;
  currency: string;
  created_at: string;
  items: OrderItem[];
};

export async function createOrder(payload: OrderCreateIn): Promise<Order> {
  return apiFetch<Order>("/orders/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders/", { method: "GET" });
}
