import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    deck: z.string(),
    eyebrow: z.string().default('Case'),
    order: z.number(),
    draft: z.boolean().default(false),
    repo: z.string().url().optional(),
    notebook: z.string().url().optional(),
    metrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
          retracted: z.boolean().default(false),
        })
      )
      .min(2)
      .max(4),
  }),
});

export const collections = { work };