import type { Ingredient } from "@/lib/recipe-types";

interface Props {
  ingredients: Ingredient[];
  focusModeEnabled?: boolean;
  checkedIngredients?: Set<string>;
  onIngredientCheck?: (key: string, checked: boolean) => void;
}

export default function RecipeIngredients({
  ingredients,
  focusModeEnabled = false,
  checkedIngredients = new Set(),
  onIngredientCheck,
}: Props) {
  // Group ingredients by their group field, preserving order
  const groupedIngredients = ingredients.reduce(
    (acc, ing) => {
      const groupName = ing.group || "";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(ing);
      return acc;
    },
    {} as Record<string, Ingredient[]>
  );

  // Preserve source order: ungrouped first, then groups in order of first appearance
  const allGroups = Object.keys(groupedIngredients);
  const sortedGroups = allGroups.filter(g => g === "").concat(allGroups.filter(g => g !== ""));

  return (
    <section className="mb-6 lg:mb-0">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Ingredients</h2>

      {sortedGroups.map((groupName, groupIdx) => (
        <div key={groupName || `group-${groupIdx}`} className="mb-8">
          {/* Group heading if it exists */}
          {groupName && (
            <h3 className="text-lg font-medium mb-2 text-gray-800">
              {groupName}
            </h3>
          )}

          <IngredientsList
            ingredients={groupedIngredients[groupName]}
            focusModeEnabled={focusModeEnabled}
            checkedIngredients={checkedIngredients}
            onIngredientCheck={onIngredientCheck}
            keyPrefix={groupName || "main"}
          />
        </div>
      ))}
    </section>
  );
}

// Helper component for rendering ingredient lists
function IngredientsList({
  ingredients,
  focusModeEnabled = false,
  checkedIngredients = new Set(),
  onIngredientCheck,
  keyPrefix = "",
}: {
  ingredients: Ingredient[];
  focusModeEnabled?: boolean;
  checkedIngredients?: Set<string>;
  onIngredientCheck?: (key: string, checked: boolean) => void;
  keyPrefix?: string;
}) {
  return (
    <ul className="space-y-4">
      {ingredients.map((ing, i) => {
        const ingredientKey = `${keyPrefix}-${i}-${ing.name}`;
        const isChecked = checkedIngredients.has(ingredientKey);

        return (
          <li key={i} className="flex items-start gap-3">
            {/* Checkbox in focus mode */}
            {focusModeEnabled && (
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) =>
                  onIngredientCheck?.(ingredientKey, e.target.checked)
                }
                className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            )}

            <div
              className={`flex flex-col gap-1 flex-grow ${isChecked && focusModeEnabled ? "opacity-60" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-gray-900 ${isChecked && focusModeEnabled ? "line-through" : ""}`}
                >
                  {ing.name}
                </span>
                <span
                  className={`text-sm font-medium text-gray-600 ml-2 flex-shrink-0 ${isChecked && focusModeEnabled ? "line-through" : ""}`}
                >
                  {ing.quantity} {ing.unit}
                </span>
              </div>
              {ing.note && (
                <span
                  className={`text-sm text-gray-500 italic ${isChecked && focusModeEnabled ? "line-through" : ""}`}
                >
                  {ing.note}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
