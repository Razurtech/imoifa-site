function getEquivalentHref(pathname: string, targetLocale: "en" | "yo"): string {
    const normalizedPath = pathname || "/";

    const pathWithoutLocale =
        normalizedPath.replace(/^\/(en|yo)(?=\/|$)/, "") || "/";

    if (targetLocale === "en") {
        return pathWithoutLocale === "/" ? "/en" : `/en${pathWithoutLocale}`;
    }

    return pathWithoutLocale === "/" ? "/yo" : `/yo${pathWithoutLocale}`;
}
