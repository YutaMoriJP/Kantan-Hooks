export declare type Toggle = {
    open: boolean;
    toggle: () => void;
    onOpen: () => void;
    onClose: () => void;
};
declare const useToggle: (initial?: boolean) => Toggle;
export default useToggle;
