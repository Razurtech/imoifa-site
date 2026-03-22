"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
];

const YO_NAV_LINKS = [
    { label: "Ilé", href: "/yo" },
    { label: "Àkójọ Ọ̀rọ̀", href: "/yo/glossary" },
];

/** Resolves the equivalent page in the other locale. */
function getEquivalentHref(pathname: string, targetLocale: "en" | "yo"): string {
    const isYo = pathname.startsWith("/yo");
    if (targetLocale === "yo") {
        return isYo ? pathname : `/yo${pathname === "/" ? "" : pathname}`;
    } else {
        return isYo ? pathname.replace(/^\/yo/, "") || "/" : pathname;
    }
}

export default function Header() {
    const pathname = usePathname();
    const isYoruba = pathname.startsWith("/yo");
    const navLinks = isYoruba ? YO_NAV_LINKS : NAV_LINKS;

    const enHref = getEquivalentHref(pathname, "en");
    const yoHref = getEquivalentHref(pathname, "yo");

    return (
        <header className="sticky top-0 z-50 bg-ink-950/95 backdrop-blur-sm border-b border-gold/10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href={isYoruba ? "/yo" : "/"} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-gold/10 border border-gold/30 rounded-sm flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <span className="text-gold font-serif text-sm font-bold">Ifá</span>
                    </div>
                    <span className="text-parchment font-serif text-xl font-semibold tracking-wide">
                        Imoifa
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map(({ label, href }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`text-sm font-medium transition-colors duration-200 ${active ? "text-gold" : "text-parchment-muted hover:text-parchment"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 p-1 bg-ink-800 border border-gold/15 rounded-sm">
                    <Link
                        href={enHref}
                        aria-current={!isYoruba ? "true" : undefined}
                        className={`px-3 py-1 text-xs font-mono rounded-sm transition-all duration-200 ${!isYoruba
                                ? "bg-gold text-ink-950 font-semibold"
                                : "text-parchment-muted hover:text-parchment hover:bg-gold/5"
                            }`}
                    >
                        English
                    </Link>
                    <Link
                        href={yoHref}
                        aria-current={isYoruba ? "true" : undefined}
                        className={`px-3 py-1 text-xs font-mono rounded-sm transition-all duration-200 ${isYoruba
                                ? "bg-gold text-ink-950 font-semibold"
                                : "text-parchment-muted hover:text-parchment hover:bg-gold/5"
                            }`}
                    >
                        Yorùbá
                    </Link>
                </div>
            </div>
        </header>
    );
}
