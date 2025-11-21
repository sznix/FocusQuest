import { useLayoutEffect, useRef } from "react";

/**
 * Lightweight auto-animate alternative that uses the FLIP technique to
 * animate position changes when list items are added, removed, or reordered.
 */
export function useListAutoAnimate<T extends HTMLElement>() {
  const parentRef = useRef<T | null>(null);
  const positions = useRef(new Map<Element, DOMRect>());

  useLayoutEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const newPositions = new Map<Element, DOMRect>();
    Array.from(parent.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      newPositions.set(child, child.getBoundingClientRect());

      if (!positions.current.has(child)) {
        child.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 200, easing: "ease-out" },
        );
      }
    });

    positions.current.forEach((previousRect, element) => {
      const newRect = newPositions.get(element);
      if (!newRect) return;

      const deltaX = previousRect.left - newRect.left;
      const deltaY = previousRect.top - newRect.top;

      if (deltaX !== 0 || deltaY !== 0) {
        element.animate(
          [
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            { transform: "translate(0, 0)" },
          ],
          { duration: 200, easing: "ease-out" },
        );
      }
    });

    positions.current = newPositions;
  });

  return [parentRef] as const;
}
