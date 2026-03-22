import type { Metadata } from "next";
import Link from "next/link";
import { getAllEntries } from "@/lib/glossary";

export const metadata: Metadata = {
    title: "Ilé — Imoifa",
    description:
        "Àwọn ẹ̀kọ́ Ifá, ìmọ̀-ọgbọ́n Yorùbá, àṣà, ẹ̀mí, àti ìtàn ní èdè Yorùbá.",
};

export default function YorubaHomePage() {
    const featuredEntries = getAllEntries("yo").slice(0, 2);

    return (
        <div className="max-w-6xl mx-auto px-6">
            {/* Language indicator */}
            <div className="pt-8 pb-2 flex items-center gap-2">
                <span className="text-xs text-gold/60 font-mono uppercase tracking-widest border border-gold/20 px-2 py-0.5 rounded-sm">
                    Yorùbá
                </span>
                <Link href="/" className="text-parchment-muted text-xs font-mono hover:text-parchment transition-colors">
                    ← English Version
                </Link>
            </div>

            {/* Hero */}
            <section className="relative py-20 md:py-28 text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none" />
                <p className="section-label mb-4">Àkójọpọ̀ Àṣà Ifá</p>
                <h1 className="heading-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl mx-auto leading-[1.1]">
                    Ìmọ̀ Tí Ó Ṣì
                    <br />
                    <span className="text-gold">Wà Láàyè</span>
                </h1>
                <p className="text-parchment-dim text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                    Iléeṣẹ́ àkójọpọ̀ àti ẹ̀kọ́ tí a ti yà sí ìtọ́jú, ìtumọ̀, àti
                    ìgbéga ìmọ̀ Ifá — tí ó ti gbékalẹ̀ nínú àṣà ẹnu Yorùbá.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link href="/yo/glossary" className="btn-gold">
                        Àkójọ Ọ̀rọ̀
                    </Link>
                    <Link href="/" className="btn-ghost">
                        English Version
                    </Link>
                </div>
            </section>

            {/* Divider */}
            <div className="gold-rule my-2" />

            {/* Featured */}
            <section className="py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="section-label">Àwọn Ọ̀rọ̀ Àkànṣe</p>
                        <h2 className="heading-serif text-2xl font-semibold">
                            Láti Inú Àkójọpọ̀
                        </h2>
                    </div>
                    <Link
                        href="/yo/glossary"
                        className="text-gold text-sm font-mono hover:underline underline-offset-4 hidden sm:block"
                    >
                        Wo gbogbo →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredEntries.map((entry) => (
                        <Link
                            key={entry.slug}
                            href={`/yo/glossary/${entry.slug}`}
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
        </div>
    );
}
