/**
 *
 * @param {string} toBeCopied - string value copied to the clipboard
 * @param {boolean} copied - boolean value that triggers the effect - should be togggled when a copy button is clicked like <button onClick={toggle}>COPY</button>
 * @param {Function} onOpen - opens a notification like 'value copied' or 'failed to copy'
 */
declare const useClipboard: (toBeCopied: string, copied: boolean, onOpen?: (() => void) | undefined) => {
    idle: boolean;
    pending: boolean;
    resolved: boolean;
    rejected: boolean;
    error: Error | null;
};
export default useClipboard;
