"use client";

import { useEffect, useState } from "react";

const images = [
  "/grieg/grieg-house.jpg",
  "/grieg/grieg-statue.jpg",
];

export default function RightBackdropSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 10000); // 10s per image
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="right-slider" aria-hidden>
      {images.map((src, i) => (
        <img key={src} src={src} alt="" className={i === index ? "active" : ""} />
      ))}
    </div>
  );
}


