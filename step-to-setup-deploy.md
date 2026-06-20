# Setup & Deployment Guide — igourish.in

Follow these steps in order after cloning the repo or picking up from a fresh machine.

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Create `.env.local`

Create the file at the project root. It is already gitignored.

```env
HYGRAPH_API_URL=https://ap-south-1.cdn.hygraph.com/content/clzpdgisk026z07w2muz96lxy/master
HYGRAPH_WRITE_URL=https://api-ap-south-1.hygraph.com/v2/clzpdgisk026z07w2muz96lxy/master
HYGRAPH_API_TOKEN=<your Hygraph PAT>

RESEND_API_KEY=<your Resend API key>
FROM_EMAIL=gourishankar <igourish@igourish.in>
BCC_EMAIL=m.gourishankarnaik@gmail.com

REVALIDATE_SECRET=clzpdgisk026z07w2muz96lxy
ADMIN_PASSWORD=<choose a strong password>

NEXT_PUBLIC_SHOW_BLOG=true
NEXT_PUBLIC_SHOW_RESUME=true
NEXT_PUBLIC_SHOW_SERVICES=true
```

> All current values are stored in the private `.env.local` file in the repo root.
> Never commit this file — `.gitignore` already excludes `.env*`.

---

## 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Key local routes to verify:

| Route | What to check |
|---|---|
| `/` | Hero copy, "Available for freelance" green dot, 3 project cards |
| `/projects` | Al Fakher, MARINA Homes, Channelbay case studies |
| `/services` | 3 package cards (Audit / Build / Retainer), CTA links to /touch |
| `/work` | Work experience grouped by company |
| `/blogs` | Blog listing from Hygraph (needs `HYGRAPH_API_URL` + token) |
| `/touch` | Contact form + resume download |
| `/admin` | Password gate → blog creation form |

---

## 4. Add env vars to Vercel

Every variable in `.env.local` must also be set in Vercel or the production build will break.

1. Go to [vercel.com](https://vercel.com) → your project → **Settings** → **Environment Variables**
2. Add each variable below. Set scope to **Production + Preview + Development**.

| Variable | Notes |
|---|---|
| `HYGRAPH_API_URL` | CDN read endpoint |
| `HYGRAPH_WRITE_URL` | Direct write endpoint — required for `/admin` blog publishing |
| `HYGRAPH_API_TOKEN` | Hygraph PAT (needs read + write/publish permissions) |
| `RESEND_API_KEY` | Resend key — required for contact form |
| `FROM_EMAIL` | Sender identity (must be a verified domain in Resend) |
| `BCC_EMAIL` | Where contact form emails land |
| `REVALIDATE_SECRET` | Must exactly match the `?secret=` value in your Hygraph webhook URL |
| `ADMIN_PASSWORD` | Password for `/admin` — keep this private |
| `HYGRAPH_AUTHOR_ID` | Your Hygraph Author record ID — see step 7 below |
| `NEXT_PUBLIC_SHOW_BLOG` | `true` or `false` — controls blog link in nav |
| `NEXT_PUBLIC_SHOW_RESUME` | `true` or `false` — controls resume download button on /touch |
| `NEXT_PUBLIC_SHOW_SERVICES` | `true` or `false` — controls Services link in nav |

3. After adding all variables, **redeploy** (Vercel → Deployments → Redeploy latest).

---

## 5. Verify Resend sender domain

The `FROM_EMAIL` uses `igourish@igourish.in`. For Resend to send from this address:

1. Go to [resend.com](https://resend.com) → **Domains**
2. Confirm `igourish.in` is verified (DNS records added and checked)
3. If not set up: Add the domain → copy the DNS records Resend gives you → add them in your domain registrar's DNS settings → wait for verification

---

## 6. Wire the Hygraph webhook (cache revalidation)

This makes new/updated blog posts appear on the site instantly without waiting for the 1-hour ISR window.

1. Go to [app.hygraph.com](https://app.hygraph.com) → your project
2. **Settings** → **Webhooks** → **+ Add Webhook**
3. Fill in:

   | Field | Value |
   |---|---|
   | Name | `Revalidate Blog Cache` |
   | URL | `https://igourish.in/api/revalidate?secret=clzpdgisk026z07w2muz96lxy` |
   | Method | `POST` |
   | Content Type | `application/json` |

4. Under **Triggers** → select `BlogPost` model → tick `Publish`, `Unpublish`, `Update`, `Delete`
5. Click **Save**

> **To test it locally:** Temporarily change the URL to your ngrok/localtunnel URL pointing to `localhost:3000/api/revalidate?secret=clzpdgisk026z07w2muz96lxy`, publish a post in Hygraph, check your terminal for the POST request.

---

## 7. Verify Hygraph token permissions

The `/admin` blog form uses `createBlogPost` and `publishBlogPost` mutations. These require the API token to have **write** permissions.

1. Go to [app.hygraph.com](https://app.hygraph.com) → **Settings** → **API Access** → **Permanent Auth Tokens**
2. Find the token matching `HYGRAPH_API_TOKEN`
3. Confirm it has **Content API: Mutations** enabled (not read-only)
4. If the token is read-only, create a new one with mutation permissions and update the env var

### Find your Author ID (`HYGRAPH_AUTHOR_ID`)

The `/admin` blog form connects new posts to your existing Hygraph Author record. You need to supply its ID:

1. Hygraph → **Content** → **Author** → click your entry
2. Look at the browser URL: `.../content/author/edit/<ID>`
3. Copy the `<ID>` value
4. Paste it as `HYGRAPH_AUTHOR_ID` in `.env.local` **and** in Vercel env vars

> Since `author` is a required field on your `BlogPost` schema, the mutation will fail with a Hygraph error if this env var is missing or wrong. The admin form will surface the exact error message so you can debug.

### Check if `author` is required on BlogPost

The admin form currently skips the `author` field. If your Hygraph schema marks it as required, publishing will fail with a schema error.

1. In Hygraph → **Schema** → **BlogPost** model
2. Check the `author` field — if it has a red asterisk (*) it is required
3. If required: tell Claude Code and the author field will be added to the admin form

---

## 8. Add resume PDF

The resume download button on `/touch` points to `/Gourishankar_FE_dev.pdf`.

The file has already been copied to `public/Gourishankar_FE_dev.pdf`.

To update it later: replace the file at the same path. No code change needed.

---

## 9. Add project images

Case study cards on the home page and `/projects` show images from frontmatter.
The current case studies reference these paths (which don't exist yet):

| File | Path in frontmatter |
|---|---|
| Al Fakher | `/images/projects/al-fakher.jpg` |
| MARINA Homes | `/images/projects/marina-homes.jpg` |
| Channelbay | `/images/projects/channelbay.jpg` |

To add them:
1. Create `public/images/projects/` directory
2. Drop screenshots/thumbnails with the matching filenames
3. Cards will automatically show the images — no code change needed

---

## 10. Writing a blog post (two ways)

### Option A — Via `/admin` (in-site, no Hygraph dashboard needed)

1. Go to `https://igourish.in/admin`
2. Enter `ADMIN_PASSWORD`
3. Fill in: title (slug auto-fills), summary, tags, date, HTML content
4. Click **Publish post**
5. Post is created + published in Hygraph, cache is busted, live immediately

Write content as HTML in the textarea:
```html
<p>Your intro paragraph.</p>

<h2>Section heading</h2>
<p>Content here.</p>

<pre><code>// code block
const x = 1</code></pre>
```

### Option B — Via Hygraph dashboard

1. Go to [app.hygraph.com](https://app.hygraph.com) → your project → **Content** → **BlogPost** → **+ Add entry**
2. Fill in fields using the rich text editor
3. Click **Publish**
4. Webhook fires → cache clears → post is live within seconds

---

## 11. Feature flags (show/hide sections)

Control what's visible on the site without code changes — just update env vars in Vercel and redeploy.

| What to hide | Env var to set |
|---|---|
| Blog link in nav | `NEXT_PUBLIC_SHOW_BLOG=false` |
| Services link in nav | `NEXT_PUBLIC_SHOW_SERVICES=false` |
| Resume download on /touch | `NEXT_PUBLIC_SHOW_RESUME=false` |

---

## 12. Deploy

```bash
git add .
git commit -m "your message"
git push origin new-release
```

Then open a PR from `new-release` → `prod` in GitHub. Vercel auto-deploys on merge to `prod`.

Or trigger a manual deploy from the Vercel dashboard.

---

## Quick reference — what lives where

| Thing | Location |
|---|---|
| Project case studies | `content/projects/*.mdx` |
| Work experience entries | `content/work/*.mdx` |
| Hero / nav copy (EN) | `locales/en.json` |
| All translated copy | `locales/<lang>.json` |
| Feature flags | `lib/site-config.ts` + env vars |
| Blog data (read) | `lib/blog-data.ts` → Hygraph CDN |
| Blog admin (write) | `app/admin/` → Hygraph write API |
| Contact form email | `app/touch/actions.ts` → Resend |
| Cache bust endpoint | `app/api/revalidate/route.ts` |
| Sitemap | `app/sitemap.ts` (includes blog slugs from Hygraph) |
