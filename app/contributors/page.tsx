import { loadAllContributors } from "@/lib/contributors";
import ContributorCard from "@/components/ContributorCard";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Contributors | Cafe TM",
  description: "Meet the contributors to our recipe collection",
};

export default async function ContributorsPage() {
  const contributors = await loadAllContributors();

  // Sort contributors alphabetically by name
  const sortedContributors = contributors.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-cream-lightest)" }}
    >
      <SiteHeader />
      <main
        className="min-h-screen py-12"
        style={{ backgroundColor: "var(--color-cream-lightest)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h1
            className="text-4xl font-light mb-8"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              color: "var(--color-text-primary)",
            }}
          >
            Contributors
          </h1>

          {sortedContributors.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {sortedContributors.map((contributor) => (
                <ContributorCard key={contributor.id} {...contributor} />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <p className="text-lg">No contributors yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
