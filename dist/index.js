

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

var useToggle = function (initial) {
    if (initial === void 0) { initial = false; }
    var _a = react.useState(initial), open = _a[0], setOpen = _a[1];
    var toggle = react.useCallback(function () { return setOpen(function (prevBool) { return !prevBool; }); }, []);
    var onOpen = react.useCallback(function () { return setOpen(true); }, []);
    var onClose = react.useCallback(function () { return setOpen(false); }, []);
    return { open: open, toggle: toggle, onOpen: onOpen, onClose: onClose };
};

/**
 *
 * @param {String | Number} initial - Initial value that the input field should have. Default is an emtpy string ''
 * @param {Object} options - The options object can have a handleChange method that restricts the new input field value. For example, if lower case isn't allowed, the function can return value.toUpperCase()
 */
var useInput = function (initial, options) {
    if (initial === void 0) { initial = ""; }
    var _a = react.useState(initial), value = _a[0], setValue = _a[1];
    var onChange = function (event) {
        //options object is not passed - run default behavior
        if (!options) {
            setValue(event.currentTarget.value);
        }
        else {
            //this block runs if user uses a custom handleChange function
            //like blocking always converting a lower case letter to an upper case
            //handleChange receives second argument which is essentially the previous value
            //for example, if the disallows a value to be the new state, they can simply return previousValue(value) and the input field will not change
            var newValue = options === null || options === void 0 ? void 0 : options.handleChange(event.currentTarget.value, value);
            setValue(newValue);
        }
    };
    var reset = react.useCallback(function () { return setValue(initial); }, []);
    return [{ value: value, onChange: onChange }, reset];
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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/**
 *
 * @param {string} toBeCopied - string value copied to the clipboard
 * @param {boolean} copied - boolean value that triggers the effect - should be togggled when a copy button is clicked like <button onClick={toggle}>COPY</button>
 * @param {Function} onOpen - opens a notification like 'value copied' or 'failed to copy'
 */
var useClipboard = function (toBeCopied, copied, onOpen) {
    var _a = react.useState({
        status: "idle",
        error: null,
    }), _b = _a[0], status = _b.status, error = _b.error, setStatus = _a[1];
    //blocks copy function from running in initial mount, and only copies value to clipboard if user chooses to do so
    var initialMount = react.useRef(true);
    //checks if window.navigator has the 'clipboard' property - must be called AFTER useState is called or else state is hooked conditionally
    if (!("clipboard" in navigator))
        setStatus(function () { return ({
            status: "rejected",
            error: new Error("Clipboard API is not supported, please use a modern browser like Chrome or Firefox"),
        }); });
    //copying to the clipboard is an asynchronous operation
    //so the async operation is run inside useEffect
    react.useEffect(function () {
        //if string is empty then return from function and do not copy to clipboard as that's pointless
        //will prevent setting state when component uses this hook is unmounted
        if (!toBeCopied)
            return;
        var isCanceled = false;
        var copy = function () { return __awaiter(void 0, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //prevents copy to run on initial mount and only copy to the clipboard if the user gives permission
                        if (initialMount.current)
                            return [2 /*return*/];
                        //update status to pending so user can use loading state
                        if (!isCanceled)
                            setStatus({ status: "pending", error: null });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        //writeText receives the value to copy to the clipboard
                        //it resolved to a promise when the async op. is done
                        //it's asynchronous so the copying does not block the browser from rendering
                        return [4 /*yield*/, navigator.clipboard.writeText(toBeCopied)];
                    case 2:
                        //writeText receives the value to copy to the clipboard
                        //it resolved to a promise when the async op. is done
                        //it's asynchronous so the copying does not block the browser from rendering
                        _a.sent();
                        //sets the status to 'resolved', so it was a success
                        if (!isCanceled)
                            setStatus({ status: "resolved", error: null });
                        //opens success message
                        //opens failure message
                        if (typeof onOpen === "function") {
                            onOpen();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        //promise was rejected, updates status to resolved
                        if (!isCanceled)
                            setStatus(function (prevStatus) { return (__assign(__assign({}, prevStatus), { status: "rejected", error: error_1 })); });
                        //opens failure message
                        if (typeof onOpen === "function") {
                            onOpen();
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        //call the copy function - copies value to clipboard
        copy();
        return function () {
            //prevents state from updating on unmounted components
            isCanceled = true;
            //allows clipboard to copy - gives user control over copying to clipboard
            //if this control isn't implemented, the copy function will always run in the initial mount and control a value to the user's clipboard without proper permission
            initialMount.current = false;
        };
    }, [toBeCopied, copied, onOpen]);
    //useClipboard returns an object with status properties as well as the error object
    //if async op. is rejected
    return {
        idle: status === "idle",
        pending: status === "pending",
        resolved: status === "resolved",
        rejected: status === "rejected",
        error: error,
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
var useMediaQuery = function (query) {
    var mql = window.matchMedia(query);
    var _a = react.useState(mql.matches), mediaQuery = _a[0], setMediaQuery = _a[1];
    react.useEffect(function () {
        var onChange = function () { return setMediaQuery(mql.matches); };
        mql.addEventListener("change", onChange);
    }, [mql]);
    return mediaQuery;
};

//check if abort controller is supported by the browser
var isAbortControllerSupported = window.hasOwnProperty("AbortController");
//if abort is not supported, pass a no-op function
var abort = function () { return null; };
//a function that creates a new abort controller instance
var initAbortInstance = function () {
    return isAbortControllerSupported
        ? new AbortController()
        : { signal: { aborted: false }, abort: abort };
};
/**
 *
 * @param {Boolean} startNewAbortController - boolean that indicates whether a new controller needs to be instantiated, but a new controller is instantitated only if current controller is aborted
 * @returns
 */
var useAbortController = function (startNewAbortController) {
    if (startNewAbortController === void 0) { startNewAbortController = false; }
    var abosrtController = react.useRef(initAbortInstance());
    //runs if new fetch request was ABORTED, and new abortController should be instantiated
    react.useEffect(function () {
        //if startNewAbortController is true then new controller needs to be instantiated
        //if abortController.current.signal.aborted is true, then request was aborted
        if (startNewAbortController && abosrtController.current.signal.aborted) {
            abosrtController.current = initAbortInstance();
        }
    }, [startNewAbortController, abosrtController.current.signal.aborted]);
    //only runs when component is unmounted, and controller.abort needs to be called to cancel fetch request
    react.useEffect(function () {
        return function () {
            abosrtController.current.abort();
        };
    }, []);
    return abosrtController.current;
};

var initial = { status: "idle", data: null, error: null };
var reducer = function (state, action) {
    switch (action.type) {
        case "pending":
            return __assign(__assign({}, state), { status: "pending" });
        case "resolved":
            return __assign(__assign({}, state), { status: "resolved", data: action.data });
        case "rejected":
            return __assign(__assign({}, state), { status: "rejected", error: action.error });
        default:
            throw new Error("invalid case");
    }
};
var useFetch = function (url, getData, params) {
    if (params === void 0) { params = {}; }
    react.useEffect(function () {
        console.log("usefetch mounts");
        return function () { return console.log("usefetch unmounts"); };
    }, []);
    var abortController = useAbortController(false);
    var _a = react.useReducer(reducer, initial), _b = _a[0], status = _b.status, data = _b.data, error = _b.error, dispatch = _a[1];
    react.useEffect(function () {
        var isCanceled = false;
        var asyncSetState = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        dispatch({ type: "pending" });
                        return [4 /*yield*/, getData(url, params, abortController)];
                    case 1:
                        data_1 = _a.sent();
                        if (!isCanceled) {
                            dispatch({ type: "resolved", data: data_1 });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (!isCanceled && error_1.name !== "AbortError")
                            dispatch({ type: "rejected", error: error_1 });
                        if (error_1.name === "AbortError") {
                            console.log("aborted");
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        asyncSetState();
        return function () {
            console.log("useFetch cleanup");
            isCanceled = true;
        };
    }, [url]);
    return {
        idle: status === "idle",
        pending: status === "pending",
        resolved: status === "resolved",
        rejected: status === "rejected",
        data: data,
        error: error,
    };
};

exports.useAbortController = useAbortController;
exports.useClipboard = useClipboard;
exports.useFetch = useFetch;
exports.useInput = useInput;
exports.useMediaQuery = useMediaQuery;
exports.useToggle = useToggle;
