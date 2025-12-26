import type { Root, List } from "mdast";
import type { Instruction } from "@/lib/recipe-types";
import { extractText } from "./ast-parser";

/**
 * Parse instructions from markdown AST
 */
export function parseInstructions(ast: Root): Instruction[] {
  const instructions: Instruction[] = [];
  let inInstructionsSection = false;

  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];

    // Find ## Instructions heading
    if (node.type === "heading" && node.depth === 2) {
      const text = extractText(node);
      if (text === "Instructions") {
        inInstructionsSection = true;
        continue;
      } else if (inInstructionsSection) {
        // End of Instructions section
        break;
      }
      continue;
    }

    if (!inInstructionsSection) continue;

    // Process unordered list (bullets) as instruction steps
    if (node.type === "list" && !(node as List).ordered) {
      const listNode = node as List;

      listNode.children.forEach((listItem, stepIndex) => {
        const stepNumber = stepIndex + 1;
        const textParts: string[] = [];
        const footnotes: string[] = [];

        // Process all children of listItem
        for (const child of listItem.children) {
          if (child.type === "paragraph") {
            const text = extractText(child).trim();
            if (text) {
              textParts.push(text);
            }
          } else if (child.type === "list") {
            // All nested bullets are footnotes
            for (const nestedItem of (child as List).children) {
              const footnoteText = extractText(nestedItem).trim();
              if (footnoteText) {
                footnotes.push(footnoteText);
              }
            }
          }
        }

        if (textParts.length > 0) {
          instructions.push({
            step: stepNumber,
            text: textParts.join(" ").trim(),
            notes: footnotes.length > 0 ? footnotes : undefined,
          });
        }
      });

      // Only process first unordered list in Instructions section
      break;
    }
  }

  return instructions;
}
