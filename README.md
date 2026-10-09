# LVI-Loisto Oy website

Astro-based website for LVI-Loisto Oy. The site is deployed from `main` through
Cloudflare Pages, and editable page content is managed with Pages CMS.

Read `PROJECT_CONTEXT.md` before continuing development on a new computer or in
a new Codex conversation.

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

## Pages CMS

The CMS configuration is stored in `.pages.yml`. Editable content is stored as
JSON in `src/content/cms/` and is imported by the Astro pages.

Open the editor at:

`https://app.pagescms.org/laurihannelin-seo/lviloisto/main/file/home`

CMS saves are committed to `main`, so run `git pull origin main` before starting
local development after anyone has edited content in the CMS.

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
