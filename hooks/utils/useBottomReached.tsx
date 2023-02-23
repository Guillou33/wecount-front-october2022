import { useEffect, useRef } from "react";
import { MutableRefObject } from "react";

const DEFAULT_OFFSET_PIXELS_BOTTOM = 100;
const THRESHOLD_IN_MS = 100

const useBottomReached = ({
  containerRef,
  onBottomReached,
  offsetPixelsBottom,
  root,
}: {
  containerRef: any;
  onBottomReached: () => void;
  offsetPixelsBottom?: number;
  root?: MutableRefObject<Element | null>;
}) => {
  const lastCallbackDate = useRef<undefined | Date>(undefined);

  useEffect(() => {
    const ref = root?.current ?? document;
    ref.addEventListener("scroll", onScroll);
    return () => {
      ref.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onScroll = async () => {
    
    const container = containerRef.current;
    if (
      container &&
      container.getBoundingClientRect().bottom -
        (offsetPixelsBottom ?? DEFAULT_OFFSET_PIXELS_BOTTOM) <=
        window.innerHeight
    ) {
      if (!lastCallbackDate.current || (new Date().getTime() - lastCallbackDate.current.getTime()) > THRESHOLD_IN_MS) {
        lastCallbackDate.current = new Date();
        onBottomReached();
      }
    }
  };
};

export default useBottomReached;