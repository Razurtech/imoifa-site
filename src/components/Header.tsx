"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function getEquivalentHref(pathname: string, targetLocale: "en" | "yo"): string {
    const normalizedPath = pathname || "/";

    const pathWithoutLocale =
        normalizedPath.replace(/^\/(en|yo)(?=\/|$)/, "") || "/";

    if (targetLocale === "en") {
        return pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;
    }

    return pathWithoutLocale === "/" ? "/yo" : `/yo${pathWithoutLocale}`;
}

export default function Header() {
    const pathname = usePathname() || "/";
    const locale: "en" | "yo" = pathname.startsWith("/yo") ? "yo" : "en";

    const homeHref = locale === "yo" ? "/yo" : "/en";
    const glossaryHref = locale === "yo" ? "/yo/glossary" : "/en/glossary";

    const englishHref = getEquivalentHref(pathname, "en");
    const yorubaHref = getEquivalentHref(pathname, "yo");

    return (
        <header className="border-b border-amber-900/40 bg-black/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-8">
                    <Link href={homeHref} className="flex items-center gap-3">
                        <span className="border border-amber-700/70 bg-amber-950 px-3 py-1 text-amber-300">
                            Ifá
                        </span>
                        <span className="text-3xl font-semibold text-stone-100">
                            Imoifa
                        </span>
                    </Link>

                    <nav className="flex items-center gap-6 text-stone-300">
                        <Link href={homeHref} className="hover:text-amber-300">
                            {locale === "yo" ? "Ilé" : "Home"}
                        </Link>
                        <Link href={glossaryHref} className="hover:text-amber-300">
                            {locale === "yo" ? "Àkójọ Ọ̀rọ̀" : "Glossary"}
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2 rounded border border-amber-800/60 bg-stone-950 p-1 text-sm">
                    <Link
                        href={englishHref}
                        className={`rounded px-4 py-2 ${
                            locale === "en"
                                ? "bg-amber-700 text-black"
                                : "text-stone-300 hover:text-amber-300"
                        }`}
                    >
                        English
                    </Link>
                    <Link
                        href={yorubaHref}
                        className={`rounded px-4 py-2 ${
                            locale === "yo"
                                ? "bg-amber-700 text-black"
                                : "text-stone-300 hover:text-amber-300"
                        }`}
                    >
                        Yorùbá
                    </Link>
                </div>
            </div>
        </header>
    );
}
