import React, { createContext, useEffect, useState } from "react";
export const LayoutContext = createContext();
function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
export const LayoutProvider = ({ children }) => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return <LayoutContext.Provider value={{ windowSize }}>{children}</LayoutContext.Provider>;
};
