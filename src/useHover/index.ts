import { useRef, useState, useEffect, useCallback } from "react";

const MOUSE_EVENTS = ["mouseover", "mouseout"];

const isDomNode = (element: null | HTMLElement) =>
  element !== null &&
  (Object.getPrototypeOf(element) === HTMLElement.prototype ||
    Object.getPrototypeOf(Object.getPrototypeOf(element)) === HTMLElement.prototype);

const useHover = () => {
  const [hovered, setHovered] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    if (!isDomNode(ref.current)) return;

    const handleOver = () => setHovered(true);
    const handleOut = () => setHovered(false);

    const element = ref.current! as HTMLElement;

    const registerEvent = (index: number) => (index === 0 ? handleOut : handleOver);

    MOUSE_EVENTS.forEach((eventType, index) => element.addEventListener(eventType, registerEvent(index)));

    return () => {
      MOUSE_EVENTS.forEach((eventType, index) => element.removeEventListener(eventType, registerEvent(index)));
    };
  }, [ref.current, setHovered]);

  return [ref, hovered] as const;
};

export const useHoverReact = () => {
  const [hovered, setHovered] = useState(false);

  const onMouseOver = useCallback(() => setHovered(true), []);
  const onMouseOut = useCallback(() => setHovered(false), []);

  return [hovered, { onMouseOver, onMouseOut }] as const;
};

export default useHover;
