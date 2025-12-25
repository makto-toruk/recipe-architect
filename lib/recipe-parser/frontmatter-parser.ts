import matter from "gray-matter";

/**
 * Parse YAML frontmatter from markdown file contents
 */
export function parseFrontmatter(fileContents: string) {
  const { data: frontmatter, content } = matter(fileContents);
  return { frontmatter, content };
}
