# typology-webapp

A static site explaining Catholic typology and doctrine with sources: Old Testament type, New
Testament fulfilment, patristic witness, magisterial definition, present practice.

Built with Astro and Tailwind. Content lives in `src/content/concepts/` as MDX with a typed
frontmatter schema; the build fails on any claim without a source. See `CLAUDE.md` for the rules
and `docs/DECISIONS.md` for why things are the way they are.

```bash
npm install
npm run dev
npm run build
```

A private lay project. Not an official publication of the Archdiocese of Singapore or of any
ecclesiastical authority.
