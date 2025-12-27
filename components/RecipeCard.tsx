import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
};

export default function RecipeCard({
  id,
  title,
  subtitle,
  image,
  tags = [],
}: Props) {
  return (
    <Link
      href={`/recipes/${id}`}
      className="block rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 bg-white border border-[color:var(--color-border-subtle)]"
      style={{
        backgroundColor: 'var(--color-cream-lightest)',
        borderColor: 'var(--color-border-subtle)'
      }}
    >
      {image ? (
        <Image
          src={`/images/${image}`}
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
