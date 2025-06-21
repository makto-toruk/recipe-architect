import React from "react";
import type { Recipe } from "@/types";

type Props = {
  recipe: Recipe;
  subrecipes?: Recipe[];
  focusModeEnabled?: boolean;
  checkedInstructions?: Set<string>;
  onInstructionCheck?: (key: string, checked: boolean) => void;
};

export default function RecipeInstructions({
  recipe,
  subrecipes = [],
  focusModeEnabled = false,
  checkedInstructions = new Set(),
  onInstructionCheck,
}: Props) {
  const hasSubrecipes = recipe.subrecipes && recipe.subrecipes.length > 0;

  // Collect all footnotes from main recipe and subrecipes with continuous numbering
  const footnotes: { section: string; step: number; text: string }[] = [];
  let footnoteCounter = 0;

  // Helper function to process instructions and collect footnotes
  const processInstructions = (
    instructions: Recipe["instructions"],
    sectionName: string
  ) => {
    return instructions.map((inst) => {
      let footnoteIndex = -1;
      if (inst.note) {
        footnoteIndex = footnoteCounter;
        footnotes.push({
          section: sectionName,
          step: inst.step,
          text: inst.note,
        });
        footnoteCounter++;
      }
      return { ...inst, footnoteIndex };
    });
  };

  // Process subrecipe instructions first
  const processedSubrecipes = hasSubrecipes
    ? recipe.subrecipes
        ?.map((subrecipeRef) => {
          const subrecipe = subrecipes.find(
            (sub) => sub.id === subrecipeRef.ref
          );
          if (!subrecipe) return null;

          return {
            ...subrecipe,
            qty: subrecipeRef.qty,
            processedInstructions: processInstructions(
              subrecipe.instructions,
              subrecipe.title
            ),
          };
        })
        .filter(Boolean) || []
    : [];

  // Process main recipe instructions after subrecipes
  const mainInstructions = processInstructions(
    recipe.instructions,
    hasSubrecipes ? recipe.title : ""
  );

  return (
    <section className="mt-8 lg:mt-0">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Instructions</h2>

      {/* Subrecipe instructions first */}
      {processedSubrecipes.map((subrecipe, index) => (
        <details key={subrecipe!.id} open className="mb-8">
          <summary className="cursor-pointer text-lg font-medium mb-4 text-gray-800">
            For the {subrecipe!.title}
          </summary>
          <InstructionsList
            instructions={subrecipe!.processedInstructions}
            focusModeEnabled={focusModeEnabled}
            checkedInstructions={checkedInstructions}
            onInstructionCheck={onInstructionCheck}
            keyPrefix={`sub-${subrecipe!.id}`}
          />
        </details>
      ))}

      {/* Main recipe instructions */}
      {hasSubrecipes && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">And then</h3>
          <InstructionsList
            instructions={mainInstructions}
            focusModeEnabled={focusModeEnabled}
            checkedInstructions={checkedInstructions}
            onInstructionCheck={onInstructionCheck}
            keyPrefix="main"
          />
        </div>
      )}

      {!hasSubrecipes && (
        <InstructionsList
          instructions={mainInstructions}
          focusModeEnabled={focusModeEnabled}
          checkedInstructions={checkedInstructions}
          onInstructionCheck={onInstructionCheck}
          keyPrefix="main"
        />
      )}

      {/* Footnotes with continuous numbering */}
      {footnotes.length > 0 && (
        <section className="mt-8 border-t pt-4">
          <ol className="list-none space-y-2 text-sm text-gray-600">
            {footnotes.map((fn, i) => (
              <li key={`${fn.section}-${fn.step}`} className="flex">
                <sup className="mr-1 align-super text-xs">{i + 1}</sup>
                <span>{fn.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </section>
  );
}

// Helper component for rendering instruction lists
function InstructionsList({
  instructions,
  focusModeEnabled = false,
  checkedInstructions = new Set(),
  onInstructionCheck,
  keyPrefix = "",
}: {
  instructions: Array<Recipe["instructions"][0] & { footnoteIndex?: number }>;
  focusModeEnabled?: boolean;
  checkedInstructions?: Set<string>;
  onInstructionCheck?: (key: string, checked: boolean) => void;
  keyPrefix?: string;
}) {
  return (
    <ol className="space-y-6">
      {instructions.map((inst) => {
        const instructionKey = `${keyPrefix}-${inst.step}`;
        const isChecked = checkedInstructions.has(instructionKey);

        return (
          <li key={inst.step} className="flex gap-4">
            {/* Checkbox in focus mode */}
            {focusModeEnabled && (
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) =>
                  onInstructionCheck?.(instructionKey, e.target.checked)
                }
                className="mt-1.5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 flex-shrink-0"
              />
            )}

            <span
              className={`flex-shrink-0 w-7 h-7 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium ${isChecked && focusModeEnabled ? "opacity-60" : ""}`}
            >
              {inst.step}
            </span>
            <div className="flex flex-col">
              <p
                className={`text-gray-800 leading-relaxed pt-0.5 ${isChecked && focusModeEnabled ? "line-through opacity-60" : ""}`}
              >
                {inst.text}
                {inst.footnoteIndex !== undefined &&
                  inst.footnoteIndex >= 0 && (
                    <sup className="ml-1 align-super text-xs">
                      {inst.footnoteIndex + 1}
                    </sup>
                  )}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
