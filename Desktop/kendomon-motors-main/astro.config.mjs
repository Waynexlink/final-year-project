import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import purgecss from "astro-purgecss"; // ✅ ADD THIS LINE

export default defineConfig({
  site: "https://kendomonmotors.com", // update me!
  integrations: [
    react(),
    icon(),
    sitemap({
      filter: (page) => !page.includes("/admin"),
      changefreq: "weekly",
      priority: 0.7,
    }),
    // ✅ ADD PURGECSS HERE
    purgecss({
      content: ["./src/**/*.astro", "./src/**/*.js", "./src/**/*.jsx"],
      // Keep classes that are added dynamically by JavaScript
      safelist: [
        "cs-active",
        "cs-open",
        "thumbnail-active", // from your gallery.js
        "astro-*", // preserve Astro's classes
      ],
    }),
  ],
  vite: {
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
});
