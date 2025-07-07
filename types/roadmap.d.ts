// /types/roadmap.d.ts
import { Bson } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

export interface RoadmapItemInput {
  title: string;
  description: string;
  status?: string;
  priority?: string;
  targetRelease?: string;
  tags?: string[];
}

export interface RoadmapItem extends RoadmapItemInput {
  _id: Bson.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}