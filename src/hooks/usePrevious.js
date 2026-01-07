import { useRef, useEffect } from "react";

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/*Usage*/

// const [count, setCount] = useState(0);
// const prevCount = usePrevious(count);
