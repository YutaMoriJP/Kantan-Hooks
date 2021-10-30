import { useRef, useState, useEffect } from "react";

const isDomNode = (element: null | HTMLElement) =>
  element !== null &&
  (Object.getPrototypeOf(element) === HTMLElement.prototype ||
    Object.getPrototypeOf(Object.getPrototypeOf(element)) ===
      HTMLElement.prototype);

const useHover = () => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  console.log(ref);

  useEffect(() => {
    console.log(!isDomNode(ref.current));
    console.log(ref.current);

    if (!isDomNode(ref.current)) return;
    console.log(!isDomNode(ref.current));
    console.log(ref.current);

    const handleoOver = () => setHovered(true);
    const handleOut = () => setHovered(false);
    const element = ref.current! as HTMLElement;
    element.addEventListener("mouseover", handleoOver);
    element.addEventListener("mouseout", handleOut);
    return () => {
      element.removeEventListener("mouseover", handleoOver);
      element.removeEventListener("mouseout", handleOut);
    };
  }, [ref.current, setHovered]);
  return [ref, hovered] as const;
};

export const useHoverReact = () => {
  const [hovered, setHovered] = useState(false);
  const onMouseOver = () => setHovered(true);
  const onMouseOut = () => setHovered(false);
  return [hovered, { onMouseOver, onMouseOut }] as const;
};

export default useHover;
