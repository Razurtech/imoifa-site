"use client";

import { useState } from "react";

type Props = {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({
    placeholder = "Search the archive…",
    value,
    onChange,
}: Props) {
    const [focused, setFocused] = useState(false);

    return (
        <div className={`relative transition-all duration-200 ${focused ? "scale-[1.01]" : ""}`}>
            {/* Search Icon */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className="w-4 h-4 text-parchment-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                    />
                </svg>
            </div>

            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="input-search pl-10 pr-4"
            />

            {/* Clear button */}
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-muted hover:text-parchment transition-colors"
                    aria-label="Clear search"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
