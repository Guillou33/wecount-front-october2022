import { createContext, MutableRefObject, useContext } from "react";

type Props = {
  children: any;
  containerRef: MutableRefObject<Element | null>;
};

const ModalContext = createContext<
  MutableRefObject<Element | null> | undefined
>(undefined);

const ModalContextProvider = ({ children, containerRef }: Props) => {
  return (
    <ModalContext.Provider value={containerRef}>
      {children}
    </ModalContext.Provider>
  );
};

function useModalContext() {
  return useContext(ModalContext);
}

export { ModalContextProvider, useModalContext };
