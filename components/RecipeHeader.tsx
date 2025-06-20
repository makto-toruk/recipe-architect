import type { Recipe } from "@/types";

type Props = {
  recipe: Recipe;
};

export default function RecipeHeader({ recipe }: Props) {
  const { title, tags, image, first_made, last_made, source, time, servings } =
    recipe;

  return (
    <header className="mb-8">
      {image && (
        <div className="w-full max-w-2xl mx-auto mb-6">
          <img
            src={`/images/${image}`}
            alt={title}
            className="w-full h-auto max-h-96 object-cover rounded-lg"
          />
        </div>
      )}

      <h1 className="text-4xl font-light italic mb-4 text-gray-900">{title}</h1>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 text-center mb-4">
        {[
          (first_made || last_made) &&
            (first_made === last_made
              ? `First made: ${first_made}`
              : `First made: ${first_made}${last_made ? `, Last made: ${last_made}` : ""}`),
          servings && `Servings: ${servings}`,
          time && `Time needed: ${time}`,
          source && (
            <>
              {source.type}:{" "}
              {source.url ? (
                <a
                  href={source.url}
                  className="underline text-gray-500 hover:text-gray-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.label}
                </a>
              ) : (
                source.label
              )}
            </>
          ),
        ]
          .filter(Boolean)
          .map((item, index, array) => (
            <span key={index}>
              {item}
              {index < array.length - 1 && <span className="mx-3">|</span>}
            </span>
          ))}
      </div>
    </header>
  );
}
