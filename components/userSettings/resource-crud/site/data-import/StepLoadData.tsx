import FileInput from "@components/helpers/ui/FileInput";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import { t } from "i18next";
import { upperFirst } from "lodash";
import React from "react";
import styles from "@styles/userSettings/importLayout.module.scss";
import cx from "classnames";
import fileDownload from "js-file-download";
import { siteDataKeys } from "@lib/core/dataImport/rawDataToSiteData";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import moment from "moment";

interface Props {
  file: File | null;
  onFileChange: (file: File) => void;
  step: 1 | 2 | 3;
  disableNext: boolean;
  onNextStepClick: () => void;
  onCancelClick: () => void;
}

const StepLoadData = ({
    file,
    onFileChange,
    step,
    disableNext,
    onNextStepClick,
    onCancelClick
}: Props) => {
    useSetOnceSites();

    const companyName = useSelector<RootState, string>(state => state.profile.company?.name ?? "company");

    const downloadXlsx = () => {

        const xlsxHeaders = siteDataKeys.join(";");
        const xlsxName = `${companyName}-sites-${moment(Date.now()).format("YYYY-MM-DD")}.xlsx`;

        fileDownload(xlsxHeaders, xlsxName);
    }

    return (
        <>
            <div className={cx(styles.stepContainer)}>
                <h1>{upperFirst(t("dataImport.steps.load.title"))}</h1>
                <p>
                    {upperFirst(t("site.import.load.description1"))}{" "}
                    <a
                        href="https://wecount.notion.site/Comment-importer-mes-sites-dans-la-plateforme-a55e9593acc341db9bfb92ade530adbe"
                        target="blank"
                    >
                        {t("dataImport.common.link")}
                    </a>{" "}
                    {t("dataImport.steps.load.description2")}
                </p>
                <FileInput
                    value={file}
                    onChange={onFileChange}
                    className={styles.fileInput}
                    accept={[".xlsx"]}
                />
            </div>
            <footer className={styles.footer}>
                <div className={cx(styles.footerContent)}>
                    <div>
                        <button className={styles.exit} onClick={onCancelClick} style={{marginTop: 10}}>
                            {upperFirst(t("dataImport.common.cancel"))}
                        </button>
                    </div>
                    <div>
                        <button className={"button-2"} disabled={disableNext} onClick={onNextStepClick}>
                            {upperFirst(t("dataImport.common.next"))}
                        </button>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default StepLoadData;