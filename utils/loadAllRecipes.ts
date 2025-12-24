import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const markdownDir = path.join(process.cwd(), "data/recipes/markdown");

type RecipeCard = {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
  first_made?: string;
  last_made?: string;
};

/** Fetch minimal fields for every recipe from markdown files. */
export async function loadAllRecipes(): Promise<RecipeCard[]> {
  try {
    const files = (await fs.readdir(markdownDir)).filter(
      (f) => f.endsWith(".md") && f !== "template.md"
    );

    return Promise.all(
      files.map(async (file) => {
        const text = await fs.readFile(path.join(markdownDir, file), "utf8");
        const { data: frontmatter } = matter(text);
        const slug = file.replace(/\.md$/, "");

        return {
          id: frontmatter.id || slug,
          title: frontmatter.title,
          subtitle: frontmatter.subtitle,
          image: frontmatter.image,
          tags: frontmatter.tags,
          first_made: frontmatter.first_made,
          last_made: frontmatter.last_made,
        };
      })
    );
  } catch (error) {
    console.warn("Could not load markdown recipes:", error);
    return [];
  }
}
