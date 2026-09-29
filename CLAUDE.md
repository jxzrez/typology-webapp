# CLAUDE.md

Project memory. Claude Code loads this automatically at the start of every session.
Keep it under ~250 lines. If a section stops being true, fix it here rather than re-explaining in chat.

---

## 1. What this is

A website explaining Catholic typology and doctrine to two audiences:

1. **Non-Catholics** — curious, skeptical, or engaging in good faith. Assume zero vocabulary.
2. **Under-catechised Catholics** — practice the faith, don't know why.

**Scope of content:** sacraments, dogmas, Mariology, eschatology, soteriology, plus contested modern
issues (contraception, IVF, LGBTQ questions, capital punishment, just war theory).

**The core move on every page:** trace the belief backwards. Old Testament type → New Testament
fulfilment → patristic witness → magisterial definition → present practice. The reader should finish
a page able to say "I see where that came from," whether or not they agree.

### Posture (decided — do not drift from this)

This site is **catechesis with sources**, not apologetics with arguments.
The goal is *"here is what the Church holds and the chain of reasoning behind it,"* not *"here is why
you should agree."* State the teaching accurately, show the sources, let the reader weigh it.

On contested issues this means: present the Church's position as the Church itself presents it, state
the strongest form of it, note honestly where it is contested and by whom, and do not strawman
opposing views. No triumphalism. No mockery. No culture-war register.

---

## 2. Hard rules for code

These exist because I am a backend/AI person, not a frontend dev, and I cannot review 500 lines of
React I didn't ask for. Violating these is worse than being slow.

- **No new dependency without asking first.** Justify it against a stdlib, CSS, or Astro-native
  solution. "It's popular" is not a justification.
- **No abstraction until the third repetition.** Two similar blocks stay two blocks.
- **No component that only forwards props.** No config file for a single value.
- **No orthogonal changes.** Touch only what the task names. If you spot something else broken, say
  so and stop; don't fix it in the same pass.
- **No silent assumptions.** If the task is ambiguous, ask one question before writing. State any
  assumption you did make, in one line, before the code.
- **Prefer deleting to adding flags.**
- **No JavaScript unless the feature cannot work without it.** Astro ships zero JS by default. Two
  sanctioned islands: the parish map (Leaflet) and the homepage cross-reference explorer. Per-page
  arc diagrams are static SVG rendered at build time.
- **No placeholder or lorem ipsum content.** If real content isn't written yet, leave the section out
  and tell me.
- Functions over ~30 lines, files over ~150 lines: stop and propose a split instead of writing it.

---

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output) | Content-heavy, zero JS by default, content lives in editable files |
| Styling | **Tailwind** | Pairs with the frontend-design skill's token approach |
| Content | **MDX content collections** with a typed schema | Lets me write theology as documents, not components |
| Map | **Leaflet + OpenStreetMap tiles** | Free, no API key, no billing account |
| Church data | Static JSON, ~30 Singapore parishes, hand-maintained | Finite list, rarely changes, no API needed |
| Hosting | **Cloudflare Pages** (default) | Free, no bandwidth cap. Cloudflare now steers new projects to Workers static assets; Pages still works and needs no wrangler config. Revisit if Pages is deprecated. See §4 before proposing AWS |
| Repo | Single repo, no monorepo tooling | |

**Source texts and how we may use them** (licences checked 2026-09-29):

| Source | Use | Rule |
|---|---|---|
| Scripture | **RSV-CE (1966)** | Quote the key verses, link the full passage on Bible Gateway. NCCC allows 500 verses site-wide without written permission; we will cross that eventually, so a verse tally arrives in step 2 and permission is requested from Friendship Press before 500. RSV-2CE rejected: no digital text, no published threshold. |
| Catechism | USCCB policy: <5,000 words with their notice | Deep-link paragraphs to `scborromeo.org/ccc/para/NNNN.htm`; vatican.va `ENG0015` as authoritative fallback (no per-paragraph anchors there). Never vendor CCC text or the unlicensed GitHub JSON dumps. |
| Church Fathers | Paraphrase + link | New Advent (`/fathers/WWWWBCC.htm`) claims copyright on its revised translations. Never copy their text. |
| Councils | Link per session | Trent, Vatican I: papalencyclicals.net. Vatican II: vatican.va (no section anchors). No free English Denzinger exists; `denzinger` is not a source type. |
| Cross-references | Site's own citations only | The openbible.info dataset is CC-BY but 66-book; we are 73-book, so no backdrop layer. Deuterocanonical links are hand-authored. |

**Framework facts that bite** (Astro 7, Tailwind 4): collection config lives at `src/content.config.ts`;
`z` comes from `astro/zod`; `compressHTML: true` is set because the default `'jsx'` mode strips whitespace
between adjacent inline elements and breaks citation markup; the Rust compiler rejects unclosed tags.
Tailwind 4 is CSS-first: tokens are an `@theme` block in `tokens.css`, there is no `tailwind.config`.

**Do not introduce:** a CMS, a database, a React state library, an auth system, a backend server,
Google Maps, or a component library. If a task seems to need one, that's a conversation, not a commit.

---

## 4. Cost constraints

Target: **$0/month, hard ceiling ~$5/month.**

The bill here is bandwidth, not compute. Rules that follow from that:

- **The hero is the SVG cross-reference visualiser, not a video.** If a video is ever proposed:
  muted, looping, under 2 MB, WebM with an AVIF poster, `preload="none"`, none below `md`.
- Every image: AVIF or WebP, responsive `srcset`, lazy-loaded below the fold.
- No web font files over 100 KB total. Subset aggressively. `font-display: swap`.
- No analytics script that costs money or phones home to an ad network.
- **AWS is optional, not required.** S3 + CloudFront is free for 12 months, then CloudFront egress is
  the expensive part. If I ask for AWS anyway, use S3 + CloudFront with the video served from a
  separate origin, and tell me the projected monthly cost at 1k and 10k visitors before building it.

---

## 5. Content and citation rules

**This is the part that actually matters. Broken citations are a worse failure than ugly CSS.**

Every doctrinal or historical claim carries a structured source. The zod schema in
`src/content.config.ts` enforces it: the build fails on an empty source list, on a `father` without
`work`, and on a `verified` page containing any `TODO` ref. Do not weaken or bypass that check.
A separate `scripts/check-citations.mjs` arrives in step 2 for the cross-file RSV-CE verse tally.

```yaml
# frontmatter shape for every concept page
title: string
audience_level: 1 | 2 | 3        # one level per page; 1 = no vocabulary assumed
summary: string                   # 2 sentences, plain English, no jargon
claims:
  - text: string
    sources:                      # at least one, required
      - type: scripture | ccc | father | council | encyclical
        ref: string               # e.g. "Jn 6:51", "CCC 1333", "Trent, Sess. XIII, ch. 4"
        work: string              # required for `father`, e.g. "Justin Martyr, First Apology 66"
        url: string               # optional deep link to the text (see §3 for where)
further_reading:                  # optional; secondary sources such as Pitre
  - title: string
    author: string
    note: string                  # optional, one line
status: draft | verified          # `verified` means I checked it against the text myself
```

### Rules for Claude when writing content

1. **Never invent a citation.** If you don't know the exact reference, write `ref: TODO` and flag it
   in your reply. A `TODO` I can check is fine. A confident wrong paragraph number is not.
2. **Never quote a Church Father from memory.** Paraphrase and cite the work and section, or leave
   the quote out. Model training data confabulates patristic quotations constantly.
3. **Never paraphrase a CCC paragraph and attach a number you didn't verify.** Same failure mode.
4. Nothing ships as `status: verified` unless *I* marked it. You write `draft`, always.
5. Define every technical term on first use, inline, in a clause. No glossary-only definitions.
6. Prefer the Church's own words for the teaching, and plain English for the explanation. Don't blur
   the two.
7. Scripture is RSV-CE. Quote the verses the argument turns on; link the rest. Every quotation
   counts toward the 500-verse ceiling in §3.

---

## 6. Doctrinal traps

Places where training data is commonly stale or wrong. Flag these to me rather than writing
confidently.

- **Capital punishment** — CCC 2267 was revised in 2018. Much training data reflects the older
  formulation. Do not write this section without flagging it for manual verification.
- ***Fiducia Supplicans*** (2023) and subsequent clarifications — heavily misreported. Treat every
  claim about it as unverified.
- **Limbo** — never a dogma; the 2007 ITC document changed how it's usually presented.
- **Development of doctrine** generally — distinguish *dogma*, *doctrine*, *discipline*, and
  *prudential judgement*. The modern-issues pages live or die on this distinction. Don't flatten them.
- **Anything about other Christian communions** — state their actual position, sourced, or say
  nothing. No caricatures of Protestant or Orthodox belief.

---

## 7. Repo layout

```
.claude/
  skills/           # project skills, committed — see §11
src/
  content.config.ts  # content collection schema (enforces §5). Astro 6+ errors on src/content/config.ts
  content/
    concepts/        # MDX, one file per doctrine — the actual substance of the site
  components/        # keep small; most pages need none
  layouts/
  pages/
  styles/
    global.css       # @import "tailwindcss"; @import "./tokens.css";
    tokens.css       # design tokens as a Tailwind @theme block, single source of truth (see §8)
data/
  parishes.json      # Singapore parishes, seeded once from OSM Overpass (step 5): name, address,
                     # lat, lng, url, mass_times, mass_times_checked
scripts/
  check-citations.mjs  # step 2: cross-file RSV-CE verse tally, TODO report
public/
docs/
  DECISIONS.md       # append-only log: date, decision, reason
```

---

## 8. Build order

Do not jump ahead. Each step gates the next.

1. **Scaffold** — Astro + Tailwind + content collections with the schema gate. Nothing visual.
   *Done 2026-09-29.*
2. **One concept page, fully.** The Eucharist: Melchizedek → Passover → Bread of the Presence →
   John 6 → Last Supper → patristic witness (Ignatius, Justin) → Trent → the Mass.
   Real content, real citations, real design, **including the page's static arc diagram** (the
   signature element must be designed with the page). This page is the proof of concept for everything.
3. **Extract the theme.** Pull that page's palette, type scale, spacing, and components into
   `tokens.css`. Everything afterwards is built against the tokens, not invented fresh.
4. **Three more concept pages** against the theme, in this order: the Papacy (Is 22 → Mt 16; tests
   dogma vs discipline and the other-communions rule), Mary as Ark of the Covenant and New Eve
   (tests Marian dogma citations), Purgatory (2 Macc 12 exercises the deuterocanon on the 73-book
   axis). Confirm the system holds.
5. **Map + resources page.** Leaflet, parish JSON, distance sort from browser geolocation.
   Links out: Archdiocese of Singapore, vatican.va, the Catechism, relevant documents.
6. **Homepage with the interactive explorer.** Last. All arcs the site has sourced; hovering a
   concept highlights its links, clicking navigates. The JS island. Below `md`: static arc only.

---

## 9. Design direction

Run the `frontend-design` skill before any UI work. Commit to a direction before writing CSS.

Constraints for this project:
- **Editorial, not SaaS.** This is closer to a serious magazine or a scholarly edition than a
  landing page. Generous measure, real typographic hierarchy, restrained colour.
- Banned by default: Inter, Arial, system font stacks, purple gradients, glassmorphism, card grids
  as the primary layout, emoji as iconography, "Get Started" button energy.
- Citations and Scripture references need a visual treatment that reads as sober and trustworthy.
  That's a core design problem here, not a detail.
- Dark and light both, tokens-driven. Dark first.
- It must be legible on a phone at arm's length by someone who doesn't care about typography.
- **The one memorable element is the cross-reference arc diagram.** Arcs connect *chapters* on a
  73-book axis, drawn only from the page's own Scripture citations. Everything around it is quiet.
  Register: a constellation or skill tree (the owner's reference is Skyrim / Assassin's Creed), not
  a dashboard. Later bonus: a second node row for non-Scripture sources (Fathers, Aquinas, councils).
- The `frontend-design` skill names two AI-tell palettes: cream + serif + terracotta, and near-black
  + one acid accent. Avoid both, even though "editorial" and "dark constellation" drift toward them.

---

## 10. How to run a session

- **Plan mode first** for anything touching more than one file. Show me the plan; wait for approval.
- `/model opusplan` is the default for build work. Opus for planning, Sonnet for execution.
- **Grill me.** When I give a vague instruction, push back with specifics before building. I would
  rather answer three questions than review the wrong implementation.
- End every substantive change by appending to `docs/DECISIONS.md`: date, what was decided, why.
- If you find yourself about to write a paragraph explaining what you did, write two sentences instead
  and let me read the diff.

---

## 11. Skills

Bootstrap ran 2026-09-29. If a fresh clone lacks any of these, restore it the same way.

| Skill | Status | Job |
|---|---|---|
| `frontend-design` | installed, user scope: `/plugin install frontend-design@claude-plugins-official` | Force a stylistic commitment before any CSS: direction, typeface pairing, palette and type scale as tokens in `src/styles/tokens.css`. §9 is the standing direction. |
| `citation-integrity` | written, `.claude/skills/citation-integrity/SKILL.md` | Encodes §5 and §6. Triggers on any edit under `src/content/`. |
| `minimal-diff` | written, `.claude/skills/minimal-diff/SKILL.md` | Encodes §2. Triggers on any code change. |
| `context7` | installed, user scope: `/plugin install context7@claude-plugins-official` | Current Astro 7 / Tailwind 4 docs. Use it before writing against either API. |

Optional, add only when the need shows up: `cloudflare@claude-plugins-official` at step 5;
`claude-security@claude-plugins-official` before public launch; Playwright when "this should render
correctly" stops being trusted.

### Rules

- **Keep the list short.** Every skill's description sits in context on every turn. A bloated skill
  set is itself the bloat §2 is trying to prevent. Three required skills is the ceiling until one
  proves insufficient.
- Third-party skills are instructions **plus code that runs on my machine**. Read the folder before
  installing, and never install one without telling me first.
- Skills don't sync between claude.ai and Claude Code. Repo-local `.claude/skills/` is the only
  version that's automatic for this project.
- A locally written skill is a normal file. If it's not working, edit it; if it's not earning its
  context, delete it.

### Commands

```bash
npm run dev      # local dev server
npm run build    # static build; the content schema fails it on bad sources
npm run preview  # preview the built site
```

---

## 12. Open questions

Resolved 2026-09-29 (reasons in `docs/DECISIONS.md`):

- Domain: `*.pages.dev` for v1; a free eu.org subdomain applied for in parallel; a .org via
  Cloudflare Registrar (~US$10/yr) later if the site earns it. is-a.dev and js.org are not eligible.
- Private lay project. Every page carries the footer disclaimer. Accuracy target is Nihil-Obstat
  grade anyway: the `verified` gate and link-to-source citations are how.
- Translation: RSV-CE (see §3).
- Parish data: JSON seeded once from OSM Overpass (32 churches), mass times entered by hand with a
  `mass_times_checked` date. catholic.sg blocks bots; MyCatholicSG has no public API.
- No comments, contact form, or newsletter.

- Pages project name: `traced-back` (from "trace the belief backwards"). `site` in `astro.config.mjs`
  is `https://traced-back.pages.dev`. Change both together if the dashboard rejects the name.
- Repo: `github.com/jxzrez/typology-webapp`, public, MIT. Note MIT covers our code and prose;
  quoted RSV-CE and CCC excerpts remain their owners' and are used under the policies in §3.

---

## 13. Compact instructions

When context is compacted, preserve: the decisions in §12 and `docs/DECISIONS.md`, any open
questions, the current build-order step in §8, and citations marked `TODO` in the current task.
Drop: tool output, research transcripts, file contents that can be re-read.