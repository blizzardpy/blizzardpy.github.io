# Backend Command Center Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the static portfolio into the approved Backend Command Center experience.

**Architecture:** Keep the site as a static GitHub Pages project. Move styling and behavior out of inline blocks in `index.html` and into `styles.css` and `script.js`, with small JavaScript data structures driving dynamic dashboard and command interactions.

**Tech Stack:** HTML, CSS, vanilla JavaScript, GitHub Pages, Node.js for a dependency-free static verification script.

---

## Starting Context

Repository root: `/Users/amirkiankiani/Developer/blizzardpy.github.io`

Existing files:

- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`
- Keep: `CNAME`
- Keep: `src/Amirkian-Resume.pdf`
- Keep/use: `src/images/profile-image.jpeg`
- Keep/use: `src/images/Gin Framework.svg`
- Keep/use: `src/images/celery--logo.svg`
- Keep/use: `src/images/icons8-ffmpeg.svg`
- Keep/use: `src/images/icons8-chatgpt.svg`
- Create: `scripts/verify-static-site.mjs`

Do not add a framework or build step.

## Task 1: Add Static Verification Script

**Files:**
- Create: `scripts/verify-static-site.mjs`

**Step 1: Create a failing verifier**

Create `scripts/verify-static-site.mjs`:

```js
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const failures = [];

const localReferencePattern = /\b(?:src|href)=["']([^"']+)["']/g;
const idPattern = /\bid=["']([^"']+)["']/g;
const blankAnchorPattern = /<a\b[^>]*target=["']_blank["'][^>]*>/g;

const ids = new Set([...html.matchAll(idPattern)].map((match) => match[1]));

function isExternalReference(value) {
  return /^(https?:)?\/\//.test(value) ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('data:');
}

function stripFragmentAndQuery(value) {
  return value.split('#')[0].split('?')[0];
}

for (const match of html.matchAll(localReferencePattern)) {
  const reference = match[1];

  if (reference.startsWith('#')) {
    const id = reference.slice(1);
    if (id && !ids.has(id)) {
      failures.push(`Missing anchor target: ${reference}`);
    }
    continue;
  }

  if (isExternalReference(reference)) {
    continue;
  }

  const localPath = stripFragmentAndQuery(reference);
  if (!localPath) {
    continue;
  }

  const resolvedPath = join(root, decodeURIComponent(localPath));
  if (!existsSync(resolvedPath)) {
    failures.push(`Missing local asset: ${reference}`);
  }
}

for (const match of html.matchAll(blankAnchorPattern)) {
  const anchor = match[0];
  const relMatch = anchor.match(/\brel=["']([^"']+)["']/);
  const relValues = new Set((relMatch?.[1] ?? '').split(/\s+/).filter(Boolean));

  if (!relValues.has('noopener') || !relValues.has('noreferrer')) {
    failures.push(`External blank link missing rel safety: ${anchor}`);
  }
}

if (failures.length > 0) {
  console.error('Static site verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Static site verification passed.');
```

**Step 2: Run verifier to capture current failures**

Run:

```bash
node scripts/verify-static-site.mjs
```

Expected: FAIL because the current page has `target="_blank"` links without `rel="noopener noreferrer"`.

**Step 3: Commit**

```bash
git add scripts/verify-static-site.mjs
git commit -m "test: add static site verifier"
```

## Task 2: Rebuild Semantic HTML Shell

**Files:**
- Modify: `index.html`

**Step 1: Replace inline styling and scripts**

Remove the large inline `<style>` and inline `<script>` blocks from `index.html`.

Keep these external dependencies in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="styles.css">
```

Place this before `</body>`:

```html
<script src="script.js"></script>
```

**Step 2: Create the required section skeleton**

Use these top-level landmarks and IDs:

```html
<header class="site-header" data-header>...</header>
<main>
  <section id="hero" class="hero section-observed">...</section>
  <section id="about" class="section section-observed">...</section>
  <section id="skills" class="section section-observed">...</section>
  <section id="projects" class="section section-observed">...</section>
  <section id="experience" class="section section-observed">...</section>
  <section id="contact" class="section section-observed">...</section>
</main>
<footer class="site-footer">...</footer>
```

Keep existing content, but rewrite labels around the command-center concept:

- About becomes "Engineer Profile".
- Skills becomes "Infrastructure Map".
- Projects becomes "Service Registry".
- Experience becomes "Deployment Timeline".
- Contact becomes "Open Connection".

**Step 3: Add safe external link attributes**

Every external link with `target="_blank"` must include:

```html
rel="noopener noreferrer"
```

**Step 4: Run verifier**

Run:

```bash
node scripts/verify-static-site.mjs
```

Expected: PASS once all local assets exist and all blank links are safe.

**Step 5: Commit**

```bash
git add index.html
git commit -m "refactor: rebuild portfolio markup"
```

## Task 3: Add Design Tokens And Base Layout

**Files:**
- Modify: `styles.css`

**Step 1: Replace old stylesheet with command-center foundation**

Define tokens at the top of `styles.css`:

```css
:root {
  --bg: #06080b;
  --panel: #0d1218;
  --panel-strong: #121922;
  --line: rgba(196, 211, 228, 0.16);
  --line-strong: rgba(196, 211, 228, 0.28);
  --text: #f5f7fb;
  --muted: #aab4c0;
  --quiet: #748092;
  --cyan: #3ddcff;
  --green: #4ade80;
  --amber: #f6c453;
  --red: #ff6b6b;
  --warm: #ff8f5a;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  --radius: 8px;
  --radius-sm: 6px;
  color-scheme: dark;
}
```

Add resets, body styles, link styles, `.mono`, `.section`, `.section-kicker`, `.section-heading`, `.panel`, `.status-pill`, and `.metric` primitives.

**Step 2: Implement header**

Style `.site-header`, `.nav-shell`, `.brand`, `.nav-links`, `.nav-action`, and mobile wrapping. Header should be fixed or sticky, compact, and readable.

**Step 3: Verify manually**

Run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

Expected: page renders with dark base, readable text, and no horizontal overflow.

**Step 4: Commit**

```bash
git add styles.css
git commit -m "style: add command center foundation"
```

## Task 4: Implement Hero And Ops Dashboard

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Step 1: Build hero markup**

Hero must include:

- `.hero-copy` with role, H1, summary, and CTAs.
- `.command-terminal` with buttons using `data-command`.
- `.ops-dashboard` with status cards, event log container, architecture nodes, and profile image.

Use command buttons:

```html
<button class="command-chip" type="button" data-command="whoami">whoami</button>
<button class="command-chip" type="button" data-command="stack">stack</button>
<button class="command-chip" type="button" data-command="projects">projects</button>
<button class="command-chip" type="button" data-command="contact">contact</button>
```

**Step 2: Style hero and dashboard**

Add responsive styles for:

- `.hero`
- `.hero-layout`
- `.hero-copy`
- `.hero-actions`
- `.command-terminal`
- `.command-output`
- `.ops-dashboard`
- `.status-grid`
- `.event-log`
- `.architecture-map`
- `.profile-node`

Desktop should feel like an operations cockpit. Mobile should stack copy first, dashboard second, with no overlapping text.

**Step 3: Manual visual check**

Open `http://localhost:8000`.

Expected:

- First viewport shows a clear portfolio identity.
- Dashboard is visible without hiding CTAs.
- Profile image is present but secondary to the dashboard visual.

**Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: add command center hero"
```

## Task 5: Redesign Content Sections

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Step 1: Engineer Profile**

Replace the old About card with compact profile panels:

- "Core focus"
- "Systems I build"
- "Working style"
- "Current signal"

**Step 2: Infrastructure Map**

Group existing skills under:

- Backend
- Data
- Infrastructure
- Frontend and Mobile
- AI and Media Tooling

Use local assets where present and remote devicon URLs where already used.

**Step 3: Service Registry**

Convert each project into a service-style card with:

- Project name.
- Short description.
- Domain tag.
- Role or contribution.
- Stack/area tag.
- External link.

**Step 4: Deployment Timeline**

Convert experience into timeline entries with:

- Role.
- Company.
- Date range.
- Location.
- 2-4 concise shipped-capability bullets.

**Step 5: Contact Channel**

Keep `id="contactForm"` and form fields `name`, `email`, `message`.

Add direct email, LinkedIn, GitHub, resume, and Buy Me a Coffee links with safe external attributes.

**Step 6: Run verifier and manual check**

Run:

```bash
node scripts/verify-static-site.mjs
```

Expected: PASS.

Open `http://localhost:8000`.

Expected: all sections are scannable and no repeated card grid feels generic.

**Step 7: Commit**

```bash
git add index.html styles.css
git commit -m "feat: redesign portfolio sections"
```

## Task 6: Implement JavaScript Interactions

**Files:**
- Modify: `script.js`

**Step 1: Replace old EmailJS-only script**

Remove the unused EmailJS implementation. The new script should provide:

- Command terminal responses.
- Command buttons that scroll to sections.
- Rotating dashboard metrics.
- Streaming event log messages.
- Scroll reveal classes.
- Active nav state.
- Contact `mailto:` fallback.

Use data structures like:

```js
const commandResponses = {
  whoami: {
    output: 'Senior Software Engineer focused on scalable backend systems, APIs, data flows, and production reliability.',
    target: '#about',
  },
  stack: {
    output: 'Python, Go, Django, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, Odoo, React, SwiftUI, Flutter, and AI tooling.',
    target: '#skills',
  },
  projects: {
    output: 'Opening service registry: streaming, media, social, travel, gaming, education, and publishing platforms.',
    target: '#projects',
  },
  contact: {
    output: 'Opening connection channel. Resume, GitHub, LinkedIn, and email are ready.',
    target: '#contact',
  },
};
```

**Step 2: Respect reduced motion**

Gate looping animations:

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Skip metric/event intervals when reduced motion is enabled.

**Step 3: Keep contact fallback**

On submit, validate fields, then open:

```js
mailto:amirkiankiani@gmail.com?subject=Portfolio%20Contact%20from%20...
```

Then reset the form.

**Step 4: Run verifier and manual interaction check**

Run:

```bash
node scripts/verify-static-site.mjs
```

Expected: PASS.

Manual checks:

- Click each command chip.
- Submit form with test values and confirm mail client link opens.
- Scroll and confirm active nav updates.

**Step 5: Commit**

```bash
git add script.js
git commit -m "feat: add command center interactions"
```

## Task 7: Responsive, Accessibility, And Polish Pass

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`

**Step 1: Mobile viewport check**

Check at widths:

- 390px
- 768px
- 1280px
- 1440px

Expected:

- No horizontal scrolling.
- Buttons do not truncate awkwardly.
- Dashboard panels stack cleanly.
- Timeline remains readable.
- Contact form fits the viewport.

**Step 2: Accessibility checks**

Confirm:

- All images have useful `alt`.
- Buttons have visible text or `aria-label`.
- Form labels are explicit or visually hidden.
- Focus states are visible.
- Color contrast is acceptable on dark backgrounds.

**Step 3: Reduced motion check**

Temporarily emulate reduced motion in browser devtools or OS settings.

Expected:

- No looping metric/event animations.
- Scroll reveal content remains visible.

**Step 4: Run verifier**

Run:

```bash
node scripts/verify-static-site.mjs
```

Expected: PASS.

**Step 5: Commit**

```bash
git add index.html styles.css script.js
git commit -m "polish: improve responsive accessibility"
```

## Task 8: Final Verification

**Files:**
- Read: `index.html`
- Read: `styles.css`
- Read: `script.js`
- Read: `docs/plans/2026-06-28-backend-command-center-redesign-design.md`

**Step 1: Run static verifier**

```bash
node scripts/verify-static-site.mjs
```

Expected: PASS.

**Step 2: Serve locally**

```bash
python3 -m http.server 8000
```

Expected: server starts on `http://localhost:8000`.

**Step 3: Browser QA**

Verify:

- Hero immediately communicates the Backend Command Center concept.
- Dashboard is animated but not distracting.
- All nav links scroll to correct sections.
- All external links open safely.
- Resume link opens `src/Amirkian-Resume.pdf`.
- Contact form builds a correct `mailto:` link.
- Desktop and mobile layouts have no incoherent overlap.

**Step 4: Final worktree check**

```bash
git status --short
```

Expected: clean worktree.

If final QA required fixes, commit them:

```bash
git add index.html styles.css script.js scripts/verify-static-site.mjs
git commit -m "fix: address final redesign QA"
```

## Execution Handoff

Plan complete. Execute task-by-task and verify after each task. Use `superpowers:executing-plans` for sequential execution or `superpowers:subagent-driven-development` for subagent-driven work in this session.
