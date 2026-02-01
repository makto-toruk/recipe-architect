"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/recipe-types";
import { Clock, Users, ChevronUp, ChevronDown } from "lucide-react";
import { formatDate } from "@/components/utils/formatDate";
import Link from "next/link";
import RecipeGallery from "./RecipeGallery";

function renderStoryWithLinks(story: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(story)) !== null) {
    if (match.index > lastIndex) {
      parts.push(story.slice(lastIndex, match.index));
    }
    const [, text, url] = match;
    const isInternal = url.startsWith("/");
    parts.push(
      isInternal ? (
        <Link
          key={match.index}
          href={url}
          className="underline transition-colors"
          style={{ color: "var(--color-burnt-orange)" }}
        >
          {text}
        </Link>
      ) : (
        <a
          key={match.index}
          href={url}
          className="underline transition-colors"
          style={{ color: "var(--color-burnt-orange)" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      )
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < story.length) {
    parts.push(story.slice(lastIndex));
  }

  return parts.length > 0 ? parts : story;
}

type Props = {
  recipe: Recipe;
  focusModeEnabled?: boolean;
};

export default function RecipeMetadata({
  recipe,
  focusModeEnabled = false,
}: Props) {
  const {
    title,
    subtitle,
    tags,
    galleryImages,
    first_made,
    last_made,
    source,
    time,
    yields,
    story,
  } = recipe;
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);
  // Only show Read more/less toggle for stories longer than ~200 characters (roughly 2-3 lines)
  const isLongStory = story && story.length > 200;

  return (
    <header className="mb-8">
      {/* Gallery - hidden in focus mode */}
      {galleryImages && galleryImages.length > 0 && !focusModeEnabled && (
        <RecipeGallery images={galleryImages} title={title} />
      )}

      {/* Title */}
      <div className="mb-4">
        <h1
          className="text-4xl font-light italic"
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            color: 'var(--color-text-primary)'
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2
            className="text-lg font-normal mt-1 whitespace-normal"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {subtitle}
          </h2>
        )}
      </div>

      {/* Story with Read more/less - hidden in focus mode */}
      {story && !focusModeEnabled && (
        <div className="mb-6 max-w-2xl mx-auto">
          <div
            id="recipe-story"
            className="rounded-lg p-4 border-l-4"
            style={{
              backgroundColor: 'var(--color-cream-light)',
              borderColor: 'var(--color-burnt-orange)'
            }}
          >
            <p
              className={`leading-relaxed text-sm italic transition-all ${
                isLongStory && !isStoryExpanded ? "line-clamp-1 overflow-hidden" : ""
              }`}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {renderStoryWithLinks(story)}
            </p>
            {isLongStory && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setIsStoryExpanded((prev) => !prev)}
                  className="flex items-center text-sm font-medium transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  aria-expanded={isStoryExpanded}
                  aria-controls="recipe-story"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  {isStoryExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  <span className="ml-1">
                    {isStoryExpanded ? "Read less" : "Read more"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags - hidden in focus mode */}
      {tags && tags.length > 0 && !focusModeEnabled && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/recipes?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1 text-sm rounded-full transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-sage-green)',
                color: 'white',
                display: 'inline-block'
              }}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Meta info - hidden in focus mode */}
      {!focusModeEnabled && (
        <div className="text-sm text-center mb-4" style={{ color: 'var(--color-text-muted)' }}>
          {[
            (first_made || last_made) &&
              (first_made === last_made
                ? `First made: ${formatDate(first_made)}`
                : `First made: ${formatDate(first_made)}${
                    last_made ? `, Last made: ${formatDate(last_made)}` : ""
                  }`),

            yields && (
              <span className="inline-flex items-center gap-1">
                <Users size={14} strokeWidth={1.5} /> {yields}
              </span>
            ),

            time && (
              <span className="inline-flex items-center gap-1">
                <Clock size={14} strokeWidth={1.5} /> {time}
              </span>
            ),

            source && (
              <>
                {source.type}:{" "}
                {source.url ? (
                  <a
                    href={source.url}
                    className="underline transition-colors"
                    style={{ color: 'var(--color-burnt-orange)' }}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-burnt-orange-dark)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-burnt-orange)';
                    }}
                  >
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </>
            ),
          ]
            .filter(Boolean)
            .map((item, idx, arr) => (
              <span key={idx}>
                {item}
                {idx < arr.length - 1 && <span className="mx-3">|</span>}
              </span>
            ))}
        </div>
      )}
    </header>
  );
}
