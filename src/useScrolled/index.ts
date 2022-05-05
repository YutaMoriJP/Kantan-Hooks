import * as React from "react";

const useScrolled = () => {
  // checks if user scrolled and scrolled to top
  // used for styling
  const [scrolled, setScrolled] = React.useState(false);

  // used to clean up timer
  const timerRef = React.useRef<NodeJS.Timeout>(null!);

  React.useEffect((): (() => void) => {
    let isTimerRunning = false;

    // event handler when 'scroll' is called
    const debounce = (): void => {
      if (isTimerRunning) clearTimeout(timerRef.current);

      timerRef.current = setTimeout((): void => {
        setScrolled(true);
        // if window.scrollY points at 0, then user is scrolled to the top, and scrolled state should be false
        if (window.scrollY === 0) {
          setScrolled(false);
        }
      }, 450);
    };

    document.addEventListener("scroll", debounce);

    return (): void => {
      document.removeEventListener("scroll", debounce);
    };
  }, []);

  return [scrolled, setScrolled] as const;
};

export default useScrolled;
