export const metadata = {
  title: "Kitchen Lab | Recipe Architect",
  description: "Explore our ever-evolving family recipes",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-light italic mb-10 text-gray-900">
          Kitchen Lab
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Discover, create, and share your favorite recipes.
        </p>
        <a
          href="/recipes"
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
        >
          Browse Recipes
        </a>
      </div>
    </main>
  );
}
