'use client';

import { useEffect, useState, useRef } from 'react';
import { useScrollReveal } from '@/app/hooks/useScrollReveal';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function StarWarsBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showHyperspace, setShowHyperspace] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useScrollReveal(containerRef, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    onReveal: () => {
      if (!isRevealed) {
        setIsRevealed(true);
        setShowHyperspace(true);
        // Hide hyperspace after 2 seconds
        setTimeout(() => {
          setShowHyperspace(false);
        }, 2000);
      }
    }
  });

  useEffect(() => {
    // Generate random stars
    const newStars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 4 + 3,
        delay: Math.random() * 5,
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: showHyperspace 
              ? `hyperspace-jump 0.6s linear infinite`
              : `star-wars ${star.duration}s linear infinite`,
            animationDelay: showHyperspace ? '0s' : `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
            transformOrigin: 'center center',
          }}
        />
      ))}
    </div>
  );
}

