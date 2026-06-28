# Backend Command Center Redesign Design

Date: 2026-06-28

## Goal

Redesign the personal portfolio as a fascinating interactive experience while keeping it credible for a senior backend/software engineer. The chosen direction is a Backend Command Center: a polished live-ops dashboard that presents Amirkian Kiani's profile, stack, projects, experience, and contact path as parts of a running production system.

## Current Context

The site is a static GitHub Pages portfolio with `index.html`, `styles.css`, `script.js`, a resume PDF, and image assets. Most current styling and behavior live inline in `index.html`; `styles.css` appears to be an older simpler stylesheet. The existing content includes hero, about, tech stack, projects, experience, contact, resume download, and social links.

## Experience Direction

Visitors should land inside a high-end engineering cockpit:

- Strong positioning copy: senior software engineer building scalable backend systems.
- Animated production-style panels for service health, latency, throughput, uptime, stack modules, and event logs.
- A small command terminal/palette with commands such as `whoami`, `stack`, `projects`, and `contact`.
- Clear CTAs for resume download, projects, and contact.
- Static, fast, GitHub Pages-friendly implementation.

The tone should be premium, technical, cinematic, and readable. It should move away from generic neon portfolio styling and toward an intentional operations-console identity.

## Page Structure

1. **Hero: Live System Overview**
   - Name, role, positioning, and primary CTAs.
   - Dashboard visualization with API status, queue throughput, DB latency, uptime, stack modules, and a scrolling event log.

2. **About: Engineer Profile**
   - Concise operating summary explaining what Amirkian builds, his backend strengths, and the systems he prefers to work on.

3. **Tech Stack: Infrastructure Map**
   - Group skills into backend, data, infrastructure, frontend/mobile, and AI/tooling.
   - Hovering a group can highlight related dashboard/service elements.

4. **Projects: Service Registry**
   - Present projects as service cards with domain, role, stack, impact, and external link.

5. **Experience: Deployment Timeline**
   - Present roles as release-style timeline entries with company, role, dates, location, and shipped capabilities.

6. **Contact: Open Connection**
   - Keep the contact form with a `mailto:` fallback.
   - Include direct links for LinkedIn, GitHub, resume, and email.

## Visual System

- Palette: near-black base, off-white text, restrained cyan for active systems, green for healthy status, amber for warnings, and one warm CTA accent.
- Avoid an all-blue or all-purple cyber look.
- Typography: `Inter` for content and `JetBrains Mono` for terminal/status elements.
- Layout: compact operational panels with fine borders, 6-8px radii, status labels, small charts, event logs, and architecture lines.
- Avoid nested cards and decorative gradient blobs.
- Keep text hierarchy practical: large type only in the hero, tighter headings inside panels.

## Motion And Interaction

- Hero metrics gently update.
- Event log streams believable backend events.
- Architecture lines pulse when related sections enter view.
- Scroll reveals should be quick and restrained.
- Terminal/palette commands should jump to sections or reveal quick facts.
- Respect `prefers-reduced-motion`.

## Architecture

Keep the implementation static:

- Move large inline CSS and JS out of `index.html` into `styles.css` and `script.js`.
- Keep `index.html` focused on semantic markup and content.
- Use vanilla HTML, CSS, and JavaScript.
- No build step unless later justified.

## Component Model

- `Header`: compact navigation, resume CTA, active section state.
- `CommandHero`: intro copy, dashboard panels, terminal commands.
- `OpsDashboard`: status cards, event log, architecture visual.
- `ProfileSummary`: concise backend engineer profile.
- `StackMap`: grouped technologies with hover states.
- `ServiceRegistry`: project cards as services.
- `DeploymentTimeline`: experience entries.
- `ContactChannel`: mailto contact path and social links.

## Data Flow

Use small JavaScript arrays/objects for:

- Terminal commands.
- Dashboard metrics.
- Event log messages.
- Stack groups.
- Project metadata.

JavaScript should update dynamic UI from these structures so content remains easier to maintain than repeated hardcoded blocks.

## Failure Handling

- Contact form uses `mailto:` fallback.
- External links open safely with `target="_blank"` and `rel="noopener noreferrer"`.
- Images use alt text and graceful sizing.
- Missing local images should not break layout.
- Reduced-motion users receive static or minimized animations.

## Verification

Before completion:

- Open locally in a browser.
- Check desktop and mobile layouts.
- Confirm no text overlap or incoherent wrapping.
- Verify navigation anchors, command interactions, external links, and resume link.
- Confirm reduced-motion behavior.
- Run a static sanity check for missing referenced local assets.
