# Portfolio Redesign Plan — igourish.in
**Goal:** Reposition from generic "frontend developer" portfolio → "React/Next.js/Magento PWA Studio E-commerce Consultant" site that converts freelance leads.

---

## Design References (study these, don't clone)

| Site | What to borrow |
|---|---|
| [brittanychiang.com](https://brittanychiang.com) | Single-page scroll structure, project cards with tech-stack tags, dark theme that still feels professional, strong "About → Experience → Projects" flow |
| [leerob.io](https://leerob.io) | Minimal hero (one line, no fluff), blog tightly integrated with main nav, fast/clean Next.js build — good model since you already have a blog |
| [rauno.me](https://rauno.me) | Reference for craft/polish — subtle micro-interactions, typography rhythm. Don't copy the heavy animation, just the *attention to detail* standard |
| [adhamdannaway.com](https://adhamdannaway.com) | Closest direct analog — freelance frontend consultant positioning, services laid out plainly, case-study style project pages |
| [joshwcomeau.com](https://joshwcomeau.com) | How to make a blog feel authoritative, not like a generic dev-blog — good reference for your "Magento PWA Studio performance" posts |
| [simonpan.com](https://simonpan.com) | Case-study structure: problem → constraints → decisions → outcome → "what I'd do differently." Apply this template to your Al Fakher/MARINA writeups |

**Common pattern across all of them:** specific one-line positioning in the hero, 3–6 flagship projects max (not a long list), outcome-focused captions, easy-to-find contact/CTA, no placeholder content ever.

---

## Phase 0 — Critical Cleanup (do first, same day)
- [ ] Remove the "Project Title / brief one-liner" template project entirely
- [ ] Remove or replace "Introduction to MDX" tutorial project (not relevant to consultant positioning)
- [ ] Fix "Invalid Date" bug on project cards (date formatting issue in MDX/project data)
- [ ] Fix footer typo: "Githib" → "GitHub"
- [ ] Update footer "© rxsolutions" → "© Gourishankar Menavath" or remove entirely
- [ ] Verify GitHub link (github.com/gourish-naik) has pinned, real repos — not empty

---

## Phase 1 — Positioning & Copy Rewrite
- [ ] Rewrite hero headline. Replace generic intro with:
  > "I help e-commerce brands build fast, scalable storefronts with React, Next.js & Magento PWA Studio."
  > "4+ years shipping production frontends for global e-commerce brands."
- [ ] Rewrite About section: lead with e-commerce/PWA Studio specialization, not generic "passionate developer" language
- [ ] Update meta title/description/OG tags to match new positioning (currently says "3+ years" — update to 4+)
- [ ] Add a short "Available for freelance projects" status line near hero (with link to Services/Contact)

---

## Phase 2 — Information Architecture
- [ ] Add new **Services** page with 3 packages:
  - Audit (Core Web Vitals + UX review, fixed fee, 1–2 weeks)
  - Build/Migration (new PWA Studio or Next.js headless storefront)
  - Retainer (ongoing frontend dev + performance maintenance)
- [ ] Add clear CTA on Services page (contact form / Calendly link)
- [ ] Restructure Projects page into **Case Studies**:
  - Al Fakher (OOKA, SouthSmoke) — multi-brand Next.js monorepo, Core Web Vitals work
  - MARINA Homes — Magento PWA Studio theming
  - Channelbay — Shopify-integrated inventory platform
  - Use template: Problem → Role → Tech Stack → Decisions → Outcome (with real numbers where possible)
- [ ] Limit homepage to 3–4 flagship case studies max; move rest to "All Projects" archive

---

## Phase 3 — Visual Design System
- [ ] Define consistent type scale (headings, body, captions) — pick 2 fonts max
- [ ] Define color system (currently unclear — pick a primary accent + neutral palette, support dark mode)
- [ ] Standardize project card design (image/thumbnail, tags, one-line outcome, consistent spacing)
- [ ] Add subtle micro-interactions on hover (project cards, nav links) — keep performance-friendly, no heavy animation libraries unless justified
- [ ] Ensure consistent spacing/grid system across Home, Projects, Blog, Contact

---

## Phase 4 — Content to Add
- [ ] Write 2 case studies using the Phase 2 template (Al Fakher + MARINA Homes minimum)
- [ ] Write 1–2 blog posts targeting niche SEO:
  - "How I optimized Core Web Vitals across 6 storefronts in a single Next.js monorepo"
  - "Magento PWA Studio vs Next.js headless: when to choose which"
- [ ] Add testimonials section (even 2–3 short quotes from past managers/clients)
- [ ] Add resume/CV download link (use the rewritten version, not the old one)

---

## Phase 5 — Technical & Performance Check
- [ ] Run Lighthouse audit — target 90+ on Performance, Accessibility, SEO
- [ ] Verify all images use Next.js `<Image>` with proper sizing (avoid layout shift)
- [ ] Check mobile responsiveness on all pages (Home, Projects, Blog, Contact)
- [ ] Verify OG/meta tags render correctly when site is shared (test via opengraph.xyz or similar)
- [ ] Add sitemap.xml + robots.txt if not already present (helps blog SEO strategy)

---

## Phase 6 — Final Polish
- [ ] Proofread all copy for typos/grammar
- [ ] Test contact form / mailto link works correctly
- [ ] Cross-browser check (Chrome, Safari, Firefox)
- [ ] Deploy and do a final click-through as if you're a prospective client landing from Upwork/LinkedIn
