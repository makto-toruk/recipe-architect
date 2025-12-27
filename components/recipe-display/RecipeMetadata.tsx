"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/recipe-types";
import { Clock, Users, ChevronUp, ChevronDown } from "lucide-react";
import { formatDate } from "@/components/utils/formatDate";
import Image from "next/image";

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
    image,
    first_made,
    last_made,
    source,
    time,
    yields,
    story,
  } = recipe;
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);

  return (
    <header className="mb-8">
      {/* Image - hidden in focus mode */}
      {image && !focusModeEnabled && (
        <div className="w-full max-w-2xl mx-auto mb-6">
          <Image
            src={`/images/${image}`}
            alt={title}
            width={800}
            height={384}
            className="recipe-hero-image w-full h-auto max-h-96 object-cover rounded-lg"
            priority
          />
        </div>
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
                isStoryExpanded ? "" : "line-clamp-1 overflow-hidden"
              }`}
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {story}
            </p>
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
          </div>
        </div>
      )}

      {/* Tags - hidden in focus mode */}
      {tags && tags.length > 0 && !focusModeEnabled && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-full"
              style={{
                backgroundColor: 'var(--color-sage-green)',
                color: 'white'
              }}
            >
              {tag}
            </span>
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
