// /types/projects.d.ts

export interface ProjectInput {
  title: string;
  description: string;
  image: string; // required for create
}

export interface ProjectUpdateInput {
  title: string;
  description: string;
  image?: string; // optional for update
}

export interface ProjectRecord extends ProjectInput {
  id: number;
  site_key: string;
  created_at: string;
  updated_at?: string;
}