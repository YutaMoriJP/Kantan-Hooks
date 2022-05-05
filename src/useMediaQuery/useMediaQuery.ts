import { useState, useEffect } from "react";

const useMediaQuery = (query: string) => {
  const [mediaQuery, setMediaQuery] = useState(() => {
    //if code runs client side, then set media query immediately - useful for nextJS
    if (typeof window !== "undefined") return window.matchMedia(query).matches;

    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);

    setMediaQuery(window.matchMedia(query).matches);

    const onChange = (): void => setMediaQuery(window.matchMedia(query).matches);

    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange);

      //safari 13.1 and lower does not support addEventListener
    } else if ("addListener" in mql) {
      mql.addListener(onChange);
    }

    return () => {
      if ("addEventListener" in mql) {
        mql.removeEventListener("change", onChange);

        //safari 13.1 and lower does not support addEventListener
      } else if ("addListener" in mql) {
        mql.removeListener(onChange);
      }
    };
  }, []);

  return mediaQuery;
};

export default useMediaQuery;
