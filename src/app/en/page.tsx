import type { Metadata } from "next";
import Link from "next/link";
import { getAllEntries } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore Ifá, Yorùbá philosophy, language, and history through the Imoifa cultural archive.",
};

export default function HomePage() {
  const featuredEntries = getAllEntries("en").slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <section className="relative py-24 md:py-32 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none rounded-b-3xl" />
        <p className="section-label mb-4">Ifá Cultural Archive</p>
        <h1 className="heading-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl mx-auto leading-[1.1]">
          The Living Knowledge
          <br />
          <span className="text-gold">of Ifá</span>
        </h1>
        <p className="text-parchment-dim text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          An archive dedicated to preserving and illuminating the depth of Yorùbá
          philosophy, spirituality, language, and history — rooted in the Ifá
          oral tradition.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/glossary" className="btn-gold">
            Explore the Glossary
          </Link>
          <Link href="/yo" className="btn-ghost">
            Yorùbá Version
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="gold-rule my-2" />

      {/* Featured Entries */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="section-label">Featured Entries</p>
            <h2 className="heading-serif text-2xl font-semibold">
              From the Archive
            </h2>
          </div>
          <Link
            href="/glossary"
            className="text-gold text-sm font-mono hover:underline underline-offset-4 hidden sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredEntries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/glossary/${entry.slug}`}
              className="block group card-base card-hover p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold font-serif text-lg font-semibold group-hover:text-gold-light transition-colors">
                  {entry.term}
                </span>
                <span className="text-xs text-parchment-muted font-mono">{entry.partOfSpeech}</span>
              </div>
              <p className="text-parchment-dim text-sm leading-relaxed line-clamp-2">
                {entry.definition}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className="py-16 border-t border-gold/10">
        <div className="max-w-3xl">
          <p className="section-label">About Imoifa</p>
          <h2 className="heading-serif text-2xl font-semibold mb-4">
            A Living Archive
          </h2>
          <p className="text-parchment-dim leading-relaxed mb-4">
            Imoifa is a cultural and educational platform dedicated to the
            preservation, translation, and promotion of Ifá knowledge. Drawing
            from oral tradition, scholarly research, and the community of
            practitioners worldwide, we aim to make this profound heritage
            accessible to all.
          </p>
          <p className="text-parchment-dim leading-relaxed">
            Available in both English and Yorùbá, each entry is carefully
            researched, contextualised, and cross-referenced — offering a
            rigorous yet accessible entry point into one of humanity&apos;s most
            ancient and complete philosophical systems.
          </p>
        </div>
      </section>
    </div>
  );
}
