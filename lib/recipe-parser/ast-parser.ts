/**
 * Extract plain text from an AST node recursively
 */
export function extractText(node: any): string {
  if (node.type === "text") {
    return node.value;
  }

  if (node.type === "inlineCode") {
    return node.value;
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }

  return "";
}
