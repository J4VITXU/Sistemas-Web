import { apiFetch, setAuthToken, clearAuthToken } from "./clients";
import type { User } from "../models/user";

export async function createUser(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}): Promise<User> {
  return apiFetch<User>("/users/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


// LOGIN
export async function login(email: string, password: string): Promise<void> {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await apiFetch<{
    access_token: string;
    token_type: string;
  }>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  setAuthToken(res.access_token);
}

// LOGOUT
export function logout() {
  clearAuthToken();
}
