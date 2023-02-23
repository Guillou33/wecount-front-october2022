import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

import { deleteEntryData } from "@actions/dataImport/entryData/entryDataActions";

import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/deleteAllModale.module.scss";

const DeleteAllModale = () => {
  const dispatch = useDispatch();

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(t("dataImport.multiActions.actionTitles.delete", { count }))
      }
      icon={<i className="fa fa-trash" />}
      onApplyButtonClick={entryDataIds => {
        dispatch(deleteEntryData({ entryDataIds }));
      }}
      applyButtonClassName={styles.applyButton}
      applyButtonLabel={upperFirst(t("global.delete"))}
    />
  );
};

export default DeleteAllModale;
