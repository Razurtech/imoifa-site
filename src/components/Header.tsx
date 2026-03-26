function getEquivalentHref(pathname: string, targetLocale: "en" | "yo"): string {
    const normalizedPath = pathname || "/";

    // Strip any existing locale prefix first.
    const pathWithoutLocale =
        normalizedPath.replace(/^\/(en|yo)(?=\/|$)/, "") || "/";

    // Rebuild with the requested locale.
    if (targetLocale === "en") {
        return pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;
    }

    return pathWithoutLocale === "/" ? "/yo" : `/yo${pathWithoutLocale}`;
}
