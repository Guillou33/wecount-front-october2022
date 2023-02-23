import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";

import { setMappableData } from "@actions/dataImport/entryData/entryDataActions";
import useAllUsers from "@hooks/core/useAllUsers";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

const EditAllWriterModale = () => {
  const dispatch = useDispatch();
  const allUsers = useAllUsers();
  const writers = allUsers.reduce(
    (acc, { id, email }) => {
      acc[id] = { id, email };
      return acc;
    },
    { [-1]: { id: -1, email: upperFirst(t("entry.unaffected")) } } as Record<
      number,
      { id: number; email: string }
    >
  );

  const [writerId, setWriterId] = useState<number | null>(null);

  const previewWriter = writers[writerId ?? -2]?.email;

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editWriter", { count })
        )
      }
      icon={<i className="fa fa-user-edit" />}
      onApplyButtonClick={entryDataIds => {
        if (writerId != null) {
          dispatch(
            setMappableData({
              entryDataIds,
              dataName: "writer",
              id: writerId,
              entityName: previewWriter ?? "",
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={writerId}
          onOptionClick={setWriterId}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseWriter")
          )}
        >
          {props => (
            <>
              {Object.values(writers).map(({ id, email }) => (
                <Option {...props} key={id} value={id}>
                  {email}
                </Option>
              ))}
            </>
          )}
        </SelectOne>
      }
      previewValues={{
        writer: previewWriter,
      }}
    />
  );
};

export default EditAllWriterModale;
