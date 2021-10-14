import { useState, useLayoutEffect } from "react";

const useWidth = <T extends React.RefObject<HTMLElement> | { current: Window }>(
  ref: T
): null | number => {
  const [width, setWidth] = useState(null);
  useLayoutEffect(() => {
    const element: (HTMLElement | Window) & {
      [key: string]: any;
    } = ref.current!;
    const widthProp = Window.prototype.isPrototypeOf(ref.current!)
      ? "innerWidth"
      : "clientWidth";
    setWidth(element[widthProp]);
    const handleResize = () => setWidth(element[widthProp]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);
  return width;
};

export default useWidth;
