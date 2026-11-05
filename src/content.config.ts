import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    year: z.preprocess(value => value === '' || value === null ? undefined : value, z.number().int().optional()),
    order: z.number().int(),
    draft: z.boolean().default(false),
    categories: z.array(z.enum(['Program', 'Design', 'Management', 'Research', 'Education', 'Video', 'Planning'])).min(1),
    cover: z.preprocess(value => value === '' || value === null ? undefined : value, image().optional()),
    coverAlt: z.string().default(''),
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
    date: z.preprocess(value => value === '' || value === null ? undefined : value, z.coerce.date().optional()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    ogTitle: z.preprocess(value => value === '' || value === null ? undefined : value, z.string().optional()),
  }),
});
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: ({ image }) => z.object({
    portrait: image(),
    portraitAlt: z.string(),
    tags: z.array(z.string()),
    introduction: z.string(),
    hometown: z.string(),
    history: z.array(z.object({ year: z.string(), event: z.string() })),
    policyLead: z.string(),
    policyTitle: z.string(),
    policySummary: z.string(),
    policyDescription: z.string(),
    skillsIntroduction: z.string(),
    designIntroduction: z.string(),
    values: z.array(z.object({ title: z.string(), text: z.string() })),
  }),
});
export const collections = { works, blog, pages };
