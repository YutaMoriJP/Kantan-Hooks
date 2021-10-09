/**
 *
 * @param {String} query - must be a media query like (min-width:300px) or (max-width:500px)
 * @returns {Boolean} - returns a boolean if the media query matches the viewport, i.e. if the viewport width is 400px and the media query is (min-width:500px) then the return value is true
 */
declare const useMediaQuery: (query: string) => boolean;
export default useMediaQuery;
