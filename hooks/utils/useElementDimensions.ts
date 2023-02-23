import { useState } from "react";

function useElementDimensions() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const refCallback = (ref: HTMLElement | null) => {
    if (ref != null) {
      setWidth(ref.offsetWidth);
      setHeight(ref.offsetHeight);
    }
  };

  return [refCallback, { width, height }] as const;
}

export default useElementDimensions;
