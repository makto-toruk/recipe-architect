import { loadMarkdown } from "@/utils/loadMarkdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Cafe TM",
  description: "A quiet, structured recipe project built with care.",
};

export default async function AboutPage() {
  const html = await loadMarkdown("about.md");

  return (
    <div className="prose prose-neutral max-w-2xl mx-auto py-12 px-4">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
