/**
 *
 * @param {string} query - must be a media query like (min-width:300px) or (max-width:500px)
 * @returns {Boolean} - returns a boolean if the media query matches the viewport
 */
declare const useMediaQuery: (query: string) => boolean;
export default useMediaQuery;
