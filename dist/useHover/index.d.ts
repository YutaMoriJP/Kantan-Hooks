/// <reference types="react" />
declare const useHover: () => readonly [import("react").MutableRefObject<null>, boolean];
export declare const useHoverReact: () => readonly [boolean, {
    readonly onMouseOver: () => void;
    readonly onMouseOut: () => void;
}];
export default useHover;
