/// <reference types="react" />
declare const useWidth: <T extends import("react").RefObject<HTMLElement> | {
    current: Window;
}>(ref: T) => null | number;
export default useWidth;
