import { updateComputeMethodId, updateComputeMethodType } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { Option, SelectOne } from "@components/helpers/ui/selects";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import useTranslate from "@hooks/core/translation/useTranslate";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import { ComputeMethod, ComputeMethodMapping } from "@reducers/core/emissionFactorReducer";
import { RootState } from "@reducers/index";
import { upperFirst } from "lodash";
import { useDispatch, useSelector } from "react-redux";

type OptionData = {
  value: string;
  label: string;
}

const ComputeMethodField = () => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const currentDataInited = useSelector<RootState, boolean>(
    (state) => state.emissionFactorChoice.currentDataInited
  );
  const activityModelId = useSelector<RootState, number>(
    (state) => state.emissionFactorChoice.currentActivityModelId!
  );
  const computeMethodId = useSelector<RootState, number | undefined>(
    (state) => state.emissionFactorChoice.currentComputeMethodId
  );
  const computeMethodType = useSelector<
    RootState,
    ComputeMethodType | undefined
  >((state) => state.emissionFactorChoice.currentComputeMethodType);
  const activityModelInfo = useActivityModelInfo();
  const computeMethods = useSelector<
    RootState,
    ComputeMethodMapping | undefined
  >((state) => state.core.emissionFactor.mapping[activityModelId]);

  if (!currentDataInited) {
    return null;
  }

  const getComputationMethodOptions = (
    standardComputationOff: boolean = false
  ): OptionData[] => {
    const baseChoices: OptionData[] = [
      {
        label: upperFirst(t("entry.computeMethod.cef")),
        value: ComputeMethodType.CUSTOM_EMISSION_FACTOR,
      },
      {
        label: `${upperFirst(
          t("entry.computeMethod.insertRawData")
        )} (${t("entry.tco2.tco2")})`,
        value: ComputeMethodType.RAW_DATA,
      },
    ];

    const computeMethodsToShow: ComputeMethod[] =
      !computeMethods || standardComputationOff
        ? []
        : Object.values(computeMethods).filter((cm) => {
            return !cm.archivedDate || cm.id === computeMethodId;
          });
    const computeMethodsChoices: OptionData[] =
      computeMethodsToShow
        .sort((cm1: ComputeMethod, cm2: ComputeMethod) => {
          return cm1.position <= cm2.position ? -1 : 1;
        })
        .map((computeMethod) => {
          return {
            label: computeMethod.name,
            value: computeMethod.id.toString(),
          };
        });

    return [...computeMethodsChoices, ...baseChoices];
  };

  const computeMethodOptions = getComputationMethodOptions(
    activityModelInfo[activityModelId].onlyManual
  );

  const onComputeMethodChange = (value: string) => {
    if ([ComputeMethodType.RAW_DATA as string, ComputeMethodType.CUSTOM_EMISSION_FACTOR as string].indexOf(value) !== -1) {
      dispatch(updateComputeMethodType(value as ComputeMethodType));
      return;
    }
    dispatch(updateComputeMethodId(parseInt(value)));
  }

  return (
    <div>
      <SelectOne
        selected={
          (computeMethodType === ComputeMethodType.STANDARD
            ? computeMethodId?.toString()
            : computeMethodType) ?? null
        }
        onOptionClick={onComputeMethodChange}
        disabled={false}
      >
        {(ctx) => (
          <>
            {computeMethodOptions.map(({ label, value }) => (
              <Option {...ctx} key={value} value={value}>
                {label}
              </Option>
            ))}
          </>
        )}
      </SelectOne>
    </div>
  );
};

export default ComputeMethodField;
