import { useState, useEffect } from "react";

//don't return the mediaQuery object!
//calling setState WILL re-render the function
//but as mediaQuery points to the same object, React will not bother to commit updates to the DOM
//but if mediaQuery state is a boolean, then React knows that it has changed and will commit updates to the DOM
//and reduces potential bugs

//useEffect only runs in the mounting & unmounting phase to subscribe and unsubscribe to the event handler

//go to src/Navbar.js to see how this hook can be utilized!

/**
 *
 * @param {string} query - must be a media query like (min-width:300px) or (max-width:500px)
 * @returns {Boolean} - returns a boolean if the media query matches the viewport
 */

const useMediaQuery = (query: string) => {
  const mql: MediaQueryList = window.matchMedia(query);
  const [mediaQuery, setMediaQuery] = useState(mql.matches);
  useEffect((): void => {
    const onChange = (): void => setMediaQuery(mql.matches);
    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange);
      return;
      //safari 13.1 and lower does not support addEventListener
    } else if ("addListener" in mql) {
      mql.addListener(onChange);
    }
  }, [mql]);
  return mediaQuery;
};

export default useMediaQuery;
