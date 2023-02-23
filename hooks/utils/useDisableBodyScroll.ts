import { useEffect } from "react";

function useDisableBodyScroll() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  });
}

export default useDisableBodyScroll;
