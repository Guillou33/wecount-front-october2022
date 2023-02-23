import { useDispatch } from "react-redux";
import useIsInReadOnlyMode from "@hooks/core/readOnlyMode/useIsInReadOnlyMode";
import { showReadOnlyModeFeedbackPopup } from "@actions/readOnlyMode/readOnlyModeActions";
import { Function } from "@custom-types/utils";

/**
 *
 * @returns a HOF wich take a function as parameter and an option object.
 * It returns that function if not in read only mode, otherwise it returns a function
 * that will trigger the popup feedback if not disabled in the option object
 */
function useReadOnlyAccessControl() {
  const dispatch = useDispatch();
  const isInReadOnlyMode = useIsInReadOnlyMode();

  return <T extends Function>(
    fn: T,
    { withFeedback = true } = {}
  ): T | Function => {
    if (isInReadOnlyMode) {
      return () => {
        withFeedback && dispatch(showReadOnlyModeFeedbackPopup());
      };
    }
    return fn;
  };
}

export default useReadOnlyAccessControl;
