import { useState, useLayoutEffect, useRef } from "react";

const useHeight = <
  T extends React.RefObject<HTMLElement> | { current: Window }
>(
  ref: T
): null | number => {
  //used for debounce function
  const timerID = useRef<NodeJS.Timeout>(null!);
  const [height, setHeight] = useState<number>(null!);

  useLayoutEffect(() => {
    //checks if ref is dom node or window object
    const heightProp = Window.prototype.isPrototypeOf(ref.current!)
      ? "innerHeight"
      : "clientHeight";
    //for easier read - not important
    const element: (HTMLElement | Window) & {
      [key: string]: any;
    } = ref.current!;
    //sets new height - height + 0.1 is necessary to update the height on scroll even
    const handleResize = () => setHeight(element[heightProp] + 0.1);
    //sets initial height and not AFTER scroll is fired
    setHeight(element[heightProp]);
    let timerRunning = false;
    //used for debouncing state setter function
    const debounce = () => {
      if (!timerRunning) {
        timerID.current = setTimeout(() => {
          handleResize();
          timerRunning = false;
        }, 600);
        timerRunning = true;
      }
    };
    //only subscribe to scroll event if ref is a DOM node and window object
    if (heightProp !== "innerHeight")
      window.addEventListener("scroll", debounce);
    //import when window is resized and viewport height is changed
    window.addEventListener("resize", debounce);
    return () => {
      window.removeEventListener("scroll", debounce);
      clearTimeout(timerID.current);
    };
  }, [ref, timerID]);
  return Math.floor(height);
};

export default useHeight;
