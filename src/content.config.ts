import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The citation gate. CLAUDE.md §5: the build fails on an empty source list, on a
// `father` without `work`, and on a `verified` page containing any TODO ref.

const source = z
  .object({
    type: z.enum(['scripture', 'ccc', 'father', 'council', 'encyclical']),
    ref: z.string().min(1),
    work: z.string().min(1).optional(),
    url: z.string().url().optional(),
  })
  .superRefine((s, ctx) => {
    if (s.type === 'father' && !s.work) {
      ctx.addIssue({
        code: 'custom',
        path: ['work'],
        message: 'A `father` source needs `work`, e.g. "Justin Martyr, First Apology 66".',
      });
    }
  });

const claim = z.object({
  text: z.string().min(1),
  sources: z.array(source).min(1, 'Every claim needs at least one source.'),
});

const furtherReading = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  note: z.string().optional(),
});

const concepts = defineCollection({
  loader: glob({ base: './src/content/concepts', pattern: '**/*.mdx' }),
  schema: z
    .object({
      title: z.string().min(1),
      audience_level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      summary: z.string().min(1),
      claims: z.array(claim).min(1, 'A concept page needs at least one claim.'),
      further_reading: z.array(furtherReading).optional(),
      status: z.enum(['draft', 'verified']),
    })
    .superRefine((page, ctx) => {
      if (page.status !== 'verified') return;
      page.claims.forEach((c, i) =>
        c.sources.forEach((s, j) => {
          if (s.ref.trim().toUpperCase().startsWith('TODO')) {
            ctx.addIssue({
              code: 'custom',
              path: ['claims', i, 'sources', j, 'ref'],
              message: 'A verified page cannot contain a TODO ref.',
            });
          }
        }),
      );
    }),
});

export const collections = { concepts };
