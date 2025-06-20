import type { Recipe, Ingredients, Units } from "@/types";
import { formatFraction } from "@/utils/fraction";

interface Props {
  recipe: Recipe;
  ingredients: Ingredients;
  units: Units;
  subrecipes?: Recipe[]; // Array of loaded subrecipe data
}

export default function RecipeIngredients({
  recipe,
  ingredients,
  units,
  subrecipes = [],
}: Props) {
  const hasSubrecipes = recipe.subrecipes && recipe.subrecipes.length > 0;

  return (
    <section className="mb-6 lg:mb-0">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Ingredients</h2>

      {/* Subrecipes first */}
      {hasSubrecipes &&
        recipe.subrecipes?.map((subrecipeRef, index) => {
          const subrecipe = subrecipes.find(
            (sub) => sub.id === subrecipeRef.ref
          );
          if (!subrecipe) return null;

          return (
            <div key={subrecipeRef.ref} className="mb-8">
              <h3 className="text-lg font-medium mb-2 text-gray-800">
                {subrecipe.title}
              </h3>
              <IngredientsList
                ingredientRefs={subrecipe.ingredients}
                ingredients={ingredients}
                units={units}
                multiplier={subrecipeRef.qty}
              />
            </div>
          );
        })}

      {/* Main recipe ingredients */}
      {hasSubrecipes && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            {recipe.title}
          </h3>
          <IngredientsList
            ingredientRefs={recipe.ingredients}
            ingredients={ingredients}
            units={units}
          />
        </div>
      )}

      {!hasSubrecipes && (
        <IngredientsList
          ingredientRefs={recipe.ingredients}
          ingredients={ingredients}
          units={units}
        />
      )}
    </section>
  );
}

// Helper component for rendering ingredient lists
function IngredientsList({
  ingredientRefs,
  ingredients,
  units,
  multiplier = { num: 1, den: 1 },
}: {
  ingredientRefs: Recipe["ingredients"];
  ingredients: Ingredients;
  units: Units;
  multiplier?: { num: number; den: number };
}) {
  return (
    <ul className="space-y-4">
      {ingredientRefs.map((ing, i) => {
        const name = ingredients[ing.ref]?.name ?? ing.ref;
        const unitName = units[ing.unit]?.name ?? ing.unit;

        // Apply multiplier for subrecipes
        const adjustedQty = {
          num: ing.qty.num * multiplier.num,
          den: ing.qty.den * multiplier.den,
        };
        const qtyDisplay = formatFraction(adjustedQty.num, adjustedQty.den);

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
  );
}
