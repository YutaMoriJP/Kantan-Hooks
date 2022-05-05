import { useState, useLayoutEffect, useRef } from "react";

const EVENTS = ["scroll", "resize"];

const useHeight = <T extends React.RefObject<HTMLElement> | { current: Window }>(ref: T): null | number => {
  // used for debounce function
  const timerID = useRef<NodeJS.Timeout>(null!);

  const [height, setHeight] = useState<number>(null!);

  useLayoutEffect(() => {
    // checks if ref is dom node or window object
    const heightProp = Window.prototype.isPrototypeOf(ref.current!) ? "innerHeight" : "clientHeight";

    // for easier read - not important
    const element: (HTMLElement | Window) & {
      [key: string]: any;
    } = ref.current!;

    // sets initial height and not AFTER scroll is fired
    setHeight(element[heightProp]);

    let scrollTimerRunning = false;
    let windowTimerRunning = false;

    // used for debouncing state setter function
    const debounceScroll = () => {
      if (!scrollTimerRunning) {
        clearTimeout(timerID.current);

        timerID.current = setTimeout(() => {
          setHeight((previous) => {
            return previous + 0.0000001;
          });

          scrollTimerRunning = false;
        }, 800);
      } else {
        scrollTimerRunning = true;
      }
    };

    // scroll and resize handler need to have slightly different logic
    const debounceResize = () => {
      if (!windowTimerRunning) {
        clearTimeout(timerID.current);

        timerID.current = setTimeout(() => {
          setHeight((): number => {
            return element[heightProp];
          });

          scrollTimerRunning = false;
        }, 800);
      } else {
        scrollTimerRunning = true;
      }
    };

    const registerHandler = (index: number) => (index === 0 ? debounceScroll : debounceResize);

    EVENTS.forEach((eventType, index) => window.addEventListener(eventType, registerHandler(index)));

    return () => EVENTS.forEach((eventType, index) => window.removeEventListener(eventType, registerHandler(index)));
  }, []);

  let num = Math.floor(height);

  return num;
};

export default useHeight;
