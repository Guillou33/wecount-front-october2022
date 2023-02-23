import { useRef, useState, useEffect, MutableRefObject, Dispatch, SetStateAction } from "react";

function useRefState<T = any>(value: T): [T, MutableRefObject<T>, Dispatch<SetStateAction<T>>]  {
  const [stateValue, setStateValue] = useState<T>(value);
  const refValue = useRef(stateValue);

  useEffect(() => {
    refValue.current = stateValue
  }, [stateValue]);

  return [stateValue, refValue, setStateValue];
};

export { useRefState };
