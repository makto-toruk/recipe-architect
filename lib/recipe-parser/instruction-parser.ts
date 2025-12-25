import type { Root, List } from "mdast";
import type { Instruction } from "@/lib/recipe-types";
import { extractText } from "./ast-parser";

/**
 * Parse instructions from markdown AST
 */
export function parseInstructions(ast: Root): Instruction[] {
  const instructions: Instruction[] = [];
  let inInstructionsSection = false;
  let currentStep: number | null = null;
  let currentText: string[] = [];
  let currentNote: string | undefined;

  const saveCurrentInstruction = () => {
    if (currentStep !== null && currentText.length > 0) {
      instructions.push({
        step: currentStep,
        text: currentText.join(" ").trim(),
        note: currentNote,
      });
    }
  };

  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];

    // Find ## Instructions heading
    if (node.type === "heading" && node.depth === 2) {
      const text = extractText(node);
      if (text === "Instructions") {
        inInstructionsSection = true;
        continue;
      } else if (inInstructionsSection) {
        // Save last instruction before leaving section
        saveCurrentInstruction();
        break;
      }
      continue;
    }

    if (!inInstructionsSection) continue;

    // H3 headings start new instruction steps
    if (node.type === "heading" && node.depth === 3) {
      // Save previous instruction if exists
      saveCurrentInstruction();

      // Parse new instruction header: "1. Step Name" or just "1."
      const headerText = extractText(node);
      const match = headerText.match(/^(\d+)\./);
      currentStep = match ? parseInt(match[1], 10) : instructions.length + 1;
      currentText = [];
      currentNote = undefined;
      continue;
    }

    // Only process content if we have a current step
    if (currentStep === null) continue;

    // Collect paragraph content for current instruction
    if (node.type === "paragraph") {
      const text = extractText(node).trim();

      // Check if this looks like a footnote (text in parentheses)
      if (text.match(/^\(.+\)$/)) {
        currentNote = text.replace(/^\(|\)$/g, "");
      } else if (text) {
        currentText.push(text);
      }
      continue;
    }

    // Handle bullet lists within instructions
    if (node.type === "list") {
      for (const item of (node as List).children) {
        const text = extractText(item).trim();
        if (text) {
          currentText.push("• " + text);
        }
      }
    }
  }

  // Save last instruction
  saveCurrentInstruction();

  return instructions;
}
