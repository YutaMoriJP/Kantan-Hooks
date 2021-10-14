

function ___$insertStyle(css) {
    if (!css || typeof window === 'undefined') {
        return;
    }
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

const useToggle = (initial = false) => {
    const [open, setOpen] = react.useState(initial);
    const toggle = react.useCallback(() => setOpen(prevBool => !prevBool), []);
    const onOpen = react.useCallback(() => setOpen(true), []);
    const onClose = react.useCallback(() => setOpen(false), []);
    return { open, toggle, onOpen, onClose };
};

/**
 *
 * @param {String | Number} initial - Initial value that the input field should have. Default is an emtpy string ''
 * @param {Object} options - The options object can have a handleChange method that restricts the new input field value. For example, if lower case isn't allowed, the function can return value.toUpperCase()
 */
const useInput = (initial = "", options) => {
    const [value, setValue] = react.useState(initial);
    const onChange = (event) => {
        //options object is not passed - run default behavior
        if (!options) {
            setValue(event.currentTarget.value);
        }
        else {
            //this block runs if user uses a custom handleChange function
            //like blocking always converting a lower case letter to an upper case
            //handleChange receives second argument which is essentially the previous value
            //for example, if the disallows a value to be the new state, they can simply return previousValue(value) and the input field will not change
            const newValue = options === null || options === void 0 ? void 0 : options.handleChange(event.currentTarget.value, value);
            setValue(newValue);
        }
    };
    const reset = react.useCallback(() => setValue(initial), []);
    return [{ value, onChange }, reset];
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 *
 * @param {string} toBeCopied - string value copied to the clipboard
 * @param {boolean} copied - boolean value that triggers the effect - should be togggled when a copy button is clicked like <button onClick={toggle}>COPY</button>
 * @param {Function} onOpen - opens a notification like 'value copied' or 'failed to copy'
 */
const useClipboard = (toBeCopied, copied, onOpen) => {
    const [{ status, error }, setStatus] = react.useState({
        status: "idle",
        error: null,
    });
    const [previous, setPrevious] = react.useState("");
    //blocks copy function from running in initial mount, and only copies value to clipboard if user chooses to do so
    const initialMount = react.useRef(true);
    //checks if window.navigator has the 'clipboard' property - must be called AFTER useState is called or else state is hooked conditionally
    if (!("clipboard" in navigator))
        setStatus(() => ({
            status: "rejected",
            error: new Error("Clipboard API is not supported, please use a modern browser like Chrome or Firefox"),
        }));
    //copying to the clipboard is an asynchronous operation
    //so the async operation is run inside useEffect
    react.useEffect(() => {
        //will prevent setting state when component using this hook is unmounted
        let isCanceled = false;
        const copy = () => __awaiter(void 0, void 0, void 0, function* () {
            //prevents copy to run on initial mount and only copy to the clipboard if the user gives permission
            if (initialMount.current)
                return;
            //update status to pending so user can use loading state
            if (!isCanceled)
                setStatus({ status: "pending", error: null });
            try {
                //writeText receives the value to copy to the clipboard
                //it resolved to a promise when the async op. is done
                //it's asynchronous so the copying does not block the browser from rendering
                yield navigator.clipboard.writeText(toBeCopied);
                //sets the status to 'resolved', so it was a success
                if (!isCanceled) {
                    setStatus({ status: "resolved", error: null });
                    setPrevious(toBeCopied);
                }
                //opens success message
                if (typeof onOpen === "function") {
                    onOpen();
                }
            }
            catch (error) {
                //promise was rejected, updates status to resolved
                if (!isCanceled)
                    setStatus(prevStatus => (Object.assign(Object.assign({}, prevStatus), { status: "rejected", error })));
                //opens failure message
                if (typeof onOpen === "function") {
                    onOpen();
                }
            }
        });
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

//don't return the mediaQuery object!
//calling setState WILL re-render the function
//but as mediaQuery points to the same object, React will not bother to commit updates to the DOM
//but if mediaQuery state is a boolean, then React knows that it has changed and will commit updates to the DOM
//and reduces potential bugs
//useEffect only runs in the mounting & unmounting phase to subscribe and unsubscribe to the event handler
//go to src/Navbar.js to see how this hook can be utilized!
/**
 *
 * @param {String} query - must be a media query like (min-width:300px) or (max-width:500px)
 * @returns {Boolean} - returns a boolean if the media query matches the viewport, i.e. if the viewport width is 400px and the media query is (min-width:500px) then the return value is true
 */
const useMediaQuery = (query) => {
    const mql = window.matchMedia(query);
    const [mediaQuery, setMediaQuery] = react.useState(mql.matches);
    react.useEffect(() => {
        const onChange = () => setMediaQuery(mql.matches);
        mql.addEventListener("change", onChange);
    }, [mql]);
    return mediaQuery;
};

//check if abort controller is supported by the browser
const isAbortControllerSupported = window.hasOwnProperty("AbortController");
//if abort is not supported, pass a no-op function
const abort = () => null;
//a function that creates a new abort controller instance
const initAbortInstance = () => isAbortControllerSupported
    ? new AbortController()
    : { signal: { aborted: false }, abort };
/**
 *
 * @param {Boolean} startNewAbortController - boolean that indicates whether a new controller needs to be instantiated, but a new controller is instantitated only if current controller is aborted
 * @returns
 */
const useAbortController = (startNewAbortController = false) => {
    const abosrtController = react.useRef(initAbortInstance());
    //runs if new fetch request was ABORTED, and new abortController should be instantiated
    react.useEffect(() => {
        //if startNewAbortController is true then new controller needs to be instantiated
        //if abortController.current.signal.aborted is true, then request was aborted
        if (startNewAbortController && abosrtController.current.signal.aborted) {
            abosrtController.current = initAbortInstance();
        }
    }, [startNewAbortController, abosrtController.current.signal.aborted]);
    //only runs when component is unmounted, and controller.abort needs to be called to cancel fetch request
    react.useEffect(() => {
        return () => {
            abosrtController.current.abort();
        };
    }, []);
    return abosrtController.current;
};

const initial = { status: "idle", data: null, error: null };
const reducer = (state, action) => {
    switch (action.type) {
        case "pending":
            return Object.assign(Object.assign({}, state), { status: "pending" });
        case "resolved":
            return Object.assign(Object.assign({}, state), { status: "resolved", data: action.data });
        case "rejected":
            return Object.assign(Object.assign({}, state), { status: "rejected", error: action.error });
        default:
            throw new Error("invalid case");
    }
};
const useFetch = (url, getData, params = {}) => {
    const abortController = useAbortController(false);
    const [{ status, data, error }, dispatch] = react.useReducer(reducer, initial);
    react.useEffect(() => {
        let isCanceled = false;
        const asyncSetState = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                dispatch({ type: "pending" });
                const data = yield getData(url, params, abortController);
                if (!isCanceled) {
                    dispatch({ type: "resolved", data });
                }
            }
            catch (error) {
                if (!isCanceled && error.name !== "AbortError")
                    dispatch({ type: "rejected", error });
                if (error.name === "AbortError") {
                    console.log("aborted");
                }
            }
        });
        asyncSetState();
        return () => {
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

const useHistory = (value) => {
    const [history, setHistory] = react.useState([]);
    const initialRender = react.useRef(0);
    react.useEffect(() => {
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
    const filterHistory = (value) => {
        //allows user to filter by index value
        if ("index" in value) {
            const newHistory = history.filter((_, index) => +index !== +value.index);
            setHistory(newHistory);
        }
        //allows user to filter by id value - recommended
        if ("id" in value) {
            const newHistory = history.filter(user => user.id !== value.id);
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

/**
 * @param {type} val - data can be any type, but if it's an object not managed by React(like a state), it should be ideally memoized
 * @returns value of the previous render. ref updates will not cause a re-render unlike state
 */
const usePrevious = (val) => {
    const ref = react.useRef(null);
    react.useEffect(() => {
        ref.current = val;
    }, [val, ref]);
    return ref.current;
};

/**
 *
 * @param {string} key - key value of localStorage
 * @param {any} defaultValue - initial state value
 * @param {object} option - options object to control how to serialize/deserialize localStroage
 * @returns {Array} [state, setState] - first value is the state to be stored in localstorage, and the second value is the state setter function, essentially replicating how the React.useState API works
 */
const useLocalStorage = (defaultValue = "", key, { serialize = JSON.stringify, deserailize = JSON.parse } = {}) => {
    //lazyily load state
    const [state, setState] = react.useState(() => {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            return deserailize(storedData);
        }
        //checks if defaultValue is a function - same as lazy loading useState value
        return typeof defaultValue === "function" ? defaultValue() : defaultValue;
    });
    //used to check if key was updated
    const prevKeyRef = react.useRef(key);
    react.useEffect(() => {
        const prevKey = prevKeyRef.current;
        if (prevKey !== key) {
            //this means that the key value has changed, so old storage must be deleted
            localStorage.removeItem(prevKey);
        }
        prevKeyRef.current = key;
        localStorage.setItem(key, serialize(state));
    }, [key, state, serialize]);
    return [state, setState];
};

const useWidth = (ref) => {
    //used for timer in debounce function
    const timerID = react.useRef(null);
    const [width, setWidth] = react.useState(null);
    react.useLayoutEffect(() => {
        //for easier read - not important
        const element = ref.current;
        //checks if ref is DOM node or window object
        const widthProp = Window.prototype.isPrototypeOf(ref.current)
            ? "innerWidth"
            : "clientWidth";
        //sets the initial width, and not AFTER 'resize' occurs
        setWidth(element[widthProp]);
        //caled by `resize`
        const handleResize = () => setWidth(element[widthProp]);
        //used for debouncing state setter function - not set state for every `resize`
        let timerRunning = false;
        const debounce = () => {
            //if timerRunning is true, then don't set state
            if (!timerRunning) {
                timerID.current = setTimeout(() => {
                    handleResize();
                    //timer finished
                    timerRunning = false;
                }, 600);
            }
            //timer is running
            timerRunning = true;
        };
        window.addEventListener("resize", debounce);
        return () => {
            window.removeEventListener("resize", debounce);
            clearTimeout(timerID.current);
        };
    }, [ref, timerID]);
    return width;
};

const useHeight = (ref) => {
    //used for debounce function
    const timerID = react.useRef(null);
    const [height, setHeight] = react.useState(null);
    react.useLayoutEffect(() => {
        //checks if ref is dom node or window object
        const heightProp = Window.prototype.isPrototypeOf(ref.current)
            ? "innerHeight"
            : "clientHeight";
        //for easier read - not important
        const element = ref.current;
        //sets new height - height + 0.1 is necessary to update the height on scroll even
        const handleResize = () => setHeight(element[heightProp] + 0.1);
        //sets initial height and not AFTER scroll is fired
        setHeight(element[heightProp]);
        let timerRunning = false;
        //used for debouncing state setter function
        const debounce = () => {
            if (!timerRunning) {
                timerID.current = setTimeout(() => {
                    handleResize();
                    timerRunning = false;
                }, 600);
                timerRunning = true;
            }
        };
        window.addEventListener("scroll", debounce);
        //import when window is resized and viewport height is changed
        window.addEventListener("resize", debounce);
        return () => window.removeEventListener("scroll", debounce);
    }, [ref, timerID]);
    return Math.floor(height);
};

//returns an array with numbers with their floor
const getFloor = (...rest) => rest.map(Math.floor);
//calculates actual available space from top, right, bottom, and left
//learn more how getBoundingClientRect can be used - https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
const calculateActualRect = (rect, w, h) => {
    const { left: l, right: r, top: t, bottom: b } = rect;
    //gets the floor of all numbers
    const [left, right, top, bottom, width, height] = getFloor(l, r, t, b, w, h);
    //calculates actual space available on the right side
    const calcualtedRight = width - right;
    //calculates actual space available below
    const calculatedBottom = height - bottom;
    return {
        top,
        right: calcualtedRight,
        bottom: calculatedBottom,
        left,
    };
};
/**
 *
 * @param {object} ref - pass a ref that references a DOM node
 * @returns {object} - in the first render, it returns an empty object, then it returns the position of the DOM node {top, right, bottom, left}
 */
const usePosition = (ref) => {
    var _a;
    //hooks cannot be called conditionally, so call them here
    const height = useHeight({ current: window });
    const width = useWidth({ current: window });
    //ref.current will point at null initially
    const rect = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
    //if rect is undefined (ref.current=null), then return empty object
    if (!rect) {
        //this is returned in the initial render
        return {};
    }
    //this will be called after the initial render and returns the desired object
    return calculateActualRect(rect, width, height);
};

exports.useAbortController = useAbortController;
exports.useClipboard = useClipboard;
exports.useFetch = useFetch;
exports.useHeight = useHeight;
exports.useHistory = useHistory;
exports.useInput = useInput;
exports.useLocalStorage = useLocalStorage;
exports.useMediaQuery = useMediaQuery;
exports.usePosition = usePosition;
exports.usePrevious = usePrevious;
exports.useToggle = useToggle;
exports.useWidth = useWidth;
