/// <reference types="react" />
/**
 *
 * @param {string} key - key value of localStorage
 * @param {any} defaultValue - initial state value
 * @param {object} option - options object to control how to serialize/deserialize localStroage
 * @returns {Array} [state, setState] - first value is the state to be stored in localstorage, and the second value is the state setter function, essentially replicating how the React.useState API works
 */
declare const useLocalStorage: (defaultValue: string | (() => any) | undefined, key: string, { serialize, deserailize }?: {
    serialize?: {
        (value: any, replacer?: ((this: any, key: string, value: any) => any) | undefined, space?: string | number | undefined): string;
        (value: any, replacer?: (string | number)[] | null | undefined, space?: string | number | undefined): string;
    } | undefined;
    deserailize?: ((text: string, reviver?: ((this: any, key: string, value: any) => any) | undefined) => any) | undefined;
}) => readonly [any, import("react").Dispatch<any>];
export default useLocalStorage;
