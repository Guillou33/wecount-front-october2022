import { MultiActionModaleContextProvider } from "@components/campaign/data-import/sub/multi-action/hooks/useMultiActionModaleContext";

import ClassicModal from "@components/helpers/modal/ClassicModal";
import DeleteAllModale from "@components/campaign/data-import/sub/multi-action/modale-variants/DeleteAllModale";
import EditAllCategoryModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllCategoryModale";
import EditAllActivityModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllActivityModale";
import EditAllSiteModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllSiteModale";
import EditAllProductModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllProductModale";
import EditAllOwnerModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllOwnerModale";
import EditAllWriterModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllWriterModale";
import EditAllComputeMethodModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllComputeMethodModale";
import EditAllEmissionFactorModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllEmissionFactorModale";
import EditAllTagsModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllTagsModale";
import EditAllUnitsModale from "@components/campaign/data-import/sub/multi-action/modale-variants/EditAllUnitsModale";

export type ModaleVariant =
  | "delete-all"
  | "edit-category"
  | "edit-activity"
  | "edit-site"
  | "edit-product"
  | "edit-owner"
  | "edit-writer"
  | "edit-tags"
  | "edit-compute-method"
  | "edit-emission-factor"
  | "edit-units";

interface Props {
  variant: ModaleVariant | null;
  onClose: () => void;
  step: 1 | 2 | 3;
  campaignId: number;
}

const MultiActionModale = ({ variant, onClose, step, campaignId }: Props) => {
  const fromStep = step === 2 ? "cartography-association" : "completion";
  return (
    <ClassicModal open={variant !== null} onClose={onClose}>
      <MultiActionModaleContextProvider
        value={{
          onClose,
          campaignId,
          fromStep,
        }}
      >
        {variant === "delete-all" && <DeleteAllModale />}
        {variant === "edit-category" && <EditAllCategoryModale />}
        {variant === "edit-activity" && <EditAllActivityModale />}
        {variant === "edit-site" && <EditAllSiteModale />}
        {variant === "edit-product" && <EditAllProductModale />}
        {variant === "edit-owner" && <EditAllOwnerModale />}
        {variant === "edit-writer" && <EditAllWriterModale />}
        {variant === "edit-compute-method" && <EditAllComputeMethodModale />}
        {variant === "edit-emission-factor" && <EditAllEmissionFactorModale />}
        {variant === "edit-tags" && <EditAllTagsModale />}
        {variant === "edit-units" && <EditAllUnitsModale />}
      </MultiActionModaleContextProvider>
    </ClassicModal>
  );
};

export default MultiActionModale;
