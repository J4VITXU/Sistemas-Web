// frontend/src/models/users.ts

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};
