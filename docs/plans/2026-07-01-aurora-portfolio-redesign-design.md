# Aurora Portfolio Redesign — Design

Date: 2026-07-01
Owner: Amirkian Kiani
Supersedes: the "Backend Command Center" terminal theme.

## Goal
Redesign the single-page portfolio (static GitHub Pages site at www.amirkiankiani.ir)
into something unique and aesthetic: a dark, moody, "aurora / glass" atmosphere with
rich, alive motion. Reframe content to elevate the AI/LLM and leadership strengths from
the new resume, and replace fake ops metrics with real, honest numbers.

## Concept: "Aurora"
Content floats as frosted-glass panels over a slow-drifting animated aurora backdrop.
Elegant, premium, engineering-native — an atmosphere rather than a gimmick.

## Palette (dark & moody)
- Base: `#080A14` (near-black, blue-violet undertone)
- Aurora glow blobs: violet `#7C5CFF`, cyan `#22D3EE`, magenta `#F471B5`, emerald `#34D399`
- Glass: white @ ~5% opacity + heavy backdrop-blur + 1px gradient neon border
- Text: `#E7EAF3` primary, `#8A93AB` muted
- Accent: electric violet -> cyan gradient (CTAs, links, highlights)

## Typography
- Display: Space Grotesk (gradient-filled hero headline)
- Body: Inter
- Labels/code: JetBrains Mono

## Structure
1. Hero — aurora canvas backdrop, gradient headline, value prop, gradient CTA + resume,
   floating glass identity card (photo + real stats), mouse-parallax.
2. About — backend architecture, AI/LLM & automation, technical leadership/mentoring.
3. Stack — constellation grouped: Backend, Data, Infra, AI & Media, Frontend/Mobile.
   Adds AI stack: LlamaIndex, n8n, pgvector, Pinecone, OpenAI, MCP, RAG.
4. Selected Work — glass project cards with real impact tags (Baazigooshi 3M+ users;
   clients Digikala/Namava/Irancell/MCI). Featured treatment for the strongest.
5. Impact strip — animated count-up: 7+ yrs, 3M+ users, 15-20s -> 2-6s, TOEFL 109.
6. Experience — glass timeline along a glowing aurora line (mentor roles deduped).
7. Contact — direct channels only.

## Interactions (rich & alive)
Living aurora canvas, mouse-parallax, scroll-reveal (fade + rise via IntersectionObserver),
animated count-up, gradient-glow hover on cards/buttons, custom cursor glow.
All gated behind `prefers-reduced-motion`.

## Decisions (confirmed with user)
- Contact: direct channels only (no form).
- Emails: show BOTH great.kian2001@gmail.com and amirkiankiani@gmail.com.
- Include phone +98 9921267228, keep Buy Me a Coffee. Otherwise essentials only.
- Do NOT link the personal site (this IS that site).
- Replace fake metrics with real numbers; elevate the AI/LLM narrative.

## Constraints
- Vanilla HTML/CSS/JS (no build step). GitHub Pages.
- Keep CNAME (www.amirkiankiani.ir) and resume path src/Amirkian-Resume.pdf.
- Accessible + performant; respect reduced motion; responsive to mobile.
