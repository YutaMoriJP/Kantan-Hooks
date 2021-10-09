import { useEffect, useRef } from "react";

//check if abort controller is supported by the browser
const isAbortControllerSupported = window.hasOwnProperty("AbortController");
//if abort is not supported, pass a no-op function
const abort = () => null;
//a function that creates a new abort controller instance
const initAbortInstance = () =>
  isAbortControllerSupported
    ? new AbortController()
    : { signal: { aborted: false }, abort };
/**
 *
 * @param {Boolean} startNewAbortController - boolean that indicates whether a new controller needs to be instantiated, but a new controller is instantitated only if current controller is aborted
 * @returns
 */

const useAbortController = (startNewAbortController: boolean = false) => {
  const abosrtController = useRef(initAbortInstance());
  //runs if new fetch request was ABORTED, and new abortController should be instantiated
  useEffect((): void => {
    //if startNewAbortController is true then new controller needs to be instantiated
    //if abortController.current.signal.aborted is true, then request was aborted
    if (startNewAbortController && abosrtController.current.signal.aborted) {
      abosrtController.current = initAbortInstance();
    }
  }, [startNewAbortController, abosrtController.current.signal.aborted]);
  //only runs when component is unmounted, and controller.abort needs to be called to cancel fetch request
  useEffect(() => {
    return (): void => {
      abosrtController.current.abort();
    };
  }, []);

  return abosrtController.current;
};

export default useAbortController;
