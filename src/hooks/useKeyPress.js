import { useState, useEffect } from "react";

export function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const down = ({ key }) => key === targetKey && setKeyPressed(true);
    const up = ({ key }) => key === targetKey && setKeyPressed(false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [targetKey]);

  return keyPressed;
}

/*Usage*/

// const isEnterPressed = useKeyPress("Enter");
