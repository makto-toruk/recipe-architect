import React from "react";
import type { Instruction } from "@/lib/recipe-types";

type Props = {
  instructions: Instruction[];
  focusModeEnabled?: boolean;
  checkedInstructions?: Set<string>;
  onInstructionCheck?: (key: string, checked: boolean) => void;
};

export default function RecipeInstructions({
  instructions,
  focusModeEnabled = false,
  checkedInstructions = new Set(),
  onInstructionCheck,
}: Props) {
  // Collect footnotes with continuous numbering
  const footnotes: { step: number; text: string }[] = [];
  const instructionsWithFootnotes = instructions.map((inst) => {
    const footnoteIndices: number[] = [];

    if (inst.notes && inst.notes.length > 0) {
      inst.notes.forEach((note) => {
        footnoteIndices.push(footnotes.length);
        footnotes.push({
          step: inst.step,
          text: note,
        });
      });
    }

    return { ...inst, footnoteIndices };
  });

  // Group instructions by their group field, preserving order
  const groupedInstructions = instructionsWithFootnotes.reduce(
    (acc, inst) => {
      const groupName = inst.group || "";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(inst);
      return acc;
    },
    {} as Record<string, Array<Instruction & { footnoteIndices?: number[] }>>
  );

  // Preserve source order: ungrouped first, then groups in order of first appearance
  const allGroups = Object.keys(groupedInstructions);
  const emptyGroup = allGroups.filter(g => g === "");
  const namedGroups = allGroups.filter(g => g !== "");
  const sortedGroups: string[] = [...emptyGroup, ...namedGroups];

  return (
    <section className="mt-8 lg:mt-0">
      <h2
        className="text-xl font-semibold mb-6"
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          color: 'var(--color-text-primary)'
        }}
      >
        Instructions
      </h2>

      {sortedGroups.map((groupName, groupIdx) => (
        <div key={groupName || `group-${groupIdx}`} className="mb-8">
          {/* Group heading if it exists */}
          {groupName && (
            <h3
              className="text-lg font-medium mb-4"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                color: 'var(--color-text-secondary)'
              }}
            >
              {groupName}
            </h3>
          )}

          <InstructionsList
            instructions={groupedInstructions[groupName]}
            focusModeEnabled={focusModeEnabled}
            checkedInstructions={checkedInstructions}
            onInstructionCheck={onInstructionCheck}
            keyPrefix={groupName || "main"}
          />
        </div>
      ))}

      {/* Footnotes with continuous numbering */}
      {footnotes.length > 0 && (
        <section className="mt-8 border-t pt-4" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <ol className="list-none space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {footnotes.map((fn, i) => (
              <li key={`${fn.step}`} className="flex">
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
  instructions: Array<Instruction & { footnoteIndices?: number[] }>;
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
                className="mt-1.5 w-4 h-4 rounded focus:ring-2 flex-shrink-0"
                style={{
                  accentColor: 'var(--color-burnt-orange)',
                  borderColor: 'var(--color-border-medium)'
                }}
              />
            )}

            <span
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${isChecked && focusModeEnabled ? "opacity-60" : ""}`}
              style={{
                backgroundColor: 'var(--color-cream)',
                color: 'var(--color-text-secondary)'
              }}
            >
              {inst.step}
            </span>
            <div className="flex flex-col">
              <p
                className={`leading-relaxed pt-0.5 ${isChecked && focusModeEnabled ? "line-through opacity-60" : ""}`}
                style={{ color: 'var(--color-text-primary)' }}
              >
                {inst.text}
                {inst.footnoteIndices && inst.footnoteIndices.length > 0 && (
                  <sup className="ml-1 align-super text-xs">
                    {inst.footnoteIndices.map((idx) => idx + 1).join('·')}
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
