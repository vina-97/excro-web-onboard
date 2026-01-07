import { useState, useEffect } from "react";
const DEFAULT_THROTTLE_DELAY = 300;

export function useDebounce(value, delay = DEFAULT_THROTTLE_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/*Usage*/

// const [search, setSearch] = useState("");
// const debouncedSearch = useDebounce(search, 300);

// Use `debouncedSearch` to make API calls
