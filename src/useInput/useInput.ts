import { useState, useCallback } from "react";

type Options = {
  handleChange: (value: string, previousValue: string) => typeof value;
};

/**
 *
 * @param {String | Number} initial - Initial value that the input field should have. Default is an emtpy string ''
 * @param {Object} options - The options object can have a handleChange method that restricts the new input field value. For example, if lower case isn't allowed, the function can return value.toUpperCase()
 */

const useInput = (initial: string = "", options?: Options) => {
  const [value, setValue] = useState(initial);
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    //options object is not passed - run default behavior
    if (!options) {
      setValue(event.currentTarget.value);
    } else {
      //this block runs if user uses a custom handleChange function
      //like blocking always converting a lower case letter to an upper case
      //handleChange receives second argument which is essentially the previous value
      //for example, if the disallows a value to be the new state, they can simply return previousValue(value) and the input field will not change
      const newValue = options?.handleChange(event.currentTarget.value, value);
      setValue(newValue);
    }
  };
  const reset = useCallback(() => setValue(initial), []);
  return [{ value, onChange }, reset] as const;
};

export default useInput;
