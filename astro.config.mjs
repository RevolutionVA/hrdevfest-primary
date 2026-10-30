import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://hrdevfest.org",
  integrations: [sitemap({ filter: (page) => !page.includes("/sponsor/print") })],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['host.docker.internal'],
    },
  },
  redirects: {
    "/prospectus": {
      status: 302,
      destination: "/2026/HRDevFest_Sponsorship Prospectus_min.pdf",
    },
    "/coc": {
      status: 302,
      destination: "/code-of-conduct",
    },
    "/parking": {
      status: 302,
      destination: "/2026/Town Center Parking Guide.pdf",
    },
    "/speakers": {
      status: 302,
      destination: "/2026",
    },
    "/schedule": {
      status: 302,
      destination: "/2026",
    },
    "/years/2024": {
      status: 301,
      destination: "/2024",
    },
    "/years/2024/schedule": {
      status: 301,
      destination: "/2024",
    },
    "/years/2025": {
      status: 301,
      destination: "/2024",
    },
    "/years/2026": {
      status: 301,
      destination: "/2026",
    },
  },
});
