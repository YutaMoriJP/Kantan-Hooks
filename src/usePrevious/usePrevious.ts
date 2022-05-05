import { useEffect, useRef } from "react";

/**
 * @param {type} val - data can be any type, but if it's an object not managed by React(like a state), it should be ideally memoized
 * @returns value of the previous render. ref updates will not cause a re-render unlike state
 */

const usePrevious = <T>(val: T): T => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current = val;
  }, [val, ref]);

  return ref.current!;
};

export default usePrevious;
