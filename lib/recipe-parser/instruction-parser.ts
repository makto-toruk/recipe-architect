import type { Root, List } from "mdast";
import type { Instruction } from "@/lib/recipe-types";
import { extractText } from "./ast-parser";

/**
 * Parse instructions from markdown AST
 */
export function parseInstructions(ast: Root): Instruction[] {
  const instructions: Instruction[] = [];
  let inInstructionsSection = false;
  let currentGroup: string | undefined;
  let stepCounter = 1;

  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];

    // Find ## Instructions heading
    if (node.type === "heading" && node.depth === 2) {
      const text = extractText(node);
      if (text === "Instructions") {
        inInstructionsSection = true;
      } else if (inInstructionsSection) {
        // Exit instructions section at next H2
        break;
      }
      continue;
    }

    if (!inInstructionsSection) continue;

    // Track H3 subheadings as groups
    if (node.type === "heading" && node.depth === 3) {
      currentGroup = extractText(node).replace(/:$/, ""); // Remove trailing colon
      continue;
    }

    // Process unordered list (bullets) as instruction steps
    if (node.type === "list" && !(node as List).ordered) {
      const listNode = node as List;

      listNode.children.forEach((listItem) => {
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
            step: stepCounter++,
            text: textParts.join(" ").trim(),
            notes: footnotes.length > 0 ? footnotes : undefined,
            group: currentGroup,
          });
        }
      });
    }
  }

  return instructions;
}
