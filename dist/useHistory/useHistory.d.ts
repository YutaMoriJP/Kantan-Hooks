/// <reference types="react" />
declare const useHistory: <T extends {
    id?: string | undefined;
} | null>(value: T) => {
    history: T[];
    filterHistory: (value: {
        index: number;
    } | {
        id: string;
    }) => void;
    clearHistory: () => void;
    setHistory: import("react").Dispatch<import("react").SetStateAction<T[]>>;
};
export default useHistory;
