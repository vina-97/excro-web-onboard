import { useState, useRef, useEffect } from "react";

export function useHover() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);
    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);

  return [ref, hovered];
}

// const [hoverRef, isHovered] = useHover();
// return <div ref={hoverRef}>{isHovered ? "Hovering!" : "Not hovering"}</div>;
