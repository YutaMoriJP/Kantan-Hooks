import useHeight from "../useHeight";
import useWidth from "../useWidth";

export type PositionType = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

// returns an array with numbers with their floor
const getFloor = (...rest: number[]): number[] => rest.map(Math.floor);

// calculates actual available space from top, right, bottom, and left
// learn more how getBoundingClientRect can be used - https:// developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
const calculateActualRect = (rect: DOMRect, w: number, h: number): PositionType => {
  const { left: l, right: r, top: t, bottom: b } = rect;

  // gets the floor of all numbers
  const [left, right, top, bottom, width, height] = getFloor(l, r, t, b, w, h);

  // calculates actual space available on the right side
  const calculatedRight = width - right;

  // calculates actual space available below
  const calculatedBottom = height - bottom;

  return {
    top,
    right: calculatedRight,
    bottom: calculatedBottom,
    left
  };
};

/**
 *
 * @param {object} ref - pass a ref that references a DOM node
 * @returns {object} - in the first render, it returns an empty object, then it returns the position of the DOM node {top, right, bottom, left}
 */

const usePosition = <T extends HTMLElement>(
  ref: React.MutableRefObject<T> | React.MutableRefObject<null>
): {} | PositionType => {
  // hooks cannot be called conditionally, so call them here
  const height = useHeight({ current: window });
  const width = useWidth({ current: window });

  // ref.current will point at null initially
  const rect = ref.current?.getBoundingClientRect();

  // if rect is undefined (ref.current=null), then return empty object
  if (!rect) {
    // this is returned in the initial render
    return {};
  }

  // this will be called after the initial render and returns the desired object
  return calculateActualRect(rect, width!, height!);
};
export default usePosition;
