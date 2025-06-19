type Ingredient = {
  ref: string;
  qty: number;
  unit: string;
  note?: string;
};

type Props = {
  recipe: { ingredients: Ingredient[] };
  ingredients: Record<string, { name: string }>;
  units: Record<string, { name: string }>;
};

export default function RecipeIngredients({
  recipe,
  ingredients,
  units,
}: Props) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="list-disc pl-5 space-y-1">
        {recipe.ingredients.map((ing, i) => {
          const name = ingredients[ing.ref]?.name ?? ing.ref;
          const unit = units[ing.unit]?.name ?? ing.unit;
          return (
            <li key={i}>
              {ing.qty} {unit} {name}
              {ing.note && <span className="text-gray-600"> ({ing.note})</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
