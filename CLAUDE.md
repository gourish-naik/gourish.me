# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

There are no tests in this project.

Format code with Prettier (configured in `.prettierrc`):
```bash
npx prettier --write .
```

## Architecture

Personal portfolio site for Gourishankar Menavath, built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui.

### Blog (Hygraph CMS)

`/app/blogs/` is the canonical blog route, backed by **Hygraph CMS** via GraphQL (`lib/blog-data.ts`).

- Reads use the CDN URL (`HYGRAPH_API_URL`) with Next.js ISR (`next: { revalidate: 3600, tags: ['blog'] }`) wired at the fetch level in the `GraphQLClient` constructor
- Writes (blog admin) use the direct API URL (`HYGRAPH_WRITE_URL`)
- Cache is busted via `revalidateTag('blog')` — triggered by the Hygraph webhook POST to `/api/revalidate?secret=REVALIDATE_SECRET`
- `/app/blog/` (old local MDX route) now 301-redirects to `/blogs/` via `next.config.ts`

### Blog Admin (`/admin`)

Password-gated at `ADMIN_PASSWORD`. Flow: cookie session (8h) → blog form → Hygraph `createBlogPost` + `publishBlogPost` mutations → `revalidateTag('blog')`.

Content is written as **HTML** in the textarea (Hygraph stores RichText, accepts `{ html: "..." }` on input). If the mutation fails, the raw Hygraph error is shown in the UI — check it against your Hygraph schema if field names differ.

### Environment Variables

| Variable | Purpose |
|---|---|
| `HYGRAPH_API_URL` | CDN read endpoint (ISR cache) |
| `HYGRAPH_WRITE_URL` | Direct write endpoint for mutations |
| `HYGRAPH_API_TOKEN` | PAT with read + write permissions |
| `REVALIDATE_SECRET` | Must match `?secret=` in Hygraph webhook URL |
| `RESEND_API_KEY` | Resend transactional email (contact form) |
| `FROM_EMAIL` | Sender identity for Resend |
| `BCC_EMAIL` | Recipient for contact form emails |
| `ADMIN_PASSWORD` | `/admin` password gate |
| `HYGRAPH_AUTHOR_ID` | ID of your Hygraph Author record — required for blog mutations (author field is required on BlogPost schema) |
| `NEXT_PUBLIC_SHOW_BLOG` | Set to `'false'` to hide blog from nav/home |
| `NEXT_PUBLIC_SHOW_RESUME` | Set to `'false'` to hide resume download |
| `NEXT_PUBLIC_SHOW_SERVICES` | Set to `'false'` to hide Services nav link |

Feature flags live in `lib/site-config.ts` and are consumed by `components/header.tsx` and `app/touch/page.tsx`.

### File-based Content (Projects & Work)

- `content/projects/*.mdx` — project entries, read by `lib/projects.ts`
- `content/work/*.mdx` — work experience entries, read by `lib/work.ts`

Work entries are filtered by `metadata.self === 'company'` — only entries with this field set are shown on the `/work` page. Work entries are grouped by `metadata.company`. See `content/work/template.mdx` for frontmatter shape.

Projects frontmatter shape: `title`, `summary`, `image`, `timePeriod` (used for sort order), `slug` (derived from filename). See `content/projects/template.mdx`.

### i18n (next-intl)

Locale is stored in the `INEXT_LOCALE` **cookie** (not URL prefix). The `LanguageSwitcher` component writes this cookie and calls `router.refresh()`. Supported locales: `en`, `hi`, `te`, `ro`, `ar`, `fr` — JSON files live in `locales/`. The `i18n/request.ts` reads the cookie server-side on each request.

### Theme

Dark/light mode via `next-themes`. The `Providers` component wraps the app with `ThemeProvider` using `attribute="class"` and `defaultTheme="system"`.

### Styling Conventions

- Tailwind CSS v4 (PostCSS-based config, not JS config)
- Prettier with `prettier-plugin-tailwindcss` — always run Prettier to sort Tailwind classes
- `cn()` from `lib/utils.ts` combines `clsx` + `tailwind-merge` for conditional/conflicting classes
- Two font variables: `--font-sans` (Inter) and `--font-serif` (Playfair Display)

### Key Patterns

- `app/projects/actions.ts` uses `'use server'` to expose `fetchProjects` for client-side pagination
- Remote images from `ap-south-1.graphassets.com` (Hygraph) are allowlisted in `next.config.ts`
- MDX content is rendered via `components/mdx-content.tsx` using `next-mdx-remote`
- shadcn/ui components live under `components/ui/` (generated via `components.json`)
