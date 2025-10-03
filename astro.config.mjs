import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  redirects: {
    "/prospectus": {
      status: 302, // Use 301 for permanent redirects
      destination:
        "https://drive.google.com/file/d/1Pt1AwixVbP1C9HceFoaE28HB6f2MbH3P/view",
    },
    "/years/2025": {
      status: 302,
      destination: "/years/2024",
    },
  },
});
