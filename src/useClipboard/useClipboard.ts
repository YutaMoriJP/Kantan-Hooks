import { useState, useEffect, useRef } from "react";

type ClipboardState =
  | {
      status: "idle";
      error: null;
    }
  | {
      status: "pending";
      error: null;
    }
  | {
      status: "resolved";
      error: null;
    }
  | {
      status: "rejected";
      error: Error;
    };

/**
 *
 * @param {string} toBeCopied - string value copied to the clipboard
 * @param {boolean} copied - boolean value that triggers the effect - should be togggled when a copy button is clicked like <button onClick={toggle}>COPY</button>
 * @param {Function} onOpen - opens a notification like 'value copied' or 'failed to copy'
 */

const useClipboard = (
  toBeCopied: string,
  copied: boolean,
  onOpen?: () => void
) => {
  console.log("useClipboard", toBeCopied, copied);
  const [{ status, error }, setStatus] = useState<ClipboardState>({
    status: "idle",
    error: null,
  });
  const [previous, setPrevious] = useState("");
  //blocks copy function from running in initial mount, and only copies value to clipboard if user chooses to do so
  const initialMount = useRef(true);
  //checks if window.navigator has the 'clipboard' property - must be called AFTER useState is called or else state is hooked conditionally
  if (!("clipboard" in navigator))
    setStatus(() => ({
      status: "rejected",
      error: new Error(
        "Clipboard API is not supported, please use a modern browser like Chrome or Firefox"
      ),
    }));

  //copying to the clipboard is an asynchronous operation
  //so the async operation is run inside useEffect
  useEffect(() => {
    //will prevent setting state when component using this hook is unmounted
    let isCanceled = false;
    const copy = async (): Promise<void> => {
      //prevents copy to run on initial mount and only copy to the clipboard if the user gives permission
      if (initialMount.current) return;
      //update status to pending so user can use loading state
      if (!isCanceled) setStatus({ status: "pending", error: null });
      try {
        //writeText receives the value to copy to the clipboard
        //it resolved to a promise when the async op. is done
        //it's asynchronous so the copying does not block the browser from rendering
        await navigator.clipboard.writeText(toBeCopied);
        //sets the status to 'resolved', so it was a success
        if (!isCanceled) {
          setStatus({ status: "resolved", error: null });
          setPrevious(toBeCopied);
        }
        //opens success message
        if (typeof onOpen === "function") {
          onOpen();
        }
      } catch (error) {
        //promise was rejected, updates status to resolved
        if (!isCanceled)
          setStatus(prevStatus => ({
            ...prevStatus,
            status: "rejected",
            error,
          }));
        //opens failure message
        if (typeof onOpen === "function") {
          onOpen();
        }
      }
    };
    //only call copy function if previous value is NOT the same as the new value
    //if the new value is an empty string, then don't call copy either because that's pointless
    if (previous !== toBeCopied && toBeCopied !== "") {
      copy();
    }

    return () => {
      //prevents state from updating on unmounted components
      isCanceled = true;
      //allows clipboard to copy - gives user control over copying to clipboard
      //if this control isn't implemented, the copy function will always run in the initial mount and control a value to the user's clipboard without proper permission
      initialMount.current = false;
    };
  }, [copied, onOpen]);

  //useClipboard returns an object with status properties as well as the error object
  //if async op. is rejected
  return {
    idle: status === "idle",
    pending: status === "pending",
    resolved: status === "resolved",
    rejected: status === "rejected",
    error,
  };
};
export default useClipboard;
