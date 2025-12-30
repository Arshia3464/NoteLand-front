"use client";

import { useEffect, useState } from "react";

interface SliderItem {
  id: number;
  name: string;
  description?: string;
  image?: string;
  link?: string;
  active?: boolean;
}

export default function Slider() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch sliders from backend
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch("http://localhost:8000/sliders/", {
          credentials: "include",
        });
        const data: SliderItem[] = await res.json();
        setSlides(data.filter((s) => s.active));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) return <div className="p-8 text-center">Loading slider...</div>;
  if (!slides.length) return null;

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-8">
      <div className="overflow-hidden relative h-64 sm:h-96 rounded-lg shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {slide.link ? (
              <a href={slide.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={`http://localhost:8000${slide.image}`}
                  alt={slide.name}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <img
                src={`http://localhost:8000${slide.image}`}
                alt={slide.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-4">
              <h3 className="text-lg font-bold">{slide.name}</h3>
              {slide.description && (
                <p className="text-sm">{slide.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              idx === current ? "bg-white" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
