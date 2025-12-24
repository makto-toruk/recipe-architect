"use client";

import { useState } from "react";
import type { MarkdownRecipe } from "@/types/markdown";
import { Clock, Users, ChevronUp, ChevronDown } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";

type Props = {
  recipe: MarkdownRecipe;
  focusModeEnabled?: boolean;
};

export default function RecipeHeader({
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
            className="w-full h-auto max-h-96 object-cover rounded-lg"
            priority
          />
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <h1 className="text-4xl font-light italic text-gray-900">{title}</h1>
        {subtitle && (
          <h2 className="text-lg font-normal text-gray-600 mt-1 whitespace-normal">
            {subtitle}
          </h2>
        )}
      </div>

      {/* Story with Read more/less - hidden in focus mode */}
      {story && !focusModeEnabled && (
        <div className="mb-6 max-w-2xl mx-auto">
          <div
            id="recipe-story"
            className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-200"
          >
            <p
              className={`text-gray-700 leading-relaxed text-sm italic transition-all ${
                isStoryExpanded ? "" : "line-clamp-1 overflow-hidden"
              }`}
            >
              {story}
            </p>
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setIsStoryExpanded((prev) => !prev)}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
                aria-expanded={isStoryExpanded}
                aria-controls="recipe-story"
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
              className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta info - hidden in focus mode */}
      {!focusModeEnabled && (
        <div className="text-sm text-gray-500 text-center mb-4">
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
                    className="underline text-gray-500 hover:text-gray-700"
                    target="_blank"
                    rel="noopener noreferrer"
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
