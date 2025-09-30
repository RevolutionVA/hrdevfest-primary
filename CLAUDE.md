# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hampton Roads DevFest is an Astro-based static website for a local developer conference. It showcases local speakers and highlights the tech community in the Hampton Roads area of Virginia.

## Key Technologies

- **Astro 5.6.1** - Static site generator
- **TypeScript** - Type checking enabled
- **Tailwind CSS** - Utility-first CSS framework
- **Package Manager**: Yarn (v1.22.22)

## Common Development Commands

```bash
# Install dependencies
yarn install

# Run development server (http://localhost:4321)
yarn dev

# Build for production - includes type checking
yarn build

# Preview production build
yarn preview

# Run Astro type checking
yarn astro check
```

## Project Structure

- `/src/pages/` - Astro page components (routes)
  - `index.astro` - Main landing page with conference info, speakers, sponsors
  - `schedule.astro` - Conference schedule page
- `/src/assets/` - Images including logo and sponsor logos
- `/public/` - Static assets served directly
- `astro.config.mjs` - Astro configuration with Tailwind integration and redirects
- `tailwind.config.mjs` - Tailwind CSS configuration

## Important Implementation Details

- The site uses Astro's Image component for optimized image loading
- External integrations include:
  - Tito widget for ticket sales
  - Sessionize for speaker/session management
  - Google Maps embed for venue location
  - ActiveHosted form for newsletter signup
- Redirects are configured in `astro.config.mjs` (e.g., `/prospectus` redirects to Google Drive)
- The site has a sticky navigation bar that appears on scroll
- All speakers are local to Hampton Roads (key differentiator)

## Before Making Changes

- Always run `yarn build` after making changes to ensure TypeScript checks pass
- The main branch is typically used for pull requests
- Images should be imported and used with Astro's Image component for optimization