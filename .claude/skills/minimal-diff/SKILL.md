---
name: minimal-diff
description: Behavioural rules for any code change in this repo. Use this whenever a task adds, edits, refactors, or scaffolds code or config — Astro pages, components, layouts, Tailwind, tokens.css, scripts, package.json, JSON data — even a "quick fix" or "small tweak". Also use when tempted to add a dependency, an abstraction, a helper, a flag, or JavaScript.
---

# Minimal diff

The owner is a backend/AI person, not a frontend developer. They cannot review five hundred lines
of code they did not ask for, and a diff they cannot review is a diff they cannot trust. Every
rule below exists to keep the change small enough to read in one sitting and obviously connected
to what was asked. Violating these is worse than being slow.

## Before writing

1. **Verify the mental model.** Read the files the task touches before proposing a change. Check
   that the thing you assume exists actually exists, and that the thing you assume is broken
   actually is. A fix built on a wrong picture of the code is orthogonal damage.
2. **Ask one question when ambiguous.** If the task could reasonably mean two materially different
   things, ask one specific question before writing. Do not ask three; do not ask none.
3. **State any assumption you did make in one line, before the code.** "Assuming the parish list
   is sorted by name, not distance." The owner should never discover an assumption by reading the
   diff.

## While writing

- **Smallest solution that works.** If a CSS rule, a stdlib call, or an Astro-native feature does
  the job, use it. Do not reach for a library or a pattern because it is what a frontend team
  would do.
- **No new dependency without asking first.** Justify it against a stdlib, CSS, or Astro-native
  solution. "It's popular" is not a justification. Do not introduce a CMS, database, React state
  library, auth system, backend server, Google Maps, or component library; each of those is a
  conversation, not a commit.
- **No JavaScript unless the feature cannot work without it.** Astro ships zero JS by default.
  The only sanctioned island is the parish map (Leaflet).
- **No abstraction until the third repetition.** Two similar blocks stay two blocks. The urge to
  DRY at two is how a 20-line change becomes a 200-line refactor.
- **No component that only forwards props. No config file for a single value.**
- **Prefer deleting to adding flags.** A boolean parameter is usually two functions wearing one
  coat, or one function that should not exist.
- **No placeholder or lorem ipsum content.** If real content is not written yet, leave the section
  out and say so.
- **No orthogonal changes.** Touch only what the task names. If you notice something else broken,
  mention it in one sentence and stop. Do not fix it in the same pass, even if it is a one-liner.
  The owner decides what goes into which change.

## Size gates

- A function passing ~30 lines, or a file passing ~150 lines: stop and propose a split instead of
  writing it.
- A change touching more than one file: plan first, show the plan, wait for approval.

## After writing

- Two sentences on what changed, then let the diff speak. Not a paragraph.
- Append to `docs/DECISIONS.md` for any substantive change: date, what was decided, why.
- Cost check for anything shipped to the browser: images AVIF/WebP with `srcset` and lazy-load
  below the fold, fonts under 100 KB total with `font-display: swap`, hero video under 2 MB WebM
  with AVIF poster and `preload="none"`, no video below the `md` breakpoint. Target is $0/month.
