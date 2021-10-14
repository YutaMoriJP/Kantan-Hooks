/// <reference types="react" />
declare const useHeight: <T extends import("react").RefObject<HTMLElement> | {
    current: Window;
}>(ref: T) => null | number;
export default useHeight;
