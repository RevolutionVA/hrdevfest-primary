import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://hrdevfest.org",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['host.docker.internal'],
    },
  },
  redirects: {
    "/prospectus": {
      status: 302, // Use 301 for permanent redirects
      destination: "/2026/HRDevFest_Sponsorship Prospectus_min.pdf",
    },
    "/years/2025": {
      status: 302,
      destination: "/years/2024",
    },
  },
});
