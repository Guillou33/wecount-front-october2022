import { createContext, useContext } from "react";

export type MultiActionModaleContext = {
  onClose: () => void;
  fromStep: "cartography-association" | "completion";
  campaignId: number;
};

const MultiActionModaleContext = createContext<MultiActionModaleContext | null>(
  null
);

type Props = {
  children: any;
  value: MultiActionModaleContext;
};

const MultiActionModaleContextProvider = ({ value, children }: Props) => {
  return (
    <MultiActionModaleContext.Provider value={value}>
      {children}
    </MultiActionModaleContext.Provider>
  );
};

function useMultiActionModaleContext() {
  const ctx = useContext(MultiActionModaleContext);
  if (ctx == null) {
    throw new Error(
      "useMultiActionModaleContext must be used within a MultiActionModaleContextProvider"
    );
  }
  return ctx;
}

export default useMultiActionModaleContext;
export { MultiActionModaleContextProvider };
