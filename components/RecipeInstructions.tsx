import React from "react";
import type { Recipe } from "@/types";

type Props = { recipe: Recipe };

export default function RecipeInstructions({ recipe }: Props) {
  // Collect all notes in order
  const footnotes: { step: number; text: string }[] = [];
  recipe.instructions.forEach((inst) => {
    if (inst.note) {
      footnotes.push({ step: inst.step, text: inst.note });
    }
  });

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Instructions</h2>
      <ol className="space-y-6">
        {recipe.instructions.map((inst) => {
          // Determine footnote index for this step (if any)
          const noteIndex = footnotes.findIndex((f) => f.step === inst.step);
          const hasNote = noteIndex > -1;

          return (
            <li key={inst.step} className="flex gap-4">
              <span className="flex-shrink-0 w-7 h-7 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                {inst.step}
              </span>
              <div className="flex flex-col">
                <p className="text-gray-800 leading-relaxed pt-0.5">
                  {inst.text}
                  {hasNote && (
                    <sup className="ml-1 align-super text-xs">
                      {noteIndex + 1}
                    </sup>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {footnotes.length > 0 && (
        <section className="mt-8 border-t pt-4">
          <ol className="list-none space-y-2 text-sm text-gray-600">
            {footnotes.map((fn, i) => (
              <li key={fn.step} className="flex">
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
