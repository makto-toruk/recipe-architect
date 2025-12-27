import { loadMarkdown } from "@/lib/loadMarkdown";
import { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About | Cafe TM",
  description: "A quiet, structured recipe project built with care.",
};

export default async function AboutPage() {
  const html = await loadMarkdown("about.md");

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream-lightest)' }}>
      <SiteHeader />
      <main className="min-h-screen py-12 flex-grow" style={{ backgroundColor: 'var(--color-cream-lightest)' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <article className="prose prose-lg prose-gray">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </div>
      </main>
    </div>
  );
}
