import { defineCollection, z } from "astro:content";

const cms = defineCollection({
  type: "data",
  schema: z.any(),
});

export const collections = { cms };
