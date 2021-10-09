declare type Options = {
    handleChange: (value: string, previousValue: string) => typeof value;
};
/**
 *
 * @param {String | Number} initial - Initial value that the input field should have. Default is an emtpy string ''
 * @param {Object} options - The options object can have a handleChange method that restricts the new input field value. For example, if lower case isn't allowed, the function can return value.toUpperCase()
 */
declare const useInput: (initial?: string, options?: Options | undefined) => readonly [{
    readonly value: string;
    readonly onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}, (value?: string | undefined) => void];
export default useInput;
