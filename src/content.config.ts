import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    year: z.number().int(),
    order: z.number().int(),
    categories: z.array(z.enum(['Program', 'Design', 'Management'])).min(1),
    cover: image(),
    coverAlt: z.string(),
    imageFit: z.enum(['cover', 'contain']).default('cover'),
    technologies: z.array(z.string()).default([]),
    gallery: z.array(z.object({ image: image(), alt: z.string(), caption: z.string() })).default([]),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  }),
});
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date().optional(),
    featured: z.boolean().default(false),
  }),
});
export const collections = { works, blog };
