import { useEffect, useState, useRef } from "react";

export function useIntersectionObserver(options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current; // capture current node once
    if (!node) {
      return;
    } // 🚫 Don't start observing if not mounted

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [options]); // `ref` itself doesn’t need to be in dependency array

  return [ref, isVisible];
}

// const [ref, isVisible] = useIntersectionObserver({
//     root: null, // viewport
//     rootMargin: "0px",
//     threshold: 0.1, // 10% visibility
//   });

//   return (
//     <div ref={ref}>
//       {isVisible && <h2>I’m visible in the viewport!</h2>}
//     </div>
//   );
