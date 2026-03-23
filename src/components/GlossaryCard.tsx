import Link from "next/link";
import Image from "next/image";
import type { GlossaryEntry } from "@/lib/glossary";

type Props = {
    entry: GlossaryEntry;
    locale?: "en" | "yo";
};

export default function GlossaryCard({ entry, locale = "en" }: Props) {
    const basePath = locale === "yo" ? "/yo/glossary" : "/en/glossary";
    const href = `${basePath}/${entry.slug}`;

    return (
        <Link
            href={href}
            className="block group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60 rounded-sm"
        >
            <article className="relative bg-ink-800 border border-gold/10 rounded-sm overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:border-gold/35 group-hover:shadow-xl group-hover:shadow-gold/5 group-hover:-translate-y-0.5">
                {entry.thumbnail ? (
                    <div className="relative w-full h-36 overflow-hidden bg-ink-700">
                        <Image
                            src={entry.thumbnail}
                            alt={entry.term}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-800/60 via-transparent to-transparent" />
                    </div>
                ) : (
                    <div className="h-0.5 w-full bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0 group-hover:via-gold/60 transition-all duration-500" />
                )}

                <div className="flex flex-col gap-2.5 p-5 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h2 className="font-serif text-parchment text-lg font-semibold leading-snug relative inline-block">
                                {entry.term}
                                <span className="absolute bottom-0 left-0 h-px bg-gold w-0 group-hover:w-full transition-all duration-300" />
                            </h2>

                            {entry.pronunciation && (
                                <p className="text-parchment-muted text-[11px] font-mono mt-0.5 tracking-wide">
                                    /{entry.pronunciation}/
                                </p>
                            )}
                        </div>

                        <span className="shrink-0 text-[10px] text-gold/70 font-mono uppercase tracking-widest bg-gold/8 border border-gold/15 px-2 py-0.5 rounded-sm mt-0.5">
                            {entry.partOfSpeech}
                        </span>
                    </div>

                    <p className="text-gold/50 text-[10px] font-mono uppercase tracking-[0.2em]">
                        {entry.category}
                    </p>

                    <p className="text-parchment-dim text-sm leading-relaxed line-clamp-3 flex-1">
                        {entry.definition}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gold/8">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {entry.tags.slice(0, 3).map((tag, i) => (
                                <span key={tag} className="flex items-center gap-1.5">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-mono bg-ink-700 text-gold/70 border border-gold/15 group-hover:border-gold/30 group-hover:text-gold/90 transition-colors duration-200">
                                        {tag}
                                    </span>
                                    {i < Math.min(entry.tags.length, 3) - 1 && (
                                        <span className="text-gold/20 text-[10px]">·</span>
                                    )}
                                </span>
                            ))}
                            {entry.tags.length > 3 && (
                                <span className="text-parchment-muted/50 text-[10px] font-mono">
                                    +{entry.tags.length - 3}
                                </span>
                            )}
                        </div>

                        <span className="text-gold/30 group-hover:text-gold/80 group-hover:translate-x-0.5 transition-all duration-200 text-base leading-none">
                            →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
