import { z } from "zod";

export const newsWriteSchema = z.object({
  headline: z.string().min(3).max(500),
  title: z.string().min(3).max(500).optional(),
  summary: z.string().max(2000).nullable().optional(),
  content: z.string().min(1),
  cover_image_url: z.string().nullable().optional(),
  media_url: z.string().nullable().optional(),
  media_type: z.enum(["image", "video"]).nullable().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  published_at: z.string().datetime().nullable().optional(),
});

export type NewsWriteInput = z.infer<typeof newsWriteSchema>;

export function toNewsRow(input: NewsWriteInput, authorId: string, departmentId: string | null) {
  const title = (input.title ?? input.headline).trim();
  const isPublished = input.is_published ?? false;
  const publishedAt = isPublished
    ? input.published_at ?? new Date().toISOString()
    : input.published_at ?? null;

  return {
    title,
    summary: input.summary?.trim() || null,
    content: input.content,
    cover_image_url: input.cover_image_url?.trim() || null,
    media_url: input.media_url?.trim() || null,
    media_type: input.media_type ?? null,
    is_published: isPublished,
    is_featured: input.is_featured ?? false,
    author_id: authorId,
    department_id: departmentId,
    published_at: publishedAt,
  };
}
