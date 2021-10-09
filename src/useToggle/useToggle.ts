import { useState, useCallback } from "react";

export type Toggle = {
  open: boolean;
  toggle: () => void;
  onOpen: () => void;
  onClose: () => void;
};

const useToggle = (initial: boolean = false): Toggle => {
  const [open, setOpen] = useState(initial);
  const toggle = useCallback((): void => setOpen(prevBool => !prevBool), []);
  const onOpen = useCallback((): void => setOpen(true), []);
  const onClose = useCallback((): void => setOpen(false), []);
  return { open, toggle, onOpen, onClose };
};

export default useToggle;
