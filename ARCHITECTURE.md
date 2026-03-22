# Imoifa — Frozen Architecture

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 14** (app router) | Do not upgrade to 15+ without review |
| Styling | **Tailwind CSS** | Design tokens in `tailwind.config.ts` |
| Content | **Local JSON** | Structured data only, no CMS |
| Components | **React (TSX)** | Reusable, co-located in `src/components/` |

## Prohibited

The following must **never** be introduced to this project without an explicit architecture review:

- Express, Fastify, or any Node.js server framework
- Vite, Parcel, Webpack (Next.js handles bundling)
- Additional meta-frameworks (Remix, Astro, SvelteKit, etc.)
- Backend services, databases, or external APIs in the current phase
- Prisma, Drizzle, or any ORM
- tRPC, GraphQL, or REST API layers
- State management libraries (Zustand, Redux, Jotai) unless clearly justified

## Content Layer

All glossary content must live in:

```
src/content/
  en/
    glossary.json     ← English entries
  yo/
    glossary.json     ← Yorùbá entries
```

All content access must go through **`src/lib/glossary.ts`** — no page or component should import content JSON directly.

### GlossaryEntry schema

```ts
type GlossaryEntry = {
  slug: string;           // URL-safe identifier
  term: string;           // Display name (may include diacritics)
  phonetic: string;       // Pronunciation guide
  partOfSpeech: string;   // e.g. "noun" / "orúkọ"
  definition: string;     // Short definition (shown in cards)
  extendedDefinition?: string;  // Long-form, shown on detail page
  relatedTerms?: string[];      // Slugs of related entries
  tags: string[];         // Used for filtering
  category: string;       // Section grouping
};
```

## Routes

```
/                        ← English home
/glossary                ← English glossary index  
/glossary/[slug]         ← English entry detail
/yo                      ← Yorùbá home
/yo/glossary             ← Yorùbá glossary index
/yo/glossary/[slug]      ← Yorùbá entry detail
```

Route hierarchy must be kept flat. No nested dynamic segments beyond `[slug]`.

## Component Rules

- All reusable components live in `src/components/`
- Components must accept explicit props — no global state
- Client components (`"use client"`) only when interactivity requires it (e.g. `SearchBar`, `GlossaryIndex`)
- Server components are the default for all pages and data-fetching wrappers

## Future MCP Integration

The `src/lib/glossary.ts` module is the intended seam for MCP integration. When the time comes:
- Replace JSON imports with async fetch calls inside the same function signatures
- No page or component code should need to change

---

> This file is a living contract. Do not modify the stack without discussion.
