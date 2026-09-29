# Decisions

Append-only. Date, what was decided, why. Newest at the bottom.

## 2026-09-29

- **Posture: catechesis with sources, not apologetics.** Fixed in CLAUDE.md §1 before any content.
- **Stack: Astro 7 static, Tailwind 4, MDX content collections, Leaflet, Cloudflare Pages.**
  Zero JS by default; content as files; $0 hosting. Cloudflare now steers new projects to Workers
  static assets, but Pages needs no wrangler config and is still supported. Revisit if deprecated.
- **Two JS islands only: parish map and homepage cross-reference explorer.** The explorer replaced
  the hero video. An SVG of arcs is kilobytes; the video was the largest bandwidth line item.
- **Visualiser arcs are drawn only from each page's own Scripture citations, chapter to chapter,
  on a 73-book axis.** No arc without a checkable source. No backdrop layer: the only free
  cross-reference dataset (openbible.info, CC-BY) is 66-book and omits the deuterocanon.
- **Scripture translation: RSV-CE (1966), not RSV-2CE.** RSV-2CE has no digital text, no API, and
  no published quotation threshold; Ignatius asks for permission requests with possible fees.
  RSV-CE has a published 500-verse policy, is readable on Bible Gateway for link-outs, and already
  has the Catholic renderings that matter (Lk 1:28 "full of grace"). A verse tally comes in step 2;
  permission is requested from Friendship Press before 500. NABRE's free-use clause names print,
  sound, and ebook only, not websites.
- **Catechism: quote under the USCCB <5,000-word policy, deep-link per paragraph to
  scborromeo.org, vatican.va as fallback.** The GitHub CCC JSON dumps have no licence and
  redistribute copyrighted text; not vendored.
- **Church Fathers: paraphrase and link to New Advent, never copy.** New Advent claims copyright
  on its revised Schaff translations.
- **Denzinger dropped as a source type.** Owner has no copy; no free English edition exists.
  Councils are cited by session and chapter with a link to the text instead.
- **Schema: one audience level per page; optional `url` per source; optional `further_reading`.**
  Three versions per concept would triple writing and verification.
- **Citation gate lives in the zod schema for step 1.** Empty sources, `father` without `work`,
  and `verified` + TODO all fail the build with zero new dependencies. The check script and its
  YAML parser arrive in step 2 when the cross-file verse tally is needed.
- **Domain: `*.pages.dev` for v1; eu.org subdomain applied for in parallel; .org via Cloudflare
  Registrar later if wanted.** is-a.dev and js.org require developer or JavaScript content and
  would be misrepresentation. GitHub Student Pack requires enrolment. Freenom is defunct and
  phishing-tainted. .sg needs SingPass verification and costs 3 to 4 times more.
- **Private lay project with a footer disclaimer on every page.** Accuracy target is still
  Nihil-Obstat grade: the `verified` gate and link-to-source citations are the mechanism.
- **Parish data: seeded once from OpenStreetMap Overpass, then hand-maintained.** catholic.sg
  blocks automated access with a Cloudflare challenge; MyCatholicSG is login-gated with no public
  API. Overpass returns all 32 Archdiocese churches with name, address, coordinates, and website.
  Mass times exist nowhere machine-readable, so they are entered by hand with a
  `mass_times_checked` date. One email to the Digital Church Office asking for an export is worth
  sending, not worth blocking on.
- **No comments, contact form, or newsletter.** Each breaks static and free.
- **Step 4 pages: Papacy, Mary as Ark of the Covenant and New Eve, Purgatory.** Owner asked for
  the most distinctively Catholic doctrines first. Purgatory exercises 2 Macc 12 and so the
  deuterocanon on the visualiser axis.
- **`compressHTML: true`.** Astro 7's default `'jsx'` mode strips whitespace between adjacent
  inline elements, which would mangle citation markup.
- **Drafts are built and shown with their status label.** Hiding drafts in production is a
  one-line collection filter to add when the owner wants it.
- **Skills:** `frontend-design` and `context7` installed at user scope from the official
  marketplace; `citation-integrity` and `minimal-diff` written locally under `.claude/skills/`.
