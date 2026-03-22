type Props = {
    tag: string;
    onClick?: (tag: string) => void;
    active?: boolean;
};

export default function TagBadge({ tag, onClick, active = false }: Props) {
    if (onClick) {
        return (
            <button
                onClick={() => onClick(tag)}
                className={`tag-badge cursor-pointer ${active
                        ? "bg-gold/25 border-gold/50 text-gold"
                        : "hover:bg-gold/15"
                    }`}
                aria-pressed={active}
            >
                {tag}
            </button>
        );
    }

    return (
        <span className="tag-badge">
            {tag}
        </span>
    );
}
