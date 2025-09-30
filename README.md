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
├── public/          # Static assets
├── src/
│   ├── assets/      # Images (logo, sponsors)
│   └── pages/       # Page routes
│       ├── index.astro    # Landing page
│       └── schedule.astro # Conference schedule
├── astro.config.mjs # Astro config with redirects
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
- [Sponsor Prospectus](https://hrdevfest.com/prospectus)
