import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
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
