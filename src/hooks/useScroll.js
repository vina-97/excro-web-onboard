import { useEffect, useState } from "react";

export function useScroll() {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScroll({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Set on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scroll;
}

// const { x, y } = useScroll();

// useEffect(() => {
//   if (y > 100) {
//     console.log("Scrolled 100px down");
//   }
// }, [y]);
