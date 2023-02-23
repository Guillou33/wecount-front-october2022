import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";

import { PerimeterRole } from "@custom-types/wecount-api/auth";

import { setMappableData } from "@actions/dataImport/entryData/entryDataActions";
import useAllUsers from "@hooks/core/useAllUsers";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

const EditAllOwnerModale = () => {
  const dispatch = useDispatch();

  const allUsers = useAllUsers();
  const availableOwners = allUsers.filter(
    user =>
      user.roleWithinPerimeter !== PerimeterRole.PERIMETER_CONTRIBUTOR &&
      user.roleWithinPerimeter !== PerimeterRole.PERIMETER_COLLABORATOR
  );

  const owners = availableOwners.reduce(
    (acc, { id, email }) => {
      acc[id] = { id, email };
      return acc;
    },
    { [-1]: { id: -1, email: upperFirst(t("entry.unaffected")) } } as Record<
      number,
      { id: number; email: string }
    >
  );

  const [ownerId, setOwnerId] = useState<number | null>(null);

  const previewOwner = owners[ownerId ?? -2]?.email;

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editOwner", { count })
        )
      }
      icon={<i className="fa fa-user-tag" />}
      onApplyButtonClick={entryDataIds => {
        if (ownerId != null) {
          dispatch(
            setMappableData({
              entryDataIds,
              dataName: "owner",
              id: ownerId,
              entityName: previewOwner ?? "",
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={ownerId}
          onOptionClick={setOwnerId}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseOwner")
          )}
        >
          {props => (
            <>
              {Object.values(owners).map(({ id, email }) => (
                <Option {...props} key={id} value={id}>
                  {email}
                </Option>
              ))}
            </>
          )}
        </SelectOne>
      }
      previewValues={{
        owner: previewOwner,
      }}
    />
  );
};

export default EditAllOwnerModale;
