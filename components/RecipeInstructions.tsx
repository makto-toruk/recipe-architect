import type { Recipe } from "@/types";

type Props = {
  recipe: Recipe;
};

export default function RecipeInstructions({ recipe }: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Instructions</h2>
      <ol className="space-y-6">
        {recipe.instructions.map((inst) => (
          <li key={inst.step} className="flex gap-4">
            <span className="flex-shrink-0 w-7 h-7 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
              {inst.step}
            </span>
            <p className="text-gray-800 leading-relaxed pt-0.5">{inst.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
