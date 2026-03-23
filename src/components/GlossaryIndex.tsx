"use client";

import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import GlossaryCard from "@/components/GlossaryCard";
import TagBadge from "@/components/TagBadge";
import type { GlossaryEntry } from "@/lib/glossary";

type Props = {
    entries: GlossaryEntry[];
    allTags: string[];
    locale?: "en" | "yo";
    placeholder?: string;
    heading?: string;
    subheading?: string;
};

function normalizeForSearch(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export default function GlossaryIndex({
    entries,
    allTags,
    locale = "en",
    placeholder = "Search terms, definitions…",
    heading = "Glossary",
    subheading = "An indexed reference of Ifá and Yorùbá terminology.",
}: Props) {
    const [query, setQuery] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const filtered = useMemo(() => {
        let result = entries;

        if (activeTag) {
            result = result.filter((e) => e.tags.includes(activeTag));
        }

        if (query.trim()) {
            const q = normalizeForSearch(query);

            result = result.filter((e) => {
                const term = normalizeForSearch(e.term);
                const definition = normalizeForSearch(e.definition);
                const slug = normalizeForSearch(e.slug);
                const tags = e.tags.map((t) => normalizeForSearch(t));

                return (
                    term.includes(q) ||
                    definition.includes(q) ||
                    slug.includes(q) ||
                    tags.some((t) => t.includes(q))
                );
            });
        }

        return result;
    }, [entries, query, activeTag]);

    const handleTagClick = (tag: string) => {
        setActiveTag((prev) => (prev === tag ? null : tag));
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <p className="section-label">Archive</p>
                <h1 className="heading-serif text-4xl font-bold mb-3">{heading}</h1>
                <p className="text-parchment-dim">{subheading}</p>
            </div>

            <div className="mb-6 space-y-4">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder={placeholder}
                />

                <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                        <TagBadge
                            key={tag}
                            tag={tag}
                            onClick={handleTagClick}
                            active={activeTag === tag}
                        />
                    ))}
                </div>
            </div>

            <p className="text-parchment-muted text-xs font-mono mb-6">
                {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                {activeTag && ` · filtered by "${activeTag}"`}
                {query.trim() && ` · matching "${query}"`}
            </p>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((entry) => (
                        <GlossaryCard key={entry.slug} entry={entry} locale={locale} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-parchment-muted">
                    <p className="text-4xl mb-4 opacity-30">∅</p>
                    <p className="font-serif text-lg">No entries found</p>
                    <p className="text-sm mt-2">Try adjusting your search or clearing filters</p>
                </div>
            )}
        </div>
    );
}
