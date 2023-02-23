import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

import { ComputeMethod, isStandard } from "@lib/core/dataImport/computeMethod";

interface Props {
  computeMethod: ComputeMethod | null;
  activityModelId: number | null | undefined;
  preview?: string;
}

const ComputeMethodCellPreview = ({
  computeMethod,
  activityModelId,
  preview,
}: Props) => {
  const computeMethods = useSelector((state: RootState) =>
    activityModelId != null
      ? state.core.emissionFactor.mapping[activityModelId]
      : {}
  );

  function getComputeMethodText() {
    if (computeMethod != null) {
      if (isStandard(computeMethod)) {
        return computeMethods[computeMethod.id]?.name;
      }
      if (computeMethod.type === ComputeMethodType.DEPRECATED_EMISSION_FACTOR) {
        return upperFirst(t("entry.computeMethod.createEmissionFactor"));
      }
      if (computeMethod.type === ComputeMethodType.RAW_DATA) {
        return upperFirst(t("entry.computeMethod.insertRawData"));
      }
    }
  }

  return <td>{preview ?? getComputeMethodText() ?? ""}</td>;
};

export default ComputeMethodCellPreview;
