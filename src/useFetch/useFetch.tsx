import { useEffect, useReducer } from "react";
import useAbortController from "./useAbortController";

const initial = { status: "idle", data: null, error: null };

type Action =
  | { type: "pending" }
  | { type: "resolved"; data: any }
  | { type: "rejected"; error: Error };

type State =
  | typeof initial
  | { status: "pending"; data: null; error: null }
  | { status: "resolved"; data: any; error: null }
  | { status: "rejected"; data: null; error: Error };

export const fetchData = (
  url: string,
  params: Object,
  abortController: AbortController
): Promise<Response | Error> => {
  return fetch(url, { ...params, signal: abortController.signal }).then(res => {
    if (!res.ok) new Error(`Error code ${res.status}`);
    return res.json();
  });
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "pending":
      return { ...state, status: "pending" };
    case "resolved":
      return { ...state, status: "resolved", data: action.data };
    case "rejected":
      return { ...state, status: "rejected", error: action.error };
    default:
      throw new Error("invalid case");
  }
};

const useFetch = (
  url: string,
  getData: typeof fetchData,
  params: Object = {}
) => {
  useEffect(() => {
    console.log("usefetch mounts");
    return () => console.log("usefetch unmounts");
  }, []);
  const abortController = useAbortController(false);

  const [{ status, data, error }, dispatch] = useReducer(reducer, initial);
  useEffect(() => {
    let isCanceled = false;
    const asyncSetState = async () => {
      try {
        dispatch({ type: "pending" });
        const data = await getData(
          url,
          params,
          abortController as AbortController
        );
        if (!isCanceled) {
          dispatch({ type: "resolved", data });
        }
      } catch (error) {
        if (!isCanceled && error.name !== "AbortError")
          dispatch({ type: "rejected", error });
        if (error.name === "AbortError") {
          console.log("aborted");
        }
      }
    };
    asyncSetState();

    return () => {
      console.log("useFetch cleanup");
      isCanceled = true;
    };
  }, [url]);

  return {
    idle: status === "idle",
    pending: status === "pending",
    resolved: status === "resolved",
    rejected: status === "rejected",
    data,
    error,
  };
};

export default useFetch;
