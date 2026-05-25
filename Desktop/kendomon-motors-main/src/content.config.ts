import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Blog collection
const blogsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      date: z.date(),
      image: image(),
      imageAlt: z.string(),
      isFeatured: z.boolean().optional().default(false),
    }),
});

// Cars collection
const carsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/cars" }),
  schema: ({ image }) =>
    z.object({
      // basic identity
      make: z.string(),
      model: z.string(),
      year: z
        .number()
        .int()
        .min(1900)
        .max(new Date().getFullYear() + 1),
      price: z.number().positive(),

      // specs (removed mileage, fuelType, engineSize)
      transmission: z.enum(["Automatic", "Manual"]),
      description: z.string().optional(),

      // images
      heroImage: image(),
      heroImageAlt: z.string().optional(),
      galleryImages: z.array(image()).max(10).optional(),

      // conditions
      condition: z
        .enum(["Locally Used", "Foreign Used"])
        .optional()
        .default("Foreign Used"),
      location: z.string().optional(),
      featured: z.boolean().optional().default(false),

      // publishing metadata
      publishDate: z
        .date()
        .optional()
        .default(() => new Date()),
    }),
});

// Export collections
export const collections = {
  blog: blogsCollection,
  cars: carsCollection,
};
