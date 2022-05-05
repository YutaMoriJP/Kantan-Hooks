import { useState, useEffect, useRef } from "react";

/**
 *
 * @param {string} key - key value of localStorage
 * @param {any} defaultValue - initial state value
 * @param {object} option - options object to control how to serialize/deserialize localStroage
 * @returns {Array} [state, setState] - first value is the state to be stored in localstorage, and the second value is the state setter function, essentially replicating how the useState API works
 */

function getDefaultValue<T>(defaultValue: T) {
  return defaultValue instanceof Function ? defaultValue() : defaultValue;
}

function useLocalStorage<T>(
  defaultValue: T | (() => T),
  key: string,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  // lazily load state
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") getDefaultValue(defaultValue);

    const storedData = localStorage.getItem(key);

    if (storedData) {
      return deserialize(storedData);
    }

    // checks if defaultValue is a function - same as lazy loading useState value
    return getDefaultValue(defaultValue);
  });

  // used to check if localStorage key was updated
  const prevKeyRef = useRef(key);

  // if data is stored in localStorage and app is rendered server side and window is undefined
  // then set the state in useEffect
  useEffect(() => {
    const storedData = localStorage.getItem(key);

    if (storedData) setState(deserialize(storedData));
  }, []);

  useEffect(() => {
    const prevKey = prevKeyRef.current;

    if (prevKey !== key) {
      // this means that the key value has changed, so old storage must be deleted
      localStorage.removeItem(prevKey);
    }

    // Update prevKey to current key for next useEffect invocation
    prevKeyRef.current = key;

    localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState] as const;
}

export default useLocalStorage;
