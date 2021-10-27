import { useEffect, useRef } from "react";

//if abort is not supported, pass a no-op function
const abort = () => null;
//a function that creates a new abort controller instance
const initAbortInstance = () =>
  window.hasOwnProperty("AbortController")
    ? new AbortController()
    : { signal: { aborted: false }, abort };

type RefState =
  | AbortController
  | { signal: { aborted: boolean }; abort: () => void };

/**
 *
 * @param {Boolean} startNewAbortController - boolean that indicates whether a new controller needs to be instantiated, but a new controller is instantitated only if current controller is aborted
 * @returns
 */

const useAbortController = (startNewAbortController: boolean = false) => {
  const abosrtController = useRef<RefState>(null!);
  //runs if new fetch request was ABORTED, and new abortController should be instantiated
  //only runs when component is unmounted, and controller.abort needs to be called to cancel fetch request
  useEffect(() => {
    //set abort instance inside effect to handle serve side rendered app, e.g. NextJS
    abosrtController.current = initAbortInstance();
    return (): void => {
      abosrtController.current.abort();
    };
  }, []);
  useEffect((): void => {
    //if startNewAbortController is true then new controller needs to be instantiated
    //if abortController.current.signal.aborted is true, then request was aborted
    if (startNewAbortController && abosrtController.current.signal.aborted) {
      abosrtController.current = initAbortInstance();
    }
  }, [startNewAbortController, abosrtController.current.signal.aborted]);

  return abosrtController.current;
};

export default useAbortController;

/*

//check if abort controller is supported by the browser
const isAbortControllerSupported = window.hasOwnProperty("AbortController");
//if abort is not supported, pass a no-op function
const abort = () => null;
//a function that creates a new abort controller instance
const initAbortInstance = () =>
  isAbortControllerSupported
    ? new AbortController()
    : { signal: { aborted: false }, abort };

type RefState =
  | AbortController
  | { signal: { aborted: boolean }; abort: () => void };

 

 const useAbortController = (startNewAbortController: boolean = false) => {
  const abosrtController = useRef<RefState>(null!);
  //runs if new fetch request was ABORTED, and new abortController should be instantiated
  //only runs when component is unmounted, and controller.abort needs to be called to cancel fetch request
  useEffect(() => {
    //set abort instance inside effect to handle serve side rendered app, e.g. NextJS
    abosrtController.current = initAbortInstance();
    return (): void => {
      abosrtController.current.abort();
    };
  }, []);
  useEffect((): void => {
    //if startNewAbortController is true then new controller needs to be instantiated
    //if abortController.current.signal.aborted is true, then request was aborted
    if (startNewAbortController && abosrtController.current.signal.aborted) {
      abosrtController.current = initAbortInstance();
    }
  }, [startNewAbortController, abosrtController.current.signal.aborted]);

  return abosrtController.current;
};

export default useAbortController;

*/
