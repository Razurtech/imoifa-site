import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    getAllEntries,
    getEntryBySlug,
    getRelatedEntries,
    getReadingTime,
} from "@/lib/glossary";
import TagBadge from "@/components/TagBadge";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
    return getAllEntries("yo").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const entry = getEntryBySlug("yo", params.slug);
    if (!entry) return { title: "Not Found" };
    return {
        title: `${entry.term} — Imoifa`,
        description: entry.definition,
    };
}

export default function YoGlossarySlugPage({ params }: Props) {
    const entry = getEntryBySlug("yo", params.slug);
    if (!entry) notFound();

    const enEntry = getEntryBySlug("en", params.slug);
    const relatedEntries = getRelatedEntries("yo", entry.related ?? []);
    const readingTime = getReadingTime(entry);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Language badge */}
            <div className="mb-6">
                <span className="text-xs text-gold/60 font-mono uppercase tracking-widest border border-gold/20 px-2.5 py-1 rounded-sm">
                    Yorùbá
                </span>
            </div>

            {/* Breadcrumb */}
            <nav className="mb-10 text-xs font-mono text-parchment-muted flex items-center gap-2 flex-wrap">
                <Link href="/yo" className="hover:text-parchment transition-colors">Ilé</Link>
                <span className="text-gold/30">/</span>
                <Link href="/yo/glossary" className="hover:text-parchment transition-colors">Àkójọ Ọ̀rọ̀</Link>
                <span className="text-gold/30">/</span>
                <span className="text-parchment">{entry.term}</span>
            </nav>

            {/* Hero thumbnail */}
            {entry.thumbnail ? (
                <div className="relative w-full h-56 md:h-72 rounded-sm overflow-hidden mb-10 bg-ink-800">
                    <Image
                        src={entry.thumbnail}
                        alt={entry.term}
                        fill
                        className="object-cover opacity-75"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                </div>
            ) : (
                /* Decorative accent bar when no thumbnail */
                <div className="w-full h-1 bg-gradient-to-r from-gold/40 via-gold/20 to-transparent rounded-full mb-10" />
            )}

            {/* Article header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {entry.category && (
                        <p className="section-label mb-0">{entry.category}</p>
                    )}
                    {entry.partOfSpeech && (
                        <span className="text-xs text-gold/70 font-mono uppercase tracking-widest bg-gold/5 border border-gold/15 px-3 py-1 rounded-sm">
                            {entry.partOfSpeech}
                        </span>
                    )}
                    <span className="text-xs text-parchment-muted font-mono ml-auto">
                        {readingTime} min read
                    </span>
                </div>

                <h1 className="heading-serif text-5xl md:text-7xl font-bold leading-none mb-4">
                    {entry.term}
                </h1>

                {entry.pronunciation && (
                    <p className="text-parchment-muted font-mono text-sm tracking-wide">
                        /{entry.pronunciation}/
                    </p>
                )}
            </header>

            <div className="gold-rule mb-10" />

            {/* Definition */}
            <section className="mb-12">
                <p className="section-label">Ìtumọ̀</p>
                <p className="text-parchment text-xl leading-relaxed font-light">
                    {entry.definition}
                </p>
            </section>

            {/* Body — structured article sections */}
            {entry.body && entry.body.length > 0 && (
                <section className="mb-12 space-y-10">
                    {entry.body.map((section, i) => (
                        <div key={i} className="group">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-px h-5 bg-gold/50 group-hover:bg-gold transition-colors duration-300" />
                                <h2 className="font-serif text-parchment text-xl font-semibold">
                                    {section.heading}
                                </h2>
                            </div>
                            <p className="text-parchment-dim leading-relaxed pl-4 border-l border-gold/15 group-hover:border-gold/30 transition-colors duration-300">
                                {section.text}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            {/* Tags */}
            {entry.tags.length > 0 && (
                <section className="mb-10 pt-8 border-t border-gold/10">
                    <p className="section-label mb-3">Àwọn Àmì</p>
                    <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                            <TagBadge key={tag} tag={tag} />
                        ))}
                    </div>
                </section>
            )}

            {/* Related Terms */}
            {relatedEntries.length > 0 && (
                <section className="mb-10">
                    <p className="section-label mb-4">Àwọn Ọ̀rọ̀ Tó Ní Í Ṣe</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {relatedEntries.map(({ entry: rel, locale: relLocale }) => {
                            const href =
                                relLocale === "yo"
                                    ? `/yo/glossary/${rel.slug}`
                                    : `/glossary/${rel.slug}`;
                            return (
                                <Link
                                    key={rel.slug}
                                    href={href}
                                    className="group flex flex-col justify-between px-4 py-4 bg-ink-800 border border-gold/10 rounded-sm hover:border-gold/35 hover:bg-ink-700 transition-all duration-200"
                                >
                                    <div>
                                        <p className="text-parchment text-sm font-serif font-semibold group-hover:text-gold transition-colors leading-snug mb-1">
                                            {rel.term}
                                        </p>
                                        {rel.category && (
                                            <p className="text-parchment-muted text-[10px] font-mono uppercase tracking-wider">
                                                {rel.category}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-parchment-dim text-xs mt-2 line-clamp-2 leading-relaxed">
                                        {rel.definition}
                                    </p>
                                    <span className="text-gold/30 group-hover:text-gold/70 transition-colors text-sm mt-3 block">
                                        →
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Cross-language banner */}
            {enEntry && (
                <div className="mt-12 p-5 border border-gold/20 bg-gradient-to-r from-gold/5 to-transparent rounded-sm flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <p className="text-gold text-xs font-mono uppercase tracking-widest mb-1">
                            English Version Available
                        </p>
                        <p className="text-parchment font-serif text-lg mb-0.5">{enEntry.term}</p>
                        <p className="text-parchment-dim text-sm line-clamp-2">{enEntry.definition}</p>
                    </div>
                    <Link href={`/glossary/${entry.slug}`} className="btn-ghost shrink-0 self-center">
                        Read in English →
                    </Link>
                </div>
            )}

            {/* Back */}
            <div className="mt-12 pt-8 border-t border-gold/10">
                <Link href="/yo/glossary" className="text-parchment-muted text-sm font-mono hover:text-parchment transition-colors">
                    ← Padà sí Àkójọ Ọ̀rọ̀
                </Link>
            </div>
        </div>
    );
}
