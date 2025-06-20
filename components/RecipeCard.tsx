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
      className="block rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
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
        <div className="w-full h-48 bg-gray-100 rounded-t-lg" />
      )}

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {subtitle && (
          <h4 className="text-sm text-gray-600 mt-1 truncate" title={subtitle}>
            {subtitle}
          </h4>
        )}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
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
