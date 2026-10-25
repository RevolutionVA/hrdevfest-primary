# Hampton Roads DevFest

A tech conference website showcasing local speakers and celebrating the Hampton Roads developer community.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server at http://localhost:4321
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## 📁 Project Structure

```
/
├── public/                      # Static assets (PDFs, favicons)
├── src/
│   ├── assets/                  # Images (logo, sponsors, speakers)
│   ├── components/              # Shared components
│   ├── content/                 # Content collections
│   │   └── events/              # Year-specific event data
│   │       ├── 2024/event.json  # 2024 event data
│   │       └── 2026/event.json  # 2026 event data
│   ├── data/                    # Legacy data files (still used by homepage)
│   ├── pages/                   # Page routes
│   │   ├── index.astro          # Homepage (2027 teaser)
│   │   ├── 2024/index.astro     # 2024 year page
│   │   ├── 2026/index.astro     # 2026 year page
│   │   └── archive/[year].astro # Archive years placeholder
│   ├── styles/                  # Global styles
│   └── themes/                  # Per-year themes
│       ├── 2024/                # 2024 theme
│       │   └── layouts/         # 2024 layout components
│       ├── 2026/                # 2026 theme  
│       │   └── layouts/         # 2026 layout components
│       ├── archive/             # Archive theme (2016-2023)
│       │   └── layouts/         # Archive layout components
│       ├── shared/              # Shared components across themes
│       └── config.ts            # Theme configuration
├── astro.config.mjs             # Astro config with redirects
└── tailwind.config.mjs
```

## 🛠 Tech Stack

- **Astro 5.6.1** - Static site generator
- **TypeScript** - Type checking enabled
- **Tailwind CSS** - Utility-first styling
- **Yarn** - Package manager (v1.22.22)

## 🔗 Integrations

- **Tito** - Ticket sales widget
- **Sessionize** - Speaker/session management
- **Google Maps** - Venue location
- **ActiveHosted** - Newsletter signup

## 🎨 Adding a New Year or Theme

### Adding a New Event Year

1. **Create event data**: Add a new folder in `src/content/events/` with an `event.json` file:
   ```
   src/content/events/2028/event.json
   ```
   
   Use the existing `2024/event.json` or `2026/event.json` as a template. The schema is defined in `src/content/config.ts`.

2. **Choose or create a theme**: Either reuse an existing theme or create a new one in `src/themes/`.

3. **Create the year page**: Add a new page in `src/pages/`:
   ```
   src/pages/2028/index.astro
   ```
   
   Import the appropriate theme layout and content:
   ```astro
   ---
   import { getEntry } from 'astro:content';
   import YearLayout from "../../themes/2028/layouts/YearLayout.astro";
   
   const event = await getEntry('events', '2028/event');
   const eventData = event.data;
   ---
   
   <YearLayout title={eventData.title}>
     <!-- Your content here -->
   </YearLayout>
   ```

4. **Update navigation**: Add links to the new year in the shared navigation components.

### Creating a New Theme

1. Create a new folder under `src/themes/`:
   ```
   src/themes/2028/
   ├── layouts/
   │   └── YearLayout.astro
   └── components/   # Optional theme-specific components
   ```

2. Create a layout that extends or wraps base functionality:
   - Import shared components from `src/themes/shared/`
   - Add theme-specific CSS with a scoped class (e.g., `.theme-2028`)
   - Define CSS custom properties for theme colors

3. Update `src/themes/config.ts` to register the new theme.

### Archive Years (2016-2023)

Archive years use a minimal shared theme at `src/themes/archive/`. These pages are placeholders until Kevin provides the historical data. Once data is available:

1. Add event data in `src/content/events/{year}/event.json`
2. The archive pages will automatically use the data

## 🏗 Development

The site features:
- Sticky navigation that appears on scroll
- Optimized images via Astro's Image component
- Redirects configured in `astro.config.mjs`
- All speakers are local to Hampton Roads (key differentiator)

### Important Commands

```bash
# Type checking (run after changes)
yarn astro check

# Full build with type checking
yarn build
```

## 📝 Contributing

Before submitting changes:
1. Run `yarn build` to ensure TypeScript checks pass
2. Use the main branch for pull requests
3. Import and use Astro's Image component for all images

## 🌐 Links

- [Live Site](https://hrdevfest.com)
- [Sponsor Prospectus](https://hrdevfest.org/prospectus)
