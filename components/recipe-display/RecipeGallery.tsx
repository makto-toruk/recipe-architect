"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Grid3X3 } from "lucide-react";
import type { GalleryImage } from "@/lib/recipe-types";

type Props = {
  images: GalleryImage[];
  title: string;
};

export default function RecipeGallery({ images, title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasMultipleImages = images.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowLeft") {
          goToPrevious();
        } else if (e.key === "ArrowRight") {
          goToNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext, closeLightbox]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Carousel */}
      <div className="w-full max-w-2xl mx-auto mb-6 relative">
        <div className="relative">
          <Image
            src={currentImage.src}
            alt={currentImage.caption || `${title} - Image ${currentIndex + 1}`}
            width={800}
            height={384}
            className="recipe-hero-image w-full h-auto max-h-96 object-cover rounded-lg"
            priority={currentIndex === 0}
          />

          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Grid button (open lightbox) */}
          {hasMultipleImages && (
            <button
              onClick={openLightbox}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Open gallery"
            >
              <Grid3X3 size={20} />
            </button>
          )}

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <p
            className="mt-2 text-sm text-center italic"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {currentImage.caption}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90" />

          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 text-white text-sm z-10">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.src}
              alt={
                currentImage.caption || `${title} - Image ${currentIndex + 1}`
              }
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Caption in lightbox */}
            {currentImage.caption && (
              <p className="mt-4 text-white text-center italic max-w-2xl">
                {currentImage.caption}
              </p>
            )}
          </div>

          {/* Navigation arrows in lightbox */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
            {images.map((img, idx) => (
              <button
                key={img.src}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? "border-white opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.caption || `Thumbnail ${idx + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
