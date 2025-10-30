'use client';

import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  onReveal?: () => void;
}

export function useScrollReveal(options: ScrollRevealOptions | number = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Handle both old API (number) and new API (object)
  const config = typeof options === 'number' 
    ? { threshold: options, rootMargin: '0px 0px -50px 0px' }
    : {
        threshold: options.threshold || 0.2,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
        onReveal: options.onReveal
      };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('revealed');
            if (config.onReveal) {
              config.onReveal();
            }
            // Optionally disconnect after revealing
            // observer.unobserve(element);
          }
        });
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [config.threshold, config.rootMargin, config.onReveal]);

  return elementRef;
}


