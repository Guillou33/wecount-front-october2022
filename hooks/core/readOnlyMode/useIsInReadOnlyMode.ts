import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";

function useIsInReadOnlyMode(): boolean {
  const isInReadOnlyMode = useSelector<RootState, boolean>(
    state => state.profile.company?.readonlyMode ?? false
  );

  return isInReadOnlyMode;
}

export default useIsInReadOnlyMode;
