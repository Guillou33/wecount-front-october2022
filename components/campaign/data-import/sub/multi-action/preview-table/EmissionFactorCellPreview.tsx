import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { StandardComputeMethod } from "@lib/core/dataImport/computeMethod";

interface Props {
  emissionFactorId: number | null;
  computeMethod: StandardComputeMethod;
  activityModelId: number | null | undefined;
  preview?: string;
}

const EmissionFactorCellPreview = ({
  emissionFactorId,
  computeMethod,
  activityModelId,
  preview,
}: Props) => {
  const computeMethods = useSelector((state: RootState) =>
    activityModelId != null
      ? state.core.emissionFactor.mapping[activityModelId]
      : {}
  );
  const emissionFactorName = computeMethods[
    computeMethod.id
  ]?.emissionFactorMappings?.find(
    ef => ef.emissionFactor.id === emissionFactorId
  )?.emissionFactor.name;

  return <td>{preview ?? emissionFactorName}</td>;
};

export default EmissionFactorCellPreview;
