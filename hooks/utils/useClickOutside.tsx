import { useEffect, useRef } from "react";

export const useClickOutside = (callback: Function) => {
  const ref = useRef<any>();
  const ref2 = useRef<any>();

  const handleClick = (e: any) => {
    if (
      ref.current && !ref.current.contains(e.target)
      && (!ref2.current || ref2.current && !ref2.current.contains(e.target))
    ) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return [ref, ref2];
};
