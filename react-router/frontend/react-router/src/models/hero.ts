export interface Hero {
  id: number;
  name: string;
  age: number | null;
}

export interface HeroCreate {
  name: string;
  secret_name: string;
  age: number | null;
}
