import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gold/10 bg-ink-900">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-serif text-parchment text-lg mb-2">Imoifa</h3>
                        <p className="text-parchment-muted text-sm leading-relaxed">
                            A cultural and educational archive exploring Ifá, Yorùbá philosophy,
                            language, spirituality, and history.
                        </p>
                    </div>

                    {/* English Links */}
                    <div>
                        <p className="section-label">Archive</p>
                        <ul className="space-y-2">
                            {[
                                { label: "Home", href: "/" },
                                { label: "Glossary", href: "/glossary" },
                            ].map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-parchment-muted text-sm hover:text-parchment transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Yorùbá Links */}
                    <div>
                        <p className="section-label">Yorùbá</p>
                        <ul className="space-y-2">
                            {[
                                { label: "Ilé", href: "/yo" },
                                { label: "Àkójọ Ọ̀rọ̀", href: "/yo/glossary" },
                            ].map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-parchment-muted text-sm hover:text-parchment transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="gold-rule pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-parchment-muted text-xs font-mono">
                        © {new Date().getFullYear()} Imoifa. All rights reserved.
                    </p>
                    <p className="text-parchment-muted/50 text-xs font-mono">
                        Àṣà · Culture · Archive
                    </p>
                </div>
            </div>
        </footer>
    );
}
