import { useEffect, useRef, useState } from "react";

const useHistory = <T extends { id?: string } | null>(value: T) => {
  const [history, setHistory] = useState<T[]>([]);
  const initialRender = useRef<number>(0);

  useEffect(() => {
    //ensures state isn't set in initial render
    if (initialRender.current !== 0 && value !== null) {
      setHistory(prevHistory => [...prevHistory, value]);
    }
    return () => {
      //ensures state isn't updated in mounting phase
      if (initialRender.current === 0) {
        initialRender.current++;
      }
    };
  }, [value]);
  //empties entire history state
  const clearHistory = () => setHistory([]);
  //removes specific element from history state - either by index or id
  const filterHistory = (value: { index: number } | { id: string }) => {
    //allows user to filter by index value
    if ("index" in value) {
      const newHistory = history.filter((_, index) => +index !== +value.index);
      setHistory(newHistory);
    }
    //allows user to filter by id value - recommended
    if ("id" in value) {
      const newHistory = history.filter(user => user!.id !== value.id);
      setHistory(newHistory);
    }
  };

  return {
    history,
    filterHistory,
    clearHistory,
    setHistory,
  };
};
export default useHistory;
