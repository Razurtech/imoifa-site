import enGlossary from "@/content/en/glossary.json";
import yoGlossary from "@/content/yo/glossary.json";

export type BodySection = {
    heading: string;
    text: string;
};

export type GlossaryEntry = {
    slug: string;
    language: string;
    term: string;
    pronunciation?: string;
    partOfSpeech?: string;
    category?: string;
    thumbnail: string | null;
    definition: string;
    body?: BodySection[];
    tags: string[];
    related?: string[];
};

export type Locale = "en" | "yo";

const glossaryMap: Record<Locale, GlossaryEntry[]> = {
    en: enGlossary as GlossaryEntry[],
    yo: yoGlossary as GlossaryEntry[],
};

export function getAllEntries(locale: Locale): GlossaryEntry[] {
    return glossaryMap[locale] ?? [];
}

export function getEntryBySlug(
    locale: Locale,
    slug: string
): GlossaryEntry | undefined {
    return glossaryMap[locale]?.find((e) => e.slug === slug);
}

export function getAllTags(locale: Locale): string[] {
    const entries = getAllEntries(locale);
    const tagSet = new Set<string>();
    entries.forEach((e) => e.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
}

export function filterEntries(
    locale: Locale,
    query: string,
    tag?: string
): GlossaryEntry[] {
    let entries = getAllEntries(locale);
    if (tag) {
        entries = entries.filter((e) => e.tags.includes(tag));
    }
    if (query.trim()) {
        const q = query.toLowerCase();
        entries = entries.filter(
            (e) =>
                e.term.toLowerCase().includes(q) ||
                e.definition.toLowerCase().includes(q) ||
                e.tags.some((t) => t.toLowerCase().includes(q))
        );
    }
    return entries;
}

/**
 * Resolves related entry slugs to GlossaryEntry objects, falling back to the
 * other locale when the primary one is missing an entry.
 */
export function getRelatedEntries(
    locale: Locale,
    slugs: string[]
): { entry: GlossaryEntry; locale: Locale }[] {
    const fallback: Locale = locale === "en" ? "yo" : "en";
    return slugs.flatMap((slug) => {
        const primary = getEntryBySlug(locale, slug);
        if (primary) return [{ entry: primary, locale }];
        const fb = getEntryBySlug(fallback, slug);
        if (fb) return [{ entry: fb, locale: fallback }];
        return [];
    });
}

/**
 * Estimates reading time for a glossary entry (in minutes, minimum 1).
 */
export function getReadingTime(entry: GlossaryEntry): number {
    const words = [
        entry.definition,
        ...(entry.body?.map((s) => `${s.heading} ${s.text}`) ?? []),
    ]
        .join(" ")
        .split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}
