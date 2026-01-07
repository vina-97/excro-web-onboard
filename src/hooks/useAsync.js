import { useState, useEffect, useCallback } from "react";

export function useAsync(asyncFunction, dependencies = []) {
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(() => {
    setStatus("pending");
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus("success");
      })
      .catch((error) => {
        setError(error);
        setStatus("error");
      });
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { execute, status, value, error };
}

// const { status, value, error } = useAsync(() => fetch("/api/user").then(res => res.json()), []);
