import type { Recipe, Ingredients, Units } from "@/types";
import { formatFraction } from "@/utils/fraction";

type Props = {
  recipe: Recipe;
  ingredients: Ingredients;
  units: Units;
};

export default function RecipeIngredients({
  recipe,
  ingredients,
  units,
}: Props) {
  return (
    <section className="mb-6 lg:mb-0">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Ingredients</h2>
      <ul className="space-y-4">
        {recipe.ingredients.map((ing, i) => {
          const name = ingredients[ing.ref]?.name ?? ing.ref;
          const unitName = units[ing.unit]?.name ?? ing.unit;
          const qtyDisplay = formatFraction(ing.qty.num, ing.qty.den);

          return (
            <li key={i} className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <span className="text-gray-900">{name}</span>
                <span className="text-sm font-medium text-gray-600 ml-2 flex-shrink-0">
                  {qtyDisplay} {unitName}
                </span>
              </div>
              {ing.note && (
                <span className="text-sm text-gray-500 italic">{ing.note}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
