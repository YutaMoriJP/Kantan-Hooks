/// <reference types="react" />
export declare type PositionType = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
/**
 *
 * @param {object} ref - pass a ref that references a DOM node
 * @returns {object} - in the first render, it returns an empty object, then it returns the position of the DOM node {top, right, bottom, left}
 */
declare const usePosition: <T extends HTMLElement>(ref: import("react").MutableRefObject<T> | import("react").MutableRefObject<null>) => {} | PositionType;
export default usePosition;
