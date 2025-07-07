// /types/blogs.d.ts

export interface BlogInput {
  title: string;
  author: string;
  summary: string;
  content: string;
}

export interface BlogRecord extends BlogInput {
  id: number;
  site_key: string;
  created_at: string;
  updated_at?: string;
}