"use client";

import { useState } from "react";
import type { Recipe } from "@/types";
import { Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";

type Props = {
  recipe: Recipe;
};

export default function RecipeHeader({ recipe }: Props) {
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
      {image && (
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

      {/* Title with Story Toggle */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col flex-1 min-w-0">
          <h1 className="text-4xl font-light italic text-gray-900">{title}</h1>
          {subtitle && (
            <h2
              className="text-lg font-normal text-gray-600 mt-1 truncate"
              title={subtitle}
            >
              {subtitle}
            </h2>
          )}
        </div>
        {story && (
          <button
            onClick={() => setIsStoryExpanded(!isStoryExpanded)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors ml-4 mt-1 group flex-shrink-0"
            aria-expanded={isStoryExpanded}
            aria-controls="recipe-story"
          >
            <span className="text-sm font-medium">Behind the Recipe</span>
            {isStoryExpanded ? (
              <ChevronUp
                size={14}
                className="group-hover:translate-y-[-1px] transition-transform"
              />
            ) : (
              <ChevronDown
                size={14}
                className="group-hover:translate-y-[1px] transition-transform"
              />
            )}
          </button>
        )}
      </div>

      {/* Story Content */}
      {story && (
        <div
          id="recipe-story"
          className={`overflow-hidden transition-all duration-300 ease-in-out mb-6 ${
            isStoryExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-200 max-w-2xl mx-auto">
            <p className="text-gray-700 leading-relaxed text-sm italic">
              {story}
            </p>
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
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

      <div className="text-sm text-gray-500 text-center mb-4">
        {[
          /* first/last-made dates */
          (first_made || last_made) &&
            (first_made === last_made
              ? `First made: ${formatDate(first_made)}`
              : `First made: ${formatDate(first_made)}${
                  last_made ? `, Last made: ${formatDate(last_made)}` : ""
                }`),

          /* yields with icon */
          yields && (
            <span className="inline-flex items-center gap-1">
              <Users size={14} strokeWidth={1.5} /> {yields}
            </span>
          ),

          /* time with icon */
          time && (
            <span className="inline-flex items-center gap-1">
              <Clock size={14} strokeWidth={1.5} /> {time}
            </span>
          ),

          /* source */
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
          .map((item, index, array) => (
            <span key={index}>
              {item}
              {index < array.length - 1 && <span className="mx-3">|</span>}
            </span>
          ))}
      </div>
    </header>
  );
}
