import { useState, useLayoutEffect, useRef } from "react";

const useWidth = <T extends React.RefObject<HTMLElement> | { current: Window }>(ref: T): null | number => {
  // used for timer in debounce function
  const timerID = useRef<NodeJS.Timeout>(null!);

  const [width, setWidth] = useState(null);

  useLayoutEffect(() => {
    // for easier read - not important
    const element: (HTMLElement | Window) & {
      [key: string]: any;
    } = ref.current!;

    // checks if ref is DOM node or window object
    const widthProp = Window.prototype.isPrototypeOf(ref.current!) ? "innerWidth" : "clientWidth";

    // sets the initial width, and not AFTER 'resize' occurs
    setWidth(element[widthProp]);

    // caled by `resize`
    const handleResize = () => setWidth(element[widthProp]);

    // used for debouncing state setter function - not set state for every `resize`
    let timerRunning = false;

    const debounce = () => {
      if (!timerRunning) {
        clearTimeout(timerID.current);

        timerID.current = setTimeout(() => {
          handleResize();
          timerRunning = false;
        }, 800);
      } else {
        timerRunning = true;
      }
    };

    window.addEventListener("resize", debounce);

    return () => {
      window.removeEventListener("resize", debounce);
      clearTimeout(timerID.current);
    };
  }, []);

  return width;
};

export default useWidth;
