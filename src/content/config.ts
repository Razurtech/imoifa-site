import { defineCollection, z } from "astro:content";

const glossarySchema = z.object({
  title: z.string(),
  lang: z.enum(["en", "yo"]),
  pronunciation: z.string().optional(),
  tags: z.array(z.string()).default([]),
  updated: z.string().optional(),
});

export const collections = {
  en_glossary: defineCollection({ type: "content", schema: glossarySchema }),
  yo_glossary: defineCollection({ type: "content", schema: glossarySchema }),
};
