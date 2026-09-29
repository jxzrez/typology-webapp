---
name: citation-integrity
description: Rules for writing or editing doctrinal content on this site. Use this whenever a task creates, edits, reviews, or translates anything under src/content/ (MDX concept pages, claims, sources, frontmatter), touches the content schema in src/content/config.ts or scripts/check-citations.mjs, or asks about a Catholic teaching, Scripture passage, Church Father, council, encyclical, or Catechism paragraph — even if the user only says "write the page on X", "add a claim", "fix the sources", or "what does the Church teach about Y".
---

# Citation integrity

This site is catechesis with sources. A reader who does not share the faith should be able to
follow every claim back to a text they can check. A wrong paragraph number, an invented patristic
quote, or a confident summary of a document that was never read destroys that trust faster than
anything else on the site could. Broken citations are a worse failure than broken CSS.

The failure mode to guard against is not laziness but confabulation: training data contains
thousands of plausible-looking "St. Augustine said..." lines that Augustine never said, and
CCC paragraph numbers that are off by ten. The model that wrote them was confident too.

## The frontmatter every concept page carries

```yaml
title: string
audience_level: 1 | 2 | 3        # 1 = no vocabulary assumed
summary: string                   # 2 sentences, plain English, no jargon
claims:
  - text: string
    sources:                      # at least one, required
      - type: scripture | ccc | denzinger | father | council | encyclical
        ref: string               # e.g. "CCC 1333", "Jn 6:51", "Denz. 1642"
        work: string              # required for `father`, e.g. "Justin Martyr, First Apology 66"
status: draft | verified          # `verified` means the owner checked it against the text
```

The schema enforces this and the build fails on an empty source. Do not weaken, bypass, or add an
escape hatch to that check, even temporarily.

## Six rules

1. **Never invent a `ref`.** If you do not know the exact reference, write `ref: TODO` and list
   every TODO in your reply so the owner can resolve them. A TODO the owner can check is fine.
   A confident wrong number is not. When unsure whether you know it, you do not know it.
2. **Never quote a Church Father from memory.** Paraphrase the point in your own words and cite
   the work and section, or leave the quotation out entirely. Direct quotation of a Father is
   only acceptable when the owner supplies the text or asks you to fetch it from a named edition.
3. **Never paraphrase a Catechism paragraph and attach a number you have not verified.** Same
   failure mode. If you cannot verify, the number is `TODO`.
4. **Everything you write is `status: draft`.** Only the owner sets `verified`, after checking
   against the source text themselves. Never flip a page to `verified`, and never copy a
   `verified` status onto a new page.
5. **Define every technical term on first use, inline, in a clause.** "Transubstantiation, the
   teaching that the whole substance of the bread becomes the body of Christ while its appearance
   remains, ..." No glossary-only definitions. Audience level 1 assumes zero vocabulary.
6. **Prefer the Church's own words for the teaching and plain English for the explanation.**
   Keep the two visibly distinct so the reader always knows what is quoted and what is commentary.

## Posture on every page

Catechesis with sources, not apologetics with arguments. The goal is "here is what the Church
holds and the chain of reasoning behind it," not "here is why you should agree." State the
teaching accurately, show the sources, let the reader weigh it. On contested issues: present the
Church's position in its strongest form as the Church itself presents it, note honestly where it
is contested and by whom, and do not strawman opposing views. No triumphalism, no mockery, no
culture-war register.

The core structural move: trace the belief backwards. Old Testament type → New Testament
fulfilment → patristic witness → magisterial definition → present practice.

## Must-flag topics

Training data is stale or commonly wrong here. Do not write these sections confidently. Write
the draft, then say explicitly in your reply which of these it touches and that it needs manual
verification.

- **Capital punishment.** CCC 2267 was revised in 2018. Much training data reflects the older
  formulation. Flag for manual verification before anything else.
- ***Fiducia Supplicans*** (2023) and subsequent clarifications. Heavily misreported. Treat every
  claim about it as unverified.
- **Limbo.** Never a dogma. The 2007 International Theological Commission document changed how
  it is usually presented.
- **Development of doctrine.** Distinguish *dogma*, *doctrine*, *discipline*, and *prudential
  judgement* every time. The modern-issues pages live or die on this distinction. Do not flatten
  them into "the Church teaches".
- **Other Christian communions.** State their actual position, sourced, or say nothing. No
  caricatures of Protestant or Orthodox belief.

## Before you reply

Include a short block at the end of your reply:

```
Citations: N sources, M marked TODO
TODOs: <list each, with the claim it belongs to>
Flags: <any must-flag topic touched, or "none">
Status: draft
```

If there is nothing to report, the block is still there with zeros. The owner uses it to decide
what to verify before a page can ship.
