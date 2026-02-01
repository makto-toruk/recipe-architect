import Image from "next/image";
import Link from "next/link";
import { CARD_BASE_CLASSES, CARD_BASE_STYLE } from "./card-styles";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  tags?: string[];
};

export default function RecipeCard({
  id,
  title,
  subtitle,
  heroImage,
  tags = [],
}: Props) {
  return (
    <Link
      href={`/recipes/${id}`}
      className={CARD_BASE_CLASSES}
      style={CARD_BASE_STYLE}
    >
      {heroImage ? (
        <Image
          src={heroImage}
          alt={title}
          width={480}
          height={320}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div
          className="w-full h-48 rounded-t-lg"
          style={{ backgroundColor: 'var(--color-cream-light)' }}
        />
      )}

      <div className="p-4">
        <h3
          className="text-lg font-medium"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            color: 'var(--color-text-primary)'
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <h4
            className="text-sm mt-1 truncate"
            title={subtitle}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {subtitle}
          </h4>
        )}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--color-sage-green)',
                  color: 'white'
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
