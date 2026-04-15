'use client';

import { useRef, useEffect, useState } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation: string;
}

export default function AnimatedSection({ children, animation }: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => setIsVisible(true);

    // Always show content after a short delay as a fallback (covers iframe/embedded contexts)
    const fallback = setTimeout(show, 300);

    // Disable animations on low-end devices or data saver mode
    const isLowPowerMode = 'connection' in navigator &&
      ((navigator as any).connection?.saveData || (navigator as any).connection?.effectiveType === '2g');

    if (isLowPowerMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      show();
      clearTimeout(fallback);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          clearTimeout(fallback);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10px 0px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      clearTimeout(fallback);
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className={`${isVisible ? animation : 'opacity-0'} transition-opacity duration-500 transform-gpu`}>
      {children}
    </div>
  );
}
