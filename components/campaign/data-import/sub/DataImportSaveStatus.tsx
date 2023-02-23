import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { upperFirst } from "lodash";
import { t } from "i18next";

import { RootState } from "@reducers/index";

import Spinner from "@components/helpers/ui/Spinner";

import {
  errorAcknoledged,
  reset as resetEntryData,
} from "@actions/dataImport/entryData/entryDataActions";
import { reset as resetTableSettings } from "@actions/dataImport/tableSettings/tableSettingsAction";

import styles from "@styles/campaign/data-import/sub/dataImportSaveStatus.module.scss";

interface Props {
  campaignId: number;
}

const DataImportSaveStatus = ({ campaignId }: Props) => {
  const dispatch = useDispatch();

  const { error, isSaving, isSaved } = useSelector(
    (state: RootState) => state.dataImport.entryData.requestStatus
  );

  function reset() {
    dispatch(resetEntryData());
    dispatch(resetTableSettings());
  }

  return (
    <div className={styles.saveStatus}>
      {isSaving && (
        <Spinner
          className={styles.spinnerContainer}
          spinnerClassName={styles.spinner}
          direction="vertical"
        >
          {upperFirst(t("dataImport.saveStatus.saveInProgress"))}
        </Spinner>
      )}
      {isSaved && (
        <>
          <i
            className={cx("far fa-check-circle", styles.icon, styles.success)}
          ></i>
          <p className={cx(styles.text, styles.bottom, styles.top)}>
            {upperFirst(t("dataImport.saveStatus.savedSuccessfully"))}
          </p>
          <Link href={`/campaigns/${campaignId}`}>
            <a className={cx("button-1", styles.button)} onClick={reset}>
              {upperFirst(t("cartography.backToCartography"))}
            </a>
          </Link>
        </>
      )}
      {error === "bad-input" && (
        <>
          <i
            className={cx("far fa-times-circle", styles.icon, styles.error)}
          ></i>
          <p className={cx(styles.text, styles.top)}>
            {upperFirst(t("dataImport.saveStatus.savingFailed"))}
          </p>
          <p className={cx(styles.text, styles.bottom)}>
            {upperFirst(t("dataImport.saveStatus.checkDataMessage"))}
          </p>
          <button
            className="button-1"
            onClick={() => dispatch(errorAcknoledged())}
          >
            {upperFirst(t("dataImport.saveStatus.checkData"))}
          </button>
        </>
      )}
      {error === "other" && (
        <>
          <i
            className={cx("far fa-times-circle", styles.icon, styles.error)}
          ></i>
          <p className={cx(styles.text, styles.top, styles.bottom)}>
            {upperFirst(t("dataImport.saveStatus.errorOccured"))}
          </p>
          <div>
            <button
              className="button-2"
              onClick={() => dispatch(errorAcknoledged())}
            >
              {upperFirst(t("dataImport.saveStatus.retry"))}
            </button>
          </div>
        </>
      )}
      {error === "forbidden" && (
        <>
          <i
            className={cx("far fa-times-circle", styles.icon, styles.error)}
          ></i>
          <p className={cx(styles.text, styles.bottom, styles.top)}>
            {upperFirst(t("dataImport.saveStatus.forbidden"))}
          </p>
          <Link href={`/campaigns/${campaignId}`}>
            <a className={cx("button-1", styles.button)} onClick={reset}>
              {upperFirst(t("cartography.backToCartography"))}
            </a>
          </Link>
        </>
      )}
    </div>
  );
};

export default DataImportSaveStatus;
