import { loadMarkdown } from "@/utils/loadMarkdown";
import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "About | Cafe TM",
  description: "A quiet, structured recipe project built with care.",
};

export default async function AboutPage() {
  const html = await loadMarkdown("about.md");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="min-h-screen bg-white py-12 flex-grow">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <article className="prose prose-lg prose-gray">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </div>
      </main>
    </div>
  );
}
