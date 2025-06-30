"use client";
import { useEffect } from "react";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function useScrollAnimation(
  threshold: number = 0.2,
  triggerOnce: boolean = false
): [React.RefCallback<Element>, ReturnType<typeof useAnimation>] {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold, triggerOnce });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else if (!triggerOnce) {
      controls.start({ opacity: 0, y: 40 });
    }
  }, [inView]);

  return [ref, controls];
}
