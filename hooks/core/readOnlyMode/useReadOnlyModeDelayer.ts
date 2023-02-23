import fnDelayer from "@lib/utils/fnDelayer";
import useIsInReadOnlyMode from "@hooks/core/readOnlyMode/useIsInReadOnlyMode";
import { Function } from "@custom-types/utils";

function useReadOnlyModeDelayer(delay: number) {
  const isInReadOnlyMode = useIsInReadOnlyMode();

  return <T extends Function>(fn: T) =>
    isInReadOnlyMode ? fnDelayer(delay)(fn) : fn;
}

export default useReadOnlyModeDelayer;
