import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export async function loadMarkdown(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "data", "content", filename);
  const fileContents = await fs.readFile(filePath, "utf8");

  const { content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  return processed.toString();
}
