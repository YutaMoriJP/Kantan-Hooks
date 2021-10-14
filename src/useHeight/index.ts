import { useState, useLayoutEffect } from "react";

const useHeight = <
  T extends React.RefObject<HTMLElement> | { current: Window }
>(
  ref: T
): null | number => {
  const [height, setHeight] = useState(null);
  useLayoutEffect(() => {
    const element: (HTMLElement | Window) & {
      [key: string]: any;
    } = ref.current!;
    const heightProp = Window.prototype.isPrototypeOf(ref.current!)
      ? "innerHeight"
      : "clientHeight";
    setHeight(element[heightProp]);
    const handleResize = () => setHeight(element[heightProp]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);
  return height;
};

export default useHeight;
