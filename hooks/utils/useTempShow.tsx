import { useState } from "react";

export const useTempShow = (timeout: number = 2000): [
  boolean,
  () => void
] => {
  const [isTempShown, setIsTempShown] = useState(false);

  const show = () => {
    setIsTempShown(true);
    setTimeout(() => {
      setIsTempShown(false);
    }, timeout);
  }

  return [isTempShown, show];
};
