type Props = {
  recipe: {
    title: string;
    tags?: string[];
    image?: string;
    first_made?: string;
    last_made?: string;
  };
};

export default function RecipeHeader({ recipe }: Props) {
  const { title, tags, image, first_made, last_made } = recipe;

  return (
    <header className="mb-6">
      {image && (
        <img
          src={`/images/${image}`}
          alt={title}
          className="w-full h-auto rounded-lg mb-4"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{title}</h1>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 text-gray-800 px-2 py-1 text-sm rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {(first_made || last_made) && (
        <p className="text-sm text-gray-600">
          {first_made === last_made
            ? `First made: ${first_made}`
            : `First made: ${first_made}, Last made: ${last_made}`}
        </p>
      )}
    </header>
  );
}
