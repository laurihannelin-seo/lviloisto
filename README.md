# LVI-Loisto Oy website

Technical foundation for the future LVI-Loisto Oy website.

This project is intentionally minimal: Astro, one homepage, global styles, and a structure that can grow later. CMS/editor tooling is not installed yet.

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the production site:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Cloudflare Pages

Use these settings when connecting the GitHub repository to Cloudflare Pages:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

The current `lviloisto.fi` domain remains on the existing platform for now. This Astro site should first be deployed to a Cloudflare Pages preview/staging URL.

## Branch workflow

- `main` = production later
- `staging` = client preview later
- feature branches = individual Codex edits

## Future steps

Good next additions, once the foundation is accepted:

- Finalize homepage content and visual direction.
- Add service pages and contact flow.
- Decide whether TinaCMS or another editor is needed.
- Configure analytics, redirects, and custom domain only when the new site is ready to launch.
