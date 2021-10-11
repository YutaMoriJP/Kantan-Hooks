import { useState, useEffect, useRef } from "react";

/**
 *
 * @param {string} key - key value of localStorage
 * @param {any} defaultValue - initial state value
 * @param {object} option - options object to control how to serialize/deserialize localStroage
 * @returns {Array} [state, setState] - first value is the state to be stored in localstorage, and the second value is the state setter function, essentially replicating how the React.useState API works
 */

const useLocalStorage = (
  defaultValue: string | (() => any) = "",
  key: string,
  { serialize = JSON.stringify, deserailize = JSON.parse } = {}
) => {
  //lazyily load state
  const [state, setState] = useState(() => {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return deserailize(storedData);
    }
    //checks if defaultValue is a function - same as lazy loading useState value
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });
  //used to check if key was updated
  const prevKeyRef = useRef(key);
  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      //this means that the key value has changed, so old storage must be deleted
      localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);
  return [state, setState] as const;
};

export default useLocalStorage;
