declare type RefState = AbortController | {
    signal: {
        aborted: boolean;
    };
    abort: () => void;
};
/**
 *
 * @param {Boolean} startNewAbortController - boolean that indicates whether a new controller needs to be instantiated, but a new controller is instantitated only if current controller is aborted
 * @returns
 */
declare const useAbortController: (startNewAbortController?: boolean) => RefState;
export default useAbortController;
