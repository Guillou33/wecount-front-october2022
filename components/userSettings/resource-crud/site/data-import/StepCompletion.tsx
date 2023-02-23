
import { t } from "i18next";
import { upperFirst } from "lodash";
import React from "react";
import styles from "@styles/userSettings/importLayout.module.scss";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { DataImportErrors, SitesDataList } from "@reducers/dataImport/sitesDataReducer";
import { RootState } from "@reducers/index";
import useHierarchicalSites from "@hooks/core/useHierarchicalSites";
import SiteCompletionRow from "./completion/SiteCompletionRow";
import { SiteDataForCreation } from "@custom-types/core/Sites";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import useAllSiteList from "@hooks/core/useAllSiteList";
import _ from "lodash";
import ExistingSiteRow from "./completion/ExistingSiteRow";

interface Props {
  step: 1 | 2 | 3;
  disableValidation: boolean;
  onNextStepClick: () => void;
  onPreviousStepClick: () => void;
  onFinalizeClick: () => void;
  onCancelClick: () => void;
}

const StepCompletion = ({
    step,
    disableValidation,
    onNextStepClick,
    onPreviousStepClick,
    onFinalizeClick,
    onCancelClick
}: Props) => {
    const sitesDataList = useSelector<RootState, SitesDataList>(state => state.dataImport.sitesData.sitesDataList);

    const sites: SiteDataForCreation[] = useHierarchicalSites(sitesDataList);

    const parentSiteDataNames: string[] = 
        sites.filter(site => site.parent !== null && site.parent !== "")
            .map(site => site.parent)
            .flat();

    const mainSites = useAllSiteList({
        includeArchived: false, 
        includeSubSites: false
    });

    const mainSitesForDisplay = _.filter(mainSites, site => parentSiteDataNames.includes(site.name));

    const isSaving = useSelector<RootState, boolean>(state => state.dataImport.sitesData.requestStatus.isSaving);
    const isSaved = useSelector<RootState, boolean>(state => state.dataImport.sitesData.requestStatus.isSaved);
    const errorSave = useSelector<RootState, DataImportErrors | null>(state => state.dataImport.sitesData.requestStatus.error);
    
    return (
        <>
            <div className={cx("wecount-table", styles.stepContainer)}>
                <h1>{upperFirst(t("site.import.resume.title"))}</h1>
                {errorSave !== null && 
                    <span className={styles.error}>
                        {upperFirst(t("site.import.error.errorOccured"))}
                    </span>
                }
                <table className={cx(styles.importedSites)}>
                    <thead>
                        <th>{upperFirst(t("site.import.name"))}</th>
                        <th>{upperFirst(t("global.common.description"))}</th>
                    </thead>
                    <tbody>
                        {sites.filter(siteData => siteData.level === 1).map(site => (
                            <SiteCompletionRow 
                                site={site}
                            />
                        ))}
                        {mainSitesForDisplay.map(mainSite => (
                            <ExistingSiteRow 
                                mainSite={mainSite}
                                subSites={sites.filter(subSite => subSite.parent === mainSite.name)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            <footer className={styles.footer}>
                <div className={cx(styles.footerContent)}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        {(!isSaved) && 
                            <>
                                <button className={styles.exit} onClick={onCancelClick}>
                                    {upperFirst(t("dataImport.common.cancel"))}
                                </button>
                                <button className={"button-2"} onClick={onPreviousStepClick}>
                                    {upperFirst(t("dataImport.common.previous"))}
                                </button>
                            </>
                        }
                    </div>
                    <div>
                        {(!isSaved && errorSave === null) ? 
                            <ButtonSpinner
                                spinnerOn={isSaving}
                                disabled={disableValidation}
                                className={cx("button-2")}
                                onClick={onNextStepClick}
                            >
                                {upperFirst(t("global.validate"))}
                            </ButtonSpinner>
                            : errorSave !== null ?
                                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    <span className={styles.error} style={{marginRight: 15}}>
                                        {upperFirst(t("site.import.error.errorOccured"))}
                                    </span>
                                    <button className={"button-2"} onClick={onPreviousStepClick}>
                                        {upperFirst(t("global.back"))}
                                    </button>
                                </div>
                            : <>
                                <button className={"button-1"} onClick={onFinalizeClick}>
                                    {upperFirst(t("site.import.finished"))} - {upperFirst(t("site.import.backToSettings"))}
                                </button>
                            </>
                        }
                    </div>
                </div>
            </footer>
        </>
    )
}

export default StepCompletion;